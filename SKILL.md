---
name: info-driven-ui
description: >
  Use this skill whenever the user wants to build, generate, or design any UI from scratch —
  dashboards, data tables, admin panels, analytics views, forms, activity feeds, KPI screens,
  or any interface where data needs to be represented visually. Trigger even when the user
  says "build me a table", "show this data", "create a screen for X", or shares a data
  structure and asks for a UI. The core principle: information has a nature, and that nature
  must drive every component decision. Do NOT build UI by instinct — follow this skill's
  8-step Decision Framework before writing a single component.
---

# info-driven-ui

> Information has a nature. That nature must drive every UI decision.

The most common mistake in data UI is treating all information the same — putting everything
in a table, distributing colors for aesthetics, adding components because they look good.
This skill corrects that. Before writing any component, the agent must understand what the
data *means*, what the user needs to *do* with it, and what visual form *serves* that intent.

---

## Reference Files

Load these on demand. Do not load all at once.

| File | Load when |
|---|---|
| `references/data-semantics.md` | Classifying data types and choosing representations |
| `references/component-engine.md` | Deciding which component to use for a given data pattern |
| `references/progressive-disclosure.md` | Designing information hierarchy and action visibility |
| `references/invisible-ui.md` | Designing states, microinteractions, and implicit affordances |
| `references/review-checklist.md` | Self-auditing a UI before delivering it |

Stack-specific component references (load when the user's stack is identified):

| Directory | Load when |
|---|---|
| `stacks/react-shadcn-tailwind/STACK.md` | Stack is React + shadcn/ui + Tailwind |
| `stacks/react-tailwind/STACK.md` | Stack is React + Tailwind (no shadcn, Radix primitives) |
| `stacks/vue/STACK.md` | Stack is Vue 3 + Reka UI |
| `stacks/svelte/STACK.md` | Stack is Svelte 5 + shadcn-svelte |
| `stacks/angular/STACK.md` | Stack is Angular + Angular Material |
| *(more stacks added over time)* | |

> If no stack is specified, apply principles only. Do not assume a stack.
> Each `STACK.md` follows the same template — Badge, Table, Tooltip, Empty State,
> Skeleton, Row Hover Actions, KPI Card, Toast — so the same principle maps
> predictably to any framework.

---

## Related Sub-Skill: Auditing Existing UIs

This skill covers **generation from scratch**. To review, critique, or refactor an
**existing** UI, use the sibling skill at `audit-refactor/SKILL.md` instead. It applies
the same reference files in reverse — starting from what exists and identifying gaps
against this standard, rather than building from a blank state.

---

## The 8-Step Decision Framework

**This is mandatory. Execute all 8 steps before writing any component.**

### STEP 1 — Understand the User's Intent

Ask (or infer from context):

- What decision is the user trying to make with this data?
- What does the user need to *discover*?
- What does the user need to *compare*?
- What does the user need to *find*?
- What does the user need to *monitor* over time?
- What does the user need to *act on*?

The same dataset can produce completely different interfaces depending on the answer.
A list of employees viewed by an HR manager (who needs to find anomalies) looks nothing
like the same list viewed by a payroll system (which needs to process each row).

### STEP 2 — Classify the Nature of Each Data Point

Read `references/data-semantics.md` and classify every field or data group.
Every piece of information belongs to a semantic category:

- **State/Status** → chips, badges, color-coded labels
- **Quantity** → right-aligned numerics, comparison bars, KPI cards
- **Time** → timelines, activity feeds, sparklines, calendars
- **Relation** → master-detail, graph, tree, linked navigation
- **Hierarchy** → tree, accordion, outline, breadcrumb
- **Distribution** → histogram, heatmap, boxplot
- **Trend** → line chart, area chart, sparkline
- **Progress** → stepper, progress bar, status tracker
- **Geography** → map, choropleth, cluster
- **Category (fixed set)** → chips, segmented control, filter pills
- **Free text** → search, truncated preview, expandable detail

Do not skip this step. An unclassified field is a field waiting to become a bad table column.

### STEP 3 — Identify the Primary User Tasks

List the 1–3 most important things the user does on this screen. Everything else is secondary.
Secondary actions should be less visible by default (see `references/progressive-disclosure.md`).

### STEP 4 — Choose the Dominant Visual Form

Based on STEP 2 and STEP 3, choose the primary representation. Read `references/component-engine.md`.

The dominant form is the one that serves the *most important data type* and the *primary task*.
If the data is fundamentally chronological, the dominant form is a timeline — not a table.
If the data is fundamentally comparative, the dominant form is a chart — not a list.

> A table is a last resort, not a default. Tables are appropriate when the user needs to
> scan multiple attributes of multiple items simultaneously. Not otherwise.

### STEP 5 — Design the Information Hierarchy

Decide what is:

- **Always visible** — primary metrics, primary action, system status
- **Visible on interaction** — secondary attributes, contextual actions, filters
- **Hidden until needed** — destructive actions, advanced settings, audit logs

Read `references/progressive-disclosure.md` for the full explicitness spectrum.

### STEP 6 — Design the Invisible UI

Read `references/invisible-ui.md`.

Every state must be designed, not just the happy path:

- Empty, loading, error, partial data, offline
- Hover, focus, active, disabled, selected
- Optimistic update, pending, conflict, retry
- Tooltips on every non-obvious icon or label

> The absence of tooltips is the most reliable signal that a UI was built by someone
> who has never shipped one to real users. (Kole Jain)

### STEP 7 — Implement

Only now write the components. If the user's stack is identified, load the relevant
`stacks/` directory and follow its conventions. Otherwise implement with semantic HTML
and framework-agnostic patterns.

Apply color with intent:
- Color must emerge from data meaning, never from aesthetics.
- Red = requires immediate attention. Green = healthy/complete. Yellow = warning.
- Do not use color to decorate. Use it to communicate.

Apply alignment with meaning:
- Numbers are always right-aligned (enables positional comparison by digit place).
- Labels and text are left-aligned.
- Icons and status indicators are center-aligned within their cell.

### STEP 8 — Self-Audit

Before delivering, run through `references/review-checklist.md`.
If any item fails, fix it before responding.

---

## Core Principles

**Information First.** The component serves the data. The data does not serve the component.

**Semantic Color.** Color must carry meaning derived from the data itself.
A status chip is red because the status is critical — not because red looks good there.

**Positional Numerics.** Quantities must be right-aligned in columns so digit positions
(ones, tens, hundreds) align visually across rows, enabling instant comparison.

**Chronological Data Demands Chronological Form.** If data has a strong time dimension,
a timeline or activity feed serves the user better than any table sorted by date.

**Tables Are Not Defaults.** Use a table when the user needs to compare multiple attributes
across multiple items simultaneously. Use cards when items are few. Use a timeline when
order in time matters. Use a chart when comparison or trend matters.

**Invisible UI Is Not Optional.** A UI without tooltips, hover states, empty states,
and loading states is an unfinished UI — regardless of how polished the happy path looks.

**Progressive Disclosure Is Hierarchy, Not Hiding.** The goal is not to hide things.
The goal is to surface the right information at the right moment of intent.