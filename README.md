# info-driven-ui

> A data-driven UI design system and verification library for agentic software engineers.

This repository implements the 2026 standard structure for robust, context-optimized frontend instructions and verification (as established by shadcn, Anthropic's `frontend-design`, and `skill-creator`).

---

## Directory Structure

```
info-driven-ui/
├── SKILL.md                          ← Main skill declaration & frontmatter
├── README.md                         ← You are here
├── rules/                            ← 10 Atomic Incorrect/Correct rules
│   ├── 01-semantic-color.md
│   ├── 02-numeric-alignment.md
...
├── references/                       ← Deep reference guides (on-demand)
│   ├── data-semantics.md
│   ├── component-engine.md
│   ├── progressive-disclosure.md
│   ├── invisible-ui.md
│   ├── advanced-patterns.md          ← Covers dark mode, real-time, i18n, cmd+k
│   └── review-checklist.md
├── scripts/                          ← Deterministic verification scripts
│   ├── audit_linter.py               ← Regex-based lint check runner
│   └── README.md
├── evals/                            ← 20 JSON test cases & LLM judge prompt
│   ├── evals.json
│   └── README.md
├── audit-refactor/                   ← Sibling skill for auditing existing UIs
│   └── SKILL.md                      ← Implements 7-step audit framework + linter
└── stacks/                           ← Component code references per stack
    ├── react-tailwind/               ← React + headless Radix + Custom Tailwind
    ├── react-tailwind-shadcn/        ← React + shadcn/ui library
    ├── vue/                          ← Vue 3 + Reka UI (radix-vue) + Tailwind
    ├── svelte/                       ← Svelte 5 + shadcn-svelte (Melt UI/Bits UI)
    └── angular/                      ← Angular 17+ + Angular Material + Tailwind
```

---

## Getting Started

### 1. Generating UIs (Scratch)
Use the primary skill detailed in [SKILL.md](file:///home/azrxl/info-driven-ui/SKILL.md). It mandates the **8-step Decision Framework** to categorize data before choosing any component representation.

### 2. Auditing Existing UIs
Use the sub-skill detailed in [audit-refactor/SKILL.md](file:///home/azrxl/info-driven-ui/audit-refactor/SKILL.md). It walks through a **7-step Audit Framework**, using `scripts/audit_linter.py` to run static code audits and output severity reports.

### 3. Running the Linter
Ensure your code is clean of basic data-UI bugs by running the static verification tool:
```bash
python scripts/audit_linter.py /path/to/project
```
See the [scripts documentation](file:///home/azrxl/info-driven-ui/scripts/README.md) for list of checks and parameters.

### 4. Running Benchmarks
Evaluate design compliance via LLM blind judging using the 20-case test suite in [evals/evals.json](file:///home/azrxl/info-driven-ui/evals/evals.json) and follow the instructions in [evals/README.md](file:///home/azrxl/info-driven-ui/evals/README.md).