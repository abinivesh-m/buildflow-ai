import { describe, expect, test } from "vitest";
import { parseIntake, MAX_LEN } from "./intake.js";
describe("parseIntake", () => {
  test("extracts the example sentence", () => {
    const r = parseIntake("I want to build an AI-powered study planner in Python. I'm a beginner and have ten days to finish it.");
    expect(r.values).toMatchObject({ title: "AI-powered Study Planner", languages: "Python", level: "beginner", time: 10, unit: "days", category: "Productivity" });
  });
  test("empty and too-long input are rejected", () => { expect(parseIntake("  ").error).toBeTruthy(); expect(parseIntake("a".repeat(MAX_LEN + 1)).error).toMatch(/under/); });
  test("missing fields are reported, not invented", () => {
    const r = parseIntake("I want to build a recipe finder");
    expect(r.values.time).toBeUndefined(); expect(r.values.languages).toBeUndefined(); expect(r.missing.map((m) => m.label)).toEqual(expect.arrayContaining(["Time available", "Languages", "Experience level"]));
  });
  test("generic titles are not guessed", () => { expect(parseIntake("I want to build a tool that tracks vehicles").values.title).toBeUndefined(); });
  test("duration forms", () => {
    expect(parseIntake("build a notes app in 2 weeks").values).toMatchObject({ time: 2, unit: "weeks" });
    expect(parseIntake("build a notes app, 36 hours").values).toMatchObject({ time: 36, unit: "hours" });
    expect(parseIntake("build a notes app in a month").values).toMatchObject({ time: 4, unit: "weeks" });
    expect(parseIntake("build a notes app, 0 days").values.time).toBeUndefined();
  });
  test("daily rates are ignored and several durations flagged", () => {
    const r = parseIntake("build a notes app, 2 hours a day for 3 weeks");
    expect(r.values).toMatchObject({ time: 3, unit: "weeks" }); expect(r.notes.join(" ")).toMatch(/rates/);
    expect(parseIntake("build a notes app in 5 days or 2 weeks").notes.join(" ")).toMatch(/Several durations/);
  });
  test("ambiguous level, negation and multiple languages", () => {
    expect(parseIntake("I am a beginner but also an expert").values.level).toBeUndefined();
    const n = parseIntake("I am not a beginner"); expect(n.values.level).toBeUndefined(); expect(n.notes.join(" ")).toMatch(/ambiguous/);
    const l = parseIntake("build a chat app with Python and JavaScript"); expect(l.values.languages).toBe("Python, JavaScript"); expect(l.notes.join(" ")).toMatch(/Several languages/);
  });
  test("category ties are left for the user; java is not javascript", () => {
    expect(parseIntake("build a website and an android app").values.category).toBeUndefined();
    expect(parseIntake("I want to build something in JavaScript").values.languages).toBe("JavaScript");
    expect(parseIntake("track vehicles from CCTV cameras").values.category).toBe("Computer vision");
  });
});
