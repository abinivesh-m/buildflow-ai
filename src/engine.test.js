import { describe, expect, test } from "vitest";
import { generatePlan, pct, statusOf, docs, uid } from "./engine.js";

describe("engine plan generator and calculations", () => {
  const sampleInput = {
    title: "AI Study Buddy",
    idea: "A responsive study tool that summarizes lecture notes and generates practice quizzes.",
    problem: "Students spend hours reading dense notes without testing their understanding.",
    audience: "University engineering students",
    category: "AI and machine learning",
    level: "intermediate",
    time: "5",
    unit: "days",
    languages: "Python, JavaScript",
    skills: "React, FastAPI",
    framework: "React",
    constraints: "Free tier hosting only",
    goals: "Summarize 10-page notes in 5s\nGenerate 5 quiz questions\nExport study guide",
    deadline: "2026-11-01",
  };

  test("generates comprehensive 18-point plan and all workspace modules", () => {
    const result = generatePlan(sampleInput);

    expect(result.plan).toBeDefined();
    expect(result.tasks).toBeInstanceOf(Array);
    expect(result.tasks.length).toBeGreaterThan(5);
    expect(result.decisions).toBeInstanceOf(Array);
    expect(result.decisions.length).toBeGreaterThan(0);
    expect(result.testChecklist).toBeInstanceOf(Array);
    expect(result.testChecklist.length).toBeGreaterThan(3);
    expect(result.deploymentReadiness).toBeInstanceOf(Array);
    expect(result.deploymentReadiness.length).toBeGreaterThan(3);
    expect(result.demoScript).toBeDefined();
    expect(result.demoScript.checklist).toBeInstanceOf(Array);

    // Verify 18-point plan requirements
    expect(result.plan.problem).toBeTruthy();
    expect(result.plan.audience).toBe(sampleInput.audience);
    expect(result.plan.userNeeds).toBeInstanceOf(Array);
    expect(result.plan.solution).toBeTruthy();
    expect(result.plan.mvp).toBeInstanceOf(Array);
    expect(result.plan.excludedFromMvp).toBeInstanceOf(Array);
    expect(result.plan.functionalRequirements).toBeInstanceOf(Array);
    expect(result.plan.nonFunctionalRequirements).toBeInstanceOf(Array);
    expect(result.plan.userStories).toBeInstanceOf(Array);
    expect(result.plan.acceptanceCriteria).toBeInstanceOf(Array);
    expect(result.plan.architecture).toBeTruthy();
    expect(result.plan.dataModel).toBeInstanceOf(Array);
    expect(result.plan.phases).toBeInstanceOf(Array);
    expect(result.plan.testing).toBeInstanceOf(Array);
    expect(result.plan.deployment).toBeInstanceOf(Array);
    expect(result.plan.potentialRisks).toBeInstanceOf(Array);

    // Verify generator transparent source label
    expect(result.plan.generatorSource).toContain("Deterministic");
  });

  test("tasks have valid priorities, estimates, acceptance criteria, and status", () => {
    const { tasks } = generatePlan(sampleInput);
    for (const t of tasks) {
      expect(["critical", "high", "medium", "low"]).toContain(t.priority);
      expect(t.hours).toBeGreaterThan(0);
      expect(t.status).toBe("todo");
      expect(t.acceptanceCriteria).toBeTruthy();
      expect(typeof t.title).toBe("string");
    }
  });

  test("progress calculation strictly uses real task completion numbers", () => {
    const project = {
      tasks: [
        { id: "1", status: "todo" },
        { id: "2", status: "doing" },
        { id: "3", status: "done" },
        { id: "4", status: "done" },
      ],
    };
    expect(pct(project)).toBe(50);

    const emptyProject = { tasks: [] };
    expect(pct(emptyProject)).toBe(0);

    const fullProject = {
      tasks: [
        { id: "1", status: "done" },
        { id: "2", status: "done" },
      ],
    };
    expect(pct(fullProject)).toBe(100);
    expect(statusOf(fullProject)).toBe("completed");
  });

  test("statusOf returns correct status reflecting task states", () => {
    expect(statusOf({ tasks: [{ id: "1", status: "todo" }] })).toBe("planning");
    expect(statusOf({ tasks: [{ id: "1", status: "doing" }] })).toBe("in progress");
    expect(statusOf({ tasks: [{ id: "1", status: "blocked" }] })).toBe("in progress");
    expect(statusOf({ tasks: [{ id: "1", status: "done" }, { id: "2", status: "todo" }] })).toBe("in progress");
  });

  test("docs exports generate valid Markdown, CSV, and Readme with real data", () => {
    const generated = generatePlan(sampleInput);
    const p = {
      ...sampleInput,
      id: uid(),
      ...generated,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const readme = docs.readme(p);
    expect(readme).toContain(p.title);
    expect(readme).toContain(p.idea);
    expect(readme).toContain("Getting Started Locally");

    const full = docs.full(p);
    expect(full).toContain("Comprehensive Project Blueprint");
    expect(full).toContain("Executive Summary");
    expect(full).toContain("Potential Risks & Mitigations");

    const csv = docs.tasksCsv(p);
    expect(csv).toContain("ID,Phase,Title,Description,Hours,Priority,Status,AcceptanceCriteria,Blockers");
    expect(csv.split("\n").length).toBeGreaterThan(p.tasks.length);

    const demo = docs.demoScript(p);
    expect(demo).toContain("Demo & Presentation Script");
    expect(demo).toContain("Live Walkthrough");

    const tdr = docs.decisions(p);
    expect(tdr).toContain("Technical Decision Records");
  });
});
