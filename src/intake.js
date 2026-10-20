// Deterministic natural-language intake. Plain rules, no AI model, no network.
// Type or dictate (e.g. with Wispr Flow) into one box; we only fill what we can find.
export const MAX_LEN = 2000;
const NUM = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, fifteen: 15, twenty: 20, thirty: 30 };
const LANGS = [["Python", /\bpython\b/i], ["JavaScript", /\b(javascript|js|node\.?js)\b/i], ["TypeScript", /\b(typescript|ts)\b/i], ["Java", /\bjava\b/i], ["C++", /c\+\+/i], ["C#", /c#|\bc sharp\b/i], ["Go", /\bgolang\b|\bin go\b/i], ["Rust", /\brust\b/i], ["Kotlin", /\bkotlin\b/i], ["Swift", /\bswift\b/i], ["PHP", /\bphp\b/i], ["Ruby", /\bruby\b/i], ["Dart", /\bdart\b/i], ["MATLAB", /\bmatlab\b/i]];
const CATS = [
  ["Computer vision", /\b(cctv|opencv|yolo|object detection|image recognition|computer vision|cameras?|face recognition)\b/gi],
  ["AI and machine learning", /\b(ai|machine learning|neural|llm|chatbot|nlp|deep learning|ml)\b/gi],
  ["Mobile application", /\b(mobile app|android|ios|flutter|react native|iphone)\b/gi],
  ["Web application", /\b(website|web ?app|web application|web platform|frontend|react(?! native)|django|dashboard|portal)\b/gi],
  ["Developer tools", /\b(cli|command[- ]line|vs ?code extension|developer tool|plugin|sdk|library)\b/gi],
  ["Productivity", /\b(planner|to-?do|task manager|habit|calendar|reminder|productivity|note-?taking|scheduler|study)\b/gi],
  ["Social impact", /\b(ngo|community|charity|accessibility|social good|farmers?|waste|volunteer|donat\w+)\b/gi],
  ["Hardware and IoT", /\b(arduino|raspberry pi|esp32|sensor|iot|embedded|robot|microcontroller)\b/gi],
  ["Data science", /\b(dataset|data analysis|analytics|visuali[sz]ation|pandas|data science)\b/gi],
];
const GENERIC = /^(tool|app|application|website|web ?app|system|project|platform|software|program|bot|thing|solution)$/i;

function titleFrom(text) {
  const m = text.match(/\b(?:build|make|create|develop|design|code|write)\s+(?:(?:an?|the|my|our)\s+)?([^.,;!?\n]+?)(?=\s+(?:in|using|with|for|that|which|where|to|so)\b|[.,;!?\n]|$)/i);
  const cap = m && m[1].trim();
  if (!cap || GENERIC.test(cap) || cap.split(/\s+/).length > 8) return null;
  return cap.split(/\s+/).map((w) => (/[A-Z]/.test(w.slice(1)) || /^[A-Z]{2,}/.test(w) ? w : w[0].toUpperCase() + w.slice(1))).join(" ");
}

export function parseIntake(raw) {
  const text = String(raw || "").trim();
  if (!text) return { error: "Describe your project first." };
  if (text.length > MAX_LEN) return { error: `Keep the description under ${MAX_LEN} characters (it is ${text.length}).` };
  const values = {}, detected = [], missing = [], notes = [];
  const found = (key, label, value, shown = value) => { values[key] = value; detected.push({ label, value: String(shown) }); };
  const miss = (label, why) => missing.push({ label, why });

  const title = titleFrom(text);
  title ? found("title", "Title", title) : miss("Title", "Type a short project name below.");

  // Duration. Rates like "2 hours a day" are ignored because the plan needs a total.
  const NUMRE = `\\d+(?:\\.\\d+)?|${Object.keys(NUM).join("|")}`;
  const rate = new RegExp(`(?:\\b(?:${NUMRE})\\s*-?\\s*(?:hours?|hrs?|days?|weeks?)\\s+)?\\b(?:per|a|each|every)\\s+(?:day|week|hour)\\b`, "gi");
  const noRates = text.replace(rate, () => { notes.push('Daily or weekly rates (like "2 hours a day") are ignored. Enter the total time.'); return " "; });
  const re = new RegExp(`\\b(${NUMRE})\\s*-?\\s*(hours?|hrs?|days?|weeks?|months?)\\b`, "gi");
  const durs = [...noRates.matchAll(re)];
  if (durs.length) {
    const [whole, n, u] = durs[0];
    let time = isNaN(n) ? NUM[n.toLowerCase()] : Number(n), unit = /^h/i.test(u) ? "hours" : /^d/i.test(u) ? "days" : "weeks";
    if (/^m/i.test(u)) { time *= 4; unit = "weeks"; notes.push(`"${whole}" was converted to ${time} weeks.`); }
    if (time > 0 && time <= 1000) {
      found("time", "Time available", time, `${time} ${unit}`); values.unit = unit;
      if (durs.length > 1) notes.push(`Several durations were mentioned (${durs.map((d) => d[0]).join(", ")}). Used the first, so check it.`);
    } else miss("Time available", "The duration looked invalid. Enter it below.");
  } else miss("Time available", "No duration found. Add it under Constraints.");

  // Level. Negations such as "not a beginner" are ambiguous, so we do not guess.
  const levels = [];
  if (/\b(?:not|no longer)\s+(?:a\s+)?(?:beginner|newbie|expert)\b/i.test(text)) notes.push("A negated level (like \"not a beginner\") is ambiguous, so none was set.");
  else {
    if (/\b(beginner|newbie|novice|just (?:started|starting)|first project|new to (?:coding|programming))\b/i.test(text)) levels.push("beginner");
    if (/\b(intermediate|some experience)\b/i.test(text)) levels.push("intermediate");
    if (/\b(advanced|expert|experienced|senior|proficient)\b/i.test(text)) levels.push("advanced");
  }
  if (levels.length === 1) found("level", "Experience level", levels[0]);
  else { miss("Experience level", levels.length > 1 ? `Mixed signals (${levels.join(", ")}). Choose one. It stays on the default (beginner) until you do.` : "Not found. It stays on the default (beginner). Change it if needed."); }

  const langs = LANGS.filter(([, r]) => r.test(text)).map(([n]) => n);
  if (langs.length) { found("languages", "Languages", langs.join(", ")); if (langs.length > 1) notes.push(`Several languages were found (${langs.join(", ")}). Remove any you will not use.`); }
  else miss("Languages", "No programming language found. Add it under Constraints.");

  const scores = CATS.map(([n, r]) => [n, (text.match(r) || []).length]).filter(([, s]) => s > 0).sort((a, b) => b[1] - a[1]);
  if (scores.length && (scores.length === 1 || scores[0][1] > scores[1][1])) found("category", "Category", scores[0][0]);
  else miss("Category", scores.length ? `Could be ${scores.filter((s) => s[1] === scores[0][1]).map((s) => s[0]).join(" or ")}. Choose one.` : "Not clear from the description. Choose one.");
  return { values, detected, missing, notes: [...new Set(notes)] };
}
