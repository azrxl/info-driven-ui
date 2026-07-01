# Progressive Disclosure

> The goal is not to hide things. The goal is to surface the right information
> at the right moment of intent.

Progressive disclosure is the practice of structuring information and actions along
an *explicitness spectrum* — from always visible, to visible on interaction, to
deliberately hidden until explicitly sought. A dashboard that shows everything at once
is not more informative. It is more exhausting.

---

## The Explicitness Spectrum

```
ALWAYS VISIBLE
─────────────────────────────────────────────────────
Primary metrics / KPIs
System status (health, errors, alerts)
Primary action (the one thing the user does most)
Navigation between major sections
Search / global filter

─────────────────────────────────────────────────────
VISIBLE ON INTERACTION (hover / focus / expand)
─────────────────────────────────────────────────────
Secondary attributes of a row / card
Inline actions on a row (edit, copy, view detail)
Filter options beyond the primary filter
Timestamps in relative format → absolute on hover
Truncated text → full text on hover
Avatar → name tooltip on hover
Metric → detailed breakdown on hover

─────────────────────────────────────────────────────
VISIBLE ON DELIBERATE GESTURE (click / open / navigate)
─────────────────────────────────────────────────────
Item detail view (drawer, side panel, or new page)
Advanced filter panel
Settings and configuration
Audit log / history
Export options
Help and documentation
Keyboard shortcut reference

─────────────────────────────────────────────────────
VISIBLE ON EXPLICIT INTENT (context menu / overflow)
─────────────────────────────────────────────────────
Destructive actions (Delete, Remove, Archive, Ban)
Dangerous configuration changes
Bulk operations on selected items
Actions the user rarely needs but must never miss
─────────────────────────────────────────────────────
```

**Rule:** Move every action down the spectrum as far as it can go without creating friction
for the user who needs it frequently.

---

## Placing Actions on the Spectrum

### Primary actions

The single most important action on the screen is always visible and always accessible.
It is the largest, most prominent interactive element in the view.

Examples: "Create issue" (Linear), "New deployment" (Vercel), "Send invoice" (Stripe).

There is exactly one primary action per view. If you find two equally prominent CTAs,
you have not decided what this screen is for.

### Secondary actions on list items

Secondary actions (Edit, Duplicate, Preview) on list rows or cards belong in the
hover state — not in a permanent column.

Pattern:
```
At rest:    [ Name ]  [ Status ]  [ Date ]  [ Assignee ]
On hover:   [ Name ]  [ Status ]  [ Date ]  [ Assignee ]  [ ✏ Edit ]  [ ⋯ More ]
```

This keeps the table scannable when reading and reveals actions exactly when the user
signals intent by hovering.

**Referents:** Linear (row actions on hover), GitHub (file actions on hover in PR diff),
Notion (block actions on hover), Vercel (deployment actions on hover).

### Destructive actions

Delete, Remove, Revoke, Ban, and similar destructive actions are **never** permanently
visible in a table row. They belong in:

1. The overflow/kebab menu (⋯) on hover
2. A context menu (right-click)
3. A confirmation drawer that appears after an intermediate step

If a destructive action must be easy to reach (e.g., "Mark as spam" in an inbox),
place it in a swipe gesture (mobile) or a dedicated action mode, not in the default
resting state.

**The test:** Can a user accidentally trigger a destructive action while scanning the
table? If yes, the action is too visible.

---

## Progressive Onboarding

Onboarding is the most common place where progressive disclosure fails.

**The anti-pattern:** A modal that appears on first login listing all features,
expecting the user to remember them when they encounter each feature for the first time
three sessions later.

**The pattern:**

```
Session 1, Step 1:
  User completes first action →
  Tooltip appears explaining the next available action.

Session 1, Step 2:
  User completes second action →
  Checklist panel unlocks and shows the remaining setup steps.

Step N+1 is only revealed after Step N is complete.
```

Each step of onboarding reveals itself in response to the user's prior completion.
The context is live, not memorized. The user is guided, not instructed.

**Implementation principle:** Track completion state per step. Each step's existence
in the UI is conditional on its prerequisites being met. Never show Step 3 until
Step 2 is complete.

**Referents:** Linear (first issue creation flow), Stripe (account setup checklist),
Notion (workspace setup), Vercel (first deployment walkthrough), GitHub (profile setup).

---

## Progressive Detail in Data Tables

A table with 12 columns is not a table. It is a database export.

**The pattern:**

```
Default view:
  3–5 primary columns covering the user's primary task.

Secondary attributes:
  Accessible via:
  - Column picker (user chooses what to show)
  - Expandable row (click to reveal detail panel inline)
  - Hover detail card (secondary attributes float on row hover)

Full detail:
  Accessible via:
  - Row click → drawer or new page with full entity view
```

**Referents:** Linear (issue list → issue detail), GitHub (PR list → PR detail),
Stripe (transaction list → transaction detail), Notion (database → page).

---

## Information Density as a Setting

Not every user needs the same density. Power users want more on screen.
New users benefit from more whitespace and fewer options.

Pattern: Offer a density toggle (Compact / Default / Comfortable) as a user preference.
This is a single CSS variable change per layout — the implementation cost is low,
the perceived quality signal is high.

**Referents:** GitHub (table density), Gmail (compact / default / comfortable),
Linear (issue list density), Notion (full width toggle).

---

## Collapsible Sections

For screens where the user works with multiple distinct modules:

- Each module has a header with a collapse toggle.
- Collapsed state shows the module title + a summary (count, status summary).
- Default state is expanded for the most-used module and collapsed for others.
- Persist the user's collapse preferences in local storage.

```
▼ Recent Activity (12 events)
  [activity feed content]

▶ Upcoming Tasks (3 tasks)   ← collapsed; shows count
▶ Team Members (8 members)   ← collapsed; shows count
```

---

## Tooltips as Progressive Disclosure

Tooltips are the canonical progressive disclosure mechanism for labels and icons.

**Mandatory tooltip placement:**
- Every icon-only button
- Every truncated text string
- Every abbreviated value (e.g., "2.3K" → "2,341 requests")
- Every status badge where the meaning might not be immediately obvious
- Every column header in a data table (explain what the metric means)
- Every disabled control (explain *why* it is disabled)

**The rule (Kole Jain):** If the user could reasonably ask "what does this mean?",
the answer belongs in a tooltip. The absence of tooltips is the most reliable signal
of an interface that was never used by anyone other than its creator.

**Tooltip content:**
- Use plain language, not technical identifiers
- Include units where relevant ("Response time in milliseconds")
- For disabled states: explain what the user needs to do to enable the action
- Keep to 1–2 sentences maximum. More than that belongs in a help panel.
