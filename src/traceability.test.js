import { describe, it, expect } from "vitest";
import { generatePlan } from "./engine.js";

describe("BuildFlow AI — Traceability & Architecture Engine", () => {
  const sampleInput = {
    title: "VitalPulse AI: Telemetry Hub",
    idea: "A real-time vitals monitoring dashboard for emergency medical technicians with sub-second threshold alerts.",
    category: "AI and machine learning",
    time: "7",
    unit: "days",
    level: "intermediate",
    skills: "React, Python, FastAPI",
  };

  it("generates structured traceable requirements with linked tasks and tests", () => {
    const plan = generatePlan(sampleInput);

    expect(Array.isArray(plan.requirements)).toBe(true);
    expect(plan.requirements.length).toBeGreaterThanOrEqual(3);

    const firstReq = plan.requirements[0];
    expect(firstReq.id).toBeDefined();
    expect(firstReq.title).toBeDefined();
    expect(firstReq.acceptanceCriteria.length).toBeGreaterThan(0);
    expect(Array.isArray(firstReq.linkedTaskIds)).toBe(true);
    expect(firstReq.linkedTaskIds.length).toBeGreaterThan(0);
  });

  it("generates structured risk register with valid likelihood, impact, and severity scoring", () => {
    const plan = generatePlan(sampleInput);

    expect(Array.isArray(plan.risks)).toBe(true);
    expect(plan.risks.length).toBeGreaterThanOrEqual(3);

    plan.risks.forEach((risk) => {
      expect(risk.likelihood).toBeGreaterThanOrEqual(1);
      expect(risk.likelihood).toBeLessThanOrEqual(5);
      expect(risk.impact).toBeGreaterThanOrEqual(1);
      expect(risk.impact).toBeLessThanOrEqual(5);
      expect(risk.severity).toBe(risk.likelihood * risk.impact);
      expect(risk.mitigation).toBeDefined();
    });
  });

  it("generates valid architecture topology and Mermaid flowchart code", () => {
    const plan = generatePlan(sampleInput);

    expect(plan.architecture).toBeDefined();
    expect(typeof plan.architecture.mermaidDiagram).toBe("string");
    expect(plan.architecture.mermaidDiagram).toContain("flowchart TD");
    expect(Array.isArray(plan.architecture.components)).toBe(true);
    expect(plan.architecture.components.length).toBeGreaterThan(0);
  });

  it("maintains strict traceability links between requirements and active risks", () => {
    const plan = generatePlan(sampleInput);

    const reqWithRisks = plan.requirements.find((r) => r.linkedRiskIds && r.linkedRiskIds.length > 0);
    expect(reqWithRisks).toBeDefined();

    const linkedRiskId = reqWithRisks.linkedRiskIds[0];
    const risk = plan.risks.find((rk) => rk.id === linkedRiskId);
    expect(risk).toBeDefined();
  });
});
