# BuildFlow — Turn your ideas into things that work

BuildFlow is a production-ready, client-side first project planning, execution, and delivery workspace engineered for students, hackathon participants, and independent builders.

It guides you through the complete software delivery lifecycle:
**IDEA → PLAN → BUILD → TEST → DEPLOY → PRESENT**

---

## Key Features

1. **Compelling Welcome & Landing Experience**: Overview of the 6-stage lifecycle, feature pillars, and FAQ.
2. **Honest Planning Engine**:
   - Built-in deterministic generator produces an 18-point blueprint with zero API dependencies.
   - Transparently labels source: local rule engine vs. server-side AI model.
   - Never fabricates AI completions or metrics.
3. **18-Point Engineering Blueprint**:
   - Problem statement, Target audience, User needs, Proposed solution
   - MVP scope boundaries & explicit non-goals
   - Functional & non-functional requirements
   - User stories & acceptance criteria
   - Technical architecture & relational data entities
   - Implementation phases with effort hours
   - Testing strategy & deployment plan
   - Demo script outline & potential risks with mitigations
4. **Atomic Task Execution**:
   - Tracks IDs, priorities, effort estimates, acceptance criteria, blockers, and notes.
   - Dependency protection: prevents completing a task if upstream dependencies are unresolved.
   - Real metrics: completion percentages are strictly computed from persisted tasks.
5. **Technical Decision Records (TDR)**:
   - Record context, options evaluated, chosen option, reasoning, and trade-offs.
   - Direct export to Markdown for inclusion in code repositories.
6. **Testing & Quality Checklist**:
   - Covers core logic, input validation, persistence, accessibility, and mobile responsiveness.
   - Genuine manual and automated check reporting (no fake auto-passes).
7. **Deployment Readiness Center**:
   - Verify production builds, secret hygiene (no committed keys), and live HTTPS reachability.
8. **Demo & Presentation Studio**:
   - Structured pitch outline with adjustable duration.
   - Pre-flight checklist for hackathon and demo day success.
9. **Full Data Portability**:
   - Export full project blueprint (.md), README.md, Task list (.csv), and Technical Decisions (.md).
   - Single-file full JSON backup with restore capability.
10. **Design System**:
    - High-contrast, polished dark/light mode with typography scale.
    - Zero horizontal overflow across viewports from 360px to 1440px.

---

## Getting Started Locally

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+)

### Installation & Development
\`\`\`bash
# 1. Clone the repository
git clone <repository-url>
cd billflow-ai

# 2. Install dependencies
npm install

# 3. Start local development server (live on http://localhost:5173)
npm run dev

# 4. Run automated test suite (Vitest)
npm test

# 5. Build for production
npm run build
\`\`\`

---

## Environment Configuration

See [`.env.example`](file:///c:/Users/abini/billflow-ai/.env.example) for available options:
\`\`\`env
# Optional: Set a Google Gemini API key to enable server-side enhanced planning
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
\`\`\`
*Note: If no API key is provided, BuildFlow operates at 100% functionality using its high-speed deterministic rule engine.*

---

## Automated Test Results
- **Suite**: Vitest v5.0.5
- **Tests**: 18 passing across 3 test files:
  - [`src/intake.test.js`](file:///c:/Users/abini/billflow-ai/src/intake.test.js) (Natural language parsing & voice dictation intake)
  - [`src/engine.test.js`](file:///c:/Users/abini/billflow-ai/src/engine.test.js) (18-point plan schema, task math, and document exports)
  - [`src/workflow.test.js`](file:///c:/Users/abini/billflow-ai/src/workflow.test.js) (Task dependency safeguards, destructive action protection, and data integrity)

---

## Production Deployment Guide

BuildFlow produces a standalone static bundle with an optional serverless API seam for Gemini:

1. **Frontend Hosting (Vercel / Cloudflare Pages / Netlify / Render)**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
2. **Serverless AI Seam (Optional)**:
   - The `/api/generate.js` handler runs as a Vercel Serverless Function or Node.js Express route.
   - Configure `GEMINI_API_KEY` in your platform's environment variable dashboard.
