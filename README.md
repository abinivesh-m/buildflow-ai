<div align="center">

# ⚡ BuildFlow AI

### **Turn your ideas into things that actually work.**
*A high-performance, execution-first engineering workspace with voice-first intake, end-to-end requirement traceability, Mermaid system topologies, and verifiable release readiness.*

[![Production Deployment](https://img.shields.io/badge/Production-Live_v2.2-10b981?style=for-the-badge&logo=vercel&logoColor=white)](https://buildflow-ai-livid.vercel.app/)
[![Automated Tests](https://img.shields.io/badge/Vitest-22%2F22%20Passed-6366f1?style=for-the-badge&logo=vitest&logoColor=white)](https://github.com/abinivesh-m/buildflow-ai)
[![Voice Powered](https://img.shields.io/badge/Voice_First-Wispr_Flow-8b5cf6?style=for-the-badge)](https://buildflow-ai-livid.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-06b6d4?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Build with Vite](https://img.shields.io/badge/Vite-8.3-f59e0b?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)

---

### 🌐 [**Open Live Production App**](https://buildflow-ai-livid.vercel.app/) • 📦 [**GitHub Repository**](https://github.com/abinivesh-m/buildflow-ai)

</div>

---

## 🎙️ Voice-First Engineering Workflow (Wispr Flow Native)

BuildFlow AI is architected from the ground up to eliminate typing friction from software engineering delivery:

| Engineering Need | Conventional Approach | BuildFlow + Wispr Flow Solution |
| :--- | :--- | :--- |
| **Project Intake** | Typing out multi-page docs in Notion/Docs (40 WPM). | Dictate natural vision hands-free at 251 WPM (Top 0.1% globally); local NLP extracts structured blueprint. |
| **Traceability** | Broken links across Jira, GitHub, and spreadsheets. | Single unified matrix linking Requirements ↔ Tasks ↔ Tests ↔ Decisions ↔ Risks. |
| **Architecture Context** | Undocumented verbal decisions lost over time. | Structured Technical Decision Records (TDR) and live auto-generated Mermaid flowcharts. |
| **Delivery Verification** | Trusting checkboxes without evidence or dependency checks. | Strict dependency guards, 5×5 risk matrix, and pre-flight verification checklists. |

---

## 🎯 The Core Problem

Most builders don't fail because they lack ideas—they fail in **execution**:
- **Ambiguous Scope:** Underestimating technical complexity and suffering from runaway scope creep.
- **Traceability Black Holes:** Requirements that have no corresponding code tasks or verification tests.
- **Lost Architecture Context:** Forgetting *why* certain technologies, schemas, or trade-offs were chosen.
- **Rushed Demos:** Scrambling on demo day with broken live workflows, unhandled errors, and unstructured pitch narratives.

**BuildFlow forces execution over vanity dashboards**, walking builders through the six delivery stages:

```mermaid
flowchart LR
    A["1. IDEA"] --> B["2. PLAN"]
    B --> C["3. ARCHITECT"]
    C --> D["4. BUILD"]
    D --> E["5. TEST"]
    E --> F["6. SHIP & PRESENT"]
```

---

## ✨ Stand-Out Capabilities

### 1. 🎙️ Voice-to-Spec Intake (Wispr Flow Native)
- Dictate project ideas naturally at full conversational speed (251 WPM · Top 0.1% Globally · 209,000+ words dictated).
- Local deterministic Natural Language Parser extracts project title, technology stack, timeframe, and level without sending private data to cloud services.
- One-click sample dictations for rapid demonstration.

### 2. 🔗 End-to-End Traceability Matrix (Core Differentiator)
- Maps every approved requirement to its **implementing tasks**, **verification tests**, **technical decisions**, and **mitigated risks**.
- **Real-time Gap Analysis:** Flags untracked requirements (missing tasks) and unverified deliverables (missing tests).
- **Smart Auto-Linker:** Semantic keyword heuristic that automatically discovers and establishes bidirectional traceability links.

### 3. 📐 System Architecture & Mermaid Diagrams
- Generates editable **Mermaid flowcharts** visualizing client SPAs, API gateways, database persistence, and AI inference engines.
- Component Topology Registry for defining system boundaries and data flow contracts.
- Domain Entity Schema viewer directly derived from project specifications.

### 4. 📋 Interactive Kanban Board & Task Execution
- Dual view toggle: **📌 Kanban Board** (Backlog, Todo, In Progress, Blocked, Done) & **📋 Phase List**.
- **Strict Dependency Enforcement:** Prevents marking tasks done if prerequisite dependencies remain incomplete.
- **Truthful Progress Metrics:** Calculated strictly from persisted task statuses:
  $$\text{Progress} = \left(\frac{\text{Completed Tasks}}{\text{Total Tasks}}\right) \times 100\%$$

### 5. 🛡️ 5×5 Risk Register & Heatmap
- Explainable risk calculation: $\text{Severity} = \text{Likelihood} (1\text{–}5) \times \text{Impact} (1\text{–}5)$.
- Color-coded 5×5 interactive heatmap matrix.
- Direct links between identified risks and the requirements they threaten.

### 6. 🏛️ Technical Decision Records (TDR)
Capture critical architectural decisions directly inside your workspace:
- Context & Problem Statement
- Options Evaluated vs. Chosen Option
- Architectural Reasoning & Accepted Consequences
- Status (`proposed`, `accepted`, `deprecated`, `superseded`)
- One-click export to Markdown for Git version control.

### 7. 🧪 Testing & Quality Checklist
Real manual and automated quality verification covering:
- Core Domain Logic & Input Validation
- Data Persistence & Migration Safeguards
- Small Viewport Mobile Responsiveness (360px - 390px)
- Keyboard Focus & Accessibility (WCAG 2.2 AA standards)
- Zero fake auto-passes: checks require deliberate tester verification.

### 8. 🎤 Demo Studio & 2-Minute Pitch
- Dedicated **2-minute video pitch script** tailored for Wispr Flow judges.
- Pre-flight checklist (screens checked, backup screenshots ready, credentials validated).
- Instant export to plain text or Markdown.

---

## 🏗️ Architecture Topology

```mermaid
flowchart TD
  User["👤 Clinician / Developer"] --> UI["🖥️ React 19 SPA (Vite 8.3)"]
  UI --> Router["App Navigation & State Store"]
  Router --> Storage["💾 Local Storage (Schema v3 Normalizer)"]
  Router --> APISync["🌐 API Gateway / Serverless (/api/generate)"]
  APISync --> CloudModel["🤖 Inference Provider (Gemini 2.5 Flash / Meta AI)"]
  Router --> Fallback["⚙️ Deterministic Fallback Rule Engine"]

  classDef clientStyle fill:#1e1b4b,stroke:#6366f1,stroke-width:2px,color:#fff
  classDef apiStyle fill:#312e81,stroke:#818cf8,stroke-width:2px,color:#fff
  classDef dbStyle fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff
  classDef aiStyle fill:#581c87,stroke:#c084fc,stroke-width:2px,color:#fff

  class UI,Router clientStyle
  class APISync apiStyle
  class Storage dbStyle
  class CloudModel,Fallback aiStyle
```

---

## 🧪 Automated Testing Breakdown

```
 RUN  v5.0.5 C:/Users/abini/billflow-ai

 ✓ src/intake.test.js (8 tests)        # NLP voice dictation parsing
 ✓ src/traceability.test.js (4 tests)  # Requirements, risks, architecture links
 ✓ src/workflow.test.js (5 tests)      # Dependency guards, metric math
 ✓ src/engine.test.js (5 tests)        # 18-point blueprint generator

 Test Files  4 passed (4)
      Tests  22 passed (22)
   Duration  222ms (100% green)
```

---

## 🚀 Getting Started Locally

```bash
# 1. Clone the repository
git clone https://github.com/abinivesh-m/buildflow-ai.git
cd buildflow-ai

# 2. Install dependencies
npm install

# 3. Run automated tests
npm test

# 4. Start local development server
npm run dev

# 5. Build for production
npm run build
```

---

## 📄 License
MIT © 2026 Abinivesh M · Built for **No Hands: The Wispr Challenge**
