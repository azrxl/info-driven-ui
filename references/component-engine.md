
# Component Engine

> Given a data pattern and a user task, this file produces the correct component decision.

Read this file after classifying data in `data-semantics.md` and identifying the primary
user task. Use the decision trees below to arrive at the dominant visual form.

---

## Primary Decision: What Is the User Primarily Doing?

```
What does the user need to do?
│
├── FIND a specific item among many          → Search + filterable list or table
├── COMPARE values across items              → Table (multi-attribute) or Chart (single metric)
├── MONITOR a metric over time               → Time-series chart, KPI card, sparkline
├── UNDERSTAND the shape of data             → Distribution chart, heatmap
├── ACT on individual items                  → Action-forward card grid or list with inline actions
├── NAVIGATE a hierarchy                     → Tree, master-detail, breadcrumb
├── TRACK progress toward a goal             → Progress bar, stepper, checklist
├── EXPLORE relationships                    → Graph, linked master-detail, hover previews
└── REVIEW a sequence of events in time     → Timeline, activity feed
```

---

## Dominant Form Selection by Data Type

### Single metric with trend context

```
One number the user needs to understand at a glance?
│
├── Trend matters                → KPI card + sparkline + Δ% indicator
├── Quota / limit context        → KPI card + radial progress or bar fill
└── No trend needed              → KPI card + supporting label
```

**Referents:** Stripe Dashboard (MRR card), Vercel Analytics (bandwidth card),
Linear (cycle velocity), GitHub (repo stars + trend).

---

### Multiple metrics overview

```
Several KPIs to display at once?
│
├── ≤6 metrics, no relationship between them  → KPI card grid (2–3 cols)
├── Metrics have a part-to-whole relationship → Stacked bar or donut + legend
└── Metrics have a time relationship          → Multi-line chart or grouped bar chart
```

**Never** put 12 KPI cards in a grid. Group by theme, use hierarchy, or use a chart.

---

### List of items, each with multiple attributes

```
Is the user comparing multiple attributes per item?
│
YES → Table
│     ├── Few items (≤10), items are primary focus    → Card grid (not table)
│     ├── Many items, many attributes to compare      → Data table with sorting + filtering
│     ├── Items are people                            → Table with avatar + name + metadata
│     └── Items have a primary status                → Add a status chip column (not text)
│
NO → What is the primary attribute?
      ├── A name/title to browse             → Simple list or command palette
      ├── A status to monitor               → Kanban or grouped list by status
      └── A score or metric to rank         → Ranked list or bar chart
```

---

### Items with a strong time dimension

```
Is the chronological order of events the primary information?
│
YES → Does the user need to see attributes of each event?
│     ├── YES → Activity feed / vertical timeline with expandable items
│     └── NO  → Sparkline or compact event markers on a time axis
│
NO  → Is time one of several attributes?
      ├── YES → Table with a timestamp column (sortable)
      └── NO  → Remove time from the dominant view; make it a secondary detail
```

**The Kole Jain Rule:** If you find yourself sorting a table by a timestamp column
to show an event log — stop. You are forcing the user to read a database output.
Replace it with a timeline or activity feed.

---

### Status-heavy data

```
Do items have a status field from a fixed set of options?
│
YES → How many statuses are there?
      ├── 2–3 states → Color-coded badge pill (Active/Inactive, Pass/Fail)
      ├── 4–6 states → Named chip with semantic color
      └── 7+ states  → Reconsider the data model. Group into 3–5 meaningful states.
│
Is the user trying to act on items by status?
      ├── YES → Kanban (drag-drop status change) or grouped list with bulk actions
      └── NO  → Status column in table or filter pill at the top
```

---

### Hierarchical data

```
How deep is the nesting?
│
├── 1 level (parent + children)      → Accordion or expandable table rows
├── 2–3 levels                       → Collapsible tree view or master-detail-detail
├── 4+ levels                        → Side-panel tree navigator + detail view
└── Arbitrary depth (file system)    → Explorer panel (VS Code model)

Does the user need to see siblings while viewing children?
├── YES → Column view (Finder model) or split master-detail
└── NO  → Drill-down navigation with breadcrumb
```

---

### Geographic data

```
Is the primary question "where?"
│
YES → How many locations?
      ├── ≤20 points       → Point map with labeled markers
      ├── 20–500 points    → Clustered point map
      ├── 500+ points      → Heatmap layer or choropleth (aggregate by region)
      └── Regions matter   → Choropleth with hover tooltip showing metric

Is geography one of several filters?
      └── YES → Region selector (dropdown or clickable map sidebar) feeding a table/chart
```

---

### User-generated content / free text

```
What is the user doing with the text?
│
├── Reading it in context of other data → Truncated preview, expand on click
├── Searching for specific content      → Search with highlighted matches
├── Comparing versions                  → Diff view (side-by-side or inline)
├── Collaborating / reviewing           → Inline comment thread with reply
└── Authoring                           → Rich text editor (not a data component)
```

---

## Component Capability Map

| Component | Best for | Avoid when |
|---|---|---|
| Data table | Multi-attribute comparison across many items | Primary signal is time order or spatial |
| Card grid | Few items where visual identity matters | Many items (>12) or dense attribute comparison |
| KPI card | Single metric with context | More than 6 metrics — use a chart instead |
| Vertical timeline | Ordered sequence of events | Attributes per event are complex — add expand |
| Activity feed | Continuous stream of events | User needs to compare events — use a table |
| Line chart | Continuous metric over time | Discrete categories — use bar chart |
| Bar chart | Comparing a metric across categories or periods | Showing trend in fine detail — use line chart |
| Stacked bar | Part-to-whole over time or across groups | Too many segments (>5) — use treemap |
| Sparkline | Inline trend within a card or table cell | User needs to analyze the trend in detail |
| Donut / radial | Quota usage, 2–5 part-to-whole | More than 5 segments, similar-sized values |
| Heatmap | Frequency/intensity across 2 dimensions | Data is sparse — empty cells mislead |
| Kanban | Workflow status management with drag-drop | Many columns (>6) or high item count |
| Master-detail | One-to-many navigation with selected item detail | Items have few attributes — use a simple list |
| Tree view | Navigating a hierarchy with many levels | Shallow hierarchy (1–2 levels) — use accordion |
| Accordion | Revealing grouped content in a shallow hierarchy | Deep nesting or primary navigation |
| Status chip | Encoding a fixed set of named states | More than 6 distinct states |
| Filter pills | Switching the view by a categorical dimension | More than 8 categories — use a dropdown |
| Progress bar | Linear progress toward a single goal | Multiple concurrent goals — use a stepper |
| Stepper | Sequential multi-step process with named stages | Non-sequential completion |

---

## Anti-Patterns to Reject

**The default table.** Adding a `<table>` before classifying the data.
The table is a component of last resort, not of first instinct.

**The 12-column table.** Every attribute in its own column regardless of importance.
Prioritize: 3–5 primary columns visible, secondary via expand or hover.

**The status text column.** A plain text column that says "Active", "Inactive", "Pending".
Replace every instance with a chip/badge.

**The unsorted timestamp column.** A column labeled "Date" in a table that is the
only way to understand chronological order in event data. Replace with a timeline.

**The orphaned chart.** A chart with no title, no axis labels, no unit, and no
time period. A chart without context is noise.

**The color decoration.** Applying color to UI elements for visual interest rather
than semantic meaning. Color must encode information or it encodes nothing.

**The permanent destructive action.** A "Delete" button permanently visible in every
table row. Move destructive actions to hover, context menu, or overflow menu.
