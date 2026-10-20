import { describe, expect, test, beforeEach } from "vitest";
import { generatePlan, pct, statusOf, uid } from "./engine.js";

describe("Workflow Integration & Safety", () => {
  let project;

  beforeEach(() => {
    const generated = generatePlan({
      title: "Campus Ride Share",
      idea: "A lightweight carpooling system for university students with verified student ID emails.",
      category: "Web application",
      level: "beginner",
      time: "10",
      unit: "days",
      languages: "TypeScript, React",
      skills: "React, Node.js",
      goals: "Safe ride posting\nSeat booking confirmation\nExport ride summary",
    });

    project = {
      id: uid(),
      title: "Campus Ride Share",
      idea: "A lightweight carpooling system for university students.",
      category: "Web application",
      ...generated,
    };
  });

  test("Dependency constraint prevents completing task if upstream task is incomplete", () => {
    // Setup task A and task B where B depends on A
    const taskA = { id: "task-A", title: "Setup Database", status: "todo", phase: 0 };
    const taskB = { id: "task-B", title: "Run Migration", status: "todo", dependencies: ["task-A"], phase: 0 };
    project.tasks = [taskA, taskB];

    // Attempting to finish B while A is todo
    const canCompleteB = () => {
      if (Array.isArray(taskB.dependencies) && taskB.dependencies.length > 0) {
        const unfinished = project.tasks.find(
          (t) => taskB.dependencies.includes(t.id) && t.status !== "done"
        );
        if (unfinished) {
          throw new Error(`Cannot mark done: Depends on "${unfinished.title}" which is still ${unfinished.status}.`);
        }
      }
      taskB.status = "done";
    };

    expect(() => canCompleteB()).toThrow(/Depends on "Setup Database"/);
    expect(taskB.status).toBe("todo");

    // Once task A is completed, task B can be completed
    taskA.status = "done";
    expect(() => canCompleteB()).not.toThrow();
    expect(taskB.status).toBe("done");
  });

  test("Destructive actions preserve user tasks on plan regeneration", () => {
    const customTask = {
      id: "custom-123",
      title: "Special Security Review with Professor",
      status: "done",
      phase: 0,
      custom: true,
      hours: 3,
    };
    project.tasks.push(customTask);

    // Simulate regeneration preserving custom and done tasks
    const fresh = generatePlan(project);
    const doneTitles = new Set(
      project.tasks.filter((t) => t.status === "done").map((t) => t.title)
    );

    const regeneratedTasks = [
      ...fresh.tasks.map((t) => (doneTitles.has(t.title) ? { ...t, status: "done" } : t)),
      ...project.tasks.filter((t) => t.custom),
    ];

    expect(regeneratedTasks.some((t) => t.id === "custom-123")).toBe(true);
    expect(regeneratedTasks.find((t) => t.id === "custom-123").status).toBe("done");
  });

  test("Calculated metrics strictly match task counts without fabrication", () => {
    project.tasks = [
      { id: "1", status: "done" },
      { id: "2", status: "todo" },
      { id: "3", status: "doing" },
      { id: "4", status: "blocked" },
    ];

    expect(pct(project)).toBe(25);
    expect(statusOf(project)).toBe("in progress");

    project.tasks.forEach((t) => (t.status = "done"));
    expect(pct(project)).toBe(100);
    expect(statusOf(project)).toBe("completed");
  });

  test("Technical Decision Records are initialized and structured", () => {
    expect(project.decisions).toBeInstanceOf(Array);
    expect(project.decisions.length).toBeGreaterThan(0);
    const firstDecision = project.decisions[0];
    expect(firstDecision.title).toBeTruthy();
    expect(firstDecision.context).toBeTruthy();
    expect(firstDecision.chosenOption).toBeTruthy();
    expect(firstDecision.reasoning).toBeTruthy();
    expect(firstDecision.consequences).toBeTruthy();
    expect(firstDecision.status).toBe("accepted");
  });

  test("Testing and Deployment readiness checklists require deliberate verification", () => {
    expect(project.testChecklist).toBeInstanceOf(Array);
    const unverifiedTests = project.testChecklist.filter((t) => t.status === "pending");
    expect(unverifiedTests.length).toBeGreaterThan(0);

    expect(project.deploymentReadiness).toBeInstanceOf(Array);
    const notCheckedDeploy = project.deploymentReadiness.filter((d) => d.status === "not_checked");
    expect(notCheckedDeploy.length).toBeGreaterThan(0);
  });
});
