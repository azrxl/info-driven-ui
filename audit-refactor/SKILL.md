---
name: info-driven-ui-audit-refactor
description: >
  Use this skill when the user wants to review, critique, audit, or refactor an EXISTING
  UI, component, dashboard, or table — as opposed to building one from scratch. Trigger on:
  "review this dashboard", "audit my UI", "is this the right component for this data",
  "critique this design", "refactor this table", "what's wrong with this component",
  "improve this screen", or when the user pastes existing code/a screenshot and asks for
  feedback rather than a new build. This is the audit counterpart to info-driven-ui (which
  handles generation from scratch). Always read the parent skill's reference files
  (../references/) as the standard being audited against.
---

# info-driven-ui: Audit & Refactor

> The generation workflow asks "what should this be?". This workflow asks
> "what is this, and how far is it from what it should be?".

This sub-skill reviews existing interfaces — code, screenshots, or descriptions — against
the same information-driven standard used for generation. It produces either an **audit
report** (findings + severity + recommendation) or a **direct refactor** (rewritten code),
depending on what the user asked for.

This skill shares its standard with the parent `info-driven-ui` skill. It does not duplicate
the classification system or component engine — it applies them in reverse, starting from
what exists rather than from a blank state.

---

## Reference Files (shared with parent skill)

Load these from the parent skill's `references/` directory:

| File | Load when |
|---|---|
| `../references/data-semantics.md` | Determining what a piece of data *should* be represented as |
| `../references/component-engine.md` | Checking if the current component matches the data's nature |
| `../references/progressive-disclosure.md` | Auditing information hierarchy and action placement |
| `../references/invisible-ui.md` | Checking for missing states and microinteractions |
| `../references/advanced-patterns.md` | Auditing complex features (dark mode, real-time, i18n, command palette) |
| `../references/review-checklist.md` | The audit instrument itself — this IS the audit checklist |

If a stack is identified, also load the relevant `../stacks/<stack>/STACK.md` for
idiomatic refactor patterns in that framework.

---

## The Audit Framework

**This is mandatory. Execute all 7 steps before producing findings or a refactor.**

### STEP 0 — Run Deterministic Linter (if source code is available)

If the user's source code is accessible via a file path, run the deterministic linter
first to establish a factual baseline:

```bash
python scripts/audit_linter.py <path> --json
```

The linter detects anti-patterns with regex (not judgment) — its findings are **facts**.
Use them as a starting point: the LLM interprets context, filters false positives,
and adds domain-specific recommendations. See `scripts/README.md` for check details.

If source code is only available as pasted snippets in the chat (no file path),
skip this step and proceed directly to STEP 1.

### STEP 1 — Inventory Current Representation

List every distinct data element in the interface and how it is *currently* represented.
Do not judge yet — just inventory.

```
Example inventory:
- "Status" column       → currently: plain text ("Active", "Inactive")
- "Amount" column       → currently: left-aligned plain number
- "Last updated" column → currently: absolute date, no tooltip
- Delete action         → currently: always-visible red button in every row
```

### STEP 2 — Reverse-Classify Each Element

For each inventoried element, apply `data-semantics.md` to determine what its nature
*actually is*, independent of how it's currently shown.

```
- "Status" → nature: State/Status (fixed set, 2-3 values) → should be a badge/chip
- "Amount" → nature: Quantity → should be right-aligned, tabular-nums
- "Last updated" → nature: Time (single timestamp) → should be relative + tooltip
- Delete action → nature: destructive action → should be hover/overflow, not permanent
```

### STEP 3 — Gap Analysis

Compare STEP 1 (current) against STEP 2 (ideal). Every mismatch is a finding.

For each gap, classify severity:

| Severity | Definition | Example |
|---|---|---|
| **Critical** | Actively harms the user (data loss risk, unreadable, inaccessible) | Destructive action with no confirmation, permanently visible |
| **Major** | Breaks scanability or the primary task | Status as plain text in a 200-row table; numbers left-aligned |
| **Minor** | Missing polish that professionals notice | No tooltip on abbreviated values; no hover state on rows |
| **Nice-to-have** | Would improve the experience but isn't expected | Density toggle; keyboard shortcuts |

### STEP 4 — Run the Review Checklist

Apply `review-checklist.md` systematically against the current interface.
Every unchecked item is a finding, already categorized by the checklist's sections
(Data Representation, Color, Hierarchy, Tooltips, States, Progressive Disclosure,
Accessibility, Mobile).

### STEP 5 — Produce Output

Ask (or infer from phrasing) which output the user wants:

- **Audit report only** → structured findings list (see template below), no code changes
- **Refactor** → rewritten code implementing the fixes, using the stack-specific
  `STACK.md` patterns when a stack is identified
- **Both** → report first, then the refactor, so the user understands *why* before *what changed*

Default to **both** when the user's request is ambiguous — a refactor without
justification is hard to trust, and a report without a fix is less useful.

### STEP 6 — Re-Audit After Refactor

If a refactor was produced, re-run the checklist mentally against the new version
before delivering it. Do not deliver a refactor that introduces new gaps
(e.g., fixing the status badge but removing an existing tooltip in the process).

---

## Audit Report Template

Use this structure for the findings output:

```markdown
## Audit Summary

[1-2 sentence overview: what this interface does, and the overall assessment]

## Findings

### 🔴 Critical
- **[Element]**: [What's wrong] → [What it should be, with reference to the principle]

### 🟠 Major
- **[Element]**: [What's wrong] → [What it should be]

### 🟡 Minor
- **[Element]**: [What's wrong] → [What it should be]

### ⚪ Nice-to-have
- **[Element]**: [Suggestion]

## Recommendation

[1-2 sentences: priority order for fixes, and whether a full refactor or
incremental fixes make more sense given the findings]
```

Keep each finding to one line. The report is a scan tool, not an essay.
If the user wants elaboration on a specific finding, they will ask.

---

## Common Audit Patterns

### The Table Overload Audit

**Signal:** A table with 8+ columns, several of which are status/category fields
rendered as plain text.

**Finding pattern:**
```
🟠 Major: "Status", "Priority", "Type" columns are plain text in a 12-column table.
→ Convert to color-coded badges (see data-semantics.md §1). Reduces scan time
  and visually groups repeated categorical values.

🟠 Major: 12 columns exceeds the recommended 3-5 primary columns (component-engine.md).
→ Move secondary attributes (Type, Created By, Last Modified) behind a column
  picker or an expandable row detail.
```

### The Silent Action Audit

**Signal:** Icon-only buttons with no visible label and no tooltip.

**Finding pattern:**
```
🟡 Minor: Icon-only buttons (edit, archive, duplicate) have no tooltips.
→ Add tooltips per invisible-ui.md "Mandatory tooltip coverage". Users cannot
  reliably distinguish icons without a text label on hover.
```

### The Always-Visible Destructive Action Audit

**Signal:** A "Delete" or "Remove" button rendered permanently in every row.

**Finding pattern:**
```
🔴 Critical: Delete button is permanently visible in every table row with no
confirmation step.
→ Move to hover-revealed overflow menu (progressive-disclosure.md "Destructive
  actions"). Add a confirmation step or timed undo before the delete is final.
```

### The Missing States Audit

**Signal:** No visible handling for empty, loading, or error states in the code
(often revealed by absence in the component, not by anything visibly wrong in
a single screenshot).

**Finding pattern:**
```
🟠 Major: No empty state is implemented — component assumes data is always present.
→ Add an empty state per invisible-ui.md: illustration + explanation + primary CTA.

🟡 Minor: Loading state is a generic spinner rather than a skeleton matching
the table layout.
→ Replace with a skeleton screen (invisible-ui.md "Skeleton screens") for
  perceived performance and layout stability.
```

### The Timestamp-Sorted Log Audit

**Signal:** An activity log or event history rendered as a table sorted by a
"Date" column.

**Finding pattern:**
```
🟠 Major: Activity log is rendered as a table sorted by timestamp.
→ This is chronological data — convert to a vertical timeline or activity feed
  (data-semantics.md §3, "The Kole Jain Rule" in component-engine.md). Users
  need to see the time *shape*, not read rows sequentially.
```

### The Decorative Color Audit

**Signal:** Multiple colors applied to UI elements (tags, borders, backgrounds)
that don't correspond to any data meaning — colors assigned by aesthetic
preference or arbitrarily by index.

**Finding pattern:**
```
🟡 Minor: Category tags are colored by an arbitrary rotation (tag[i % 6 colors])
rather than a consistent semantic mapping.
→ Assign colors deliberately: same category = same color everywhere in the app.
  Reserve red/green/amber for status semantics only, not general categories.
```

---

## Refactor Output Rules

When producing a code refactor (not just a report):

1. **Preserve what already works.** Do not rewrite parts of the component that
   already follow the standard. Refactor surgically.
2. **Fix Critical and Major findings always.** Minor and Nice-to-have are optional —
   ask if the user wants the full pass or just the high-severity fixes.
3. **Use the stack's existing patterns.** If the user's code already uses a
   component library (shadcn, Material, PrimeVue, etc.), stay within that library's
   idioms — don't introduce a second library to fix one component.
4. **Call out any assumption.** If a fix requires data that isn't in the current
   props/schema (e.g., adding a tooltip that needs a new field), state that
   assumption explicitly rather than fabricating a value.
5. **Diff mentally against the checklist before delivering** (STEP 6 above).