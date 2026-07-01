# Data Semantics

> Every piece of information has a nature. Identifying that nature is the first design decision.

This file is the classification system. For every field or data group in the interface,
find its category below and read the representation guidance.

---

## 1. State / Status

**What it is:** A fixed set of named conditions an entity can be in.
Typically mutually exclusive. Examples: `Active`, `Pending`, `Suspended`, `Overdue`, `Approved`.

**How to represent:**

- **Chips / Badge pills** — colored, rounded labels. The color is semantic, not decorative:
  - Green → healthy, complete, active
  - Yellow/Amber → warning, pending, needs attention
  - Red → critical, failed, blocked, requires action
  - Gray → neutral, inactive, archived
  - Blue → informational, in progress
- **Never** use plain text for status in dense data contexts. The visual encoding enables
  instant scanning without reading each value.
- **Never** use more than 5–6 distinct status colors in a single interface. After that,
  the encoding breaks down and users stop trusting it.

**Referents:** Linear (issue status), GitHub (PR status), Stripe (payment status),
Jira (ticket status), Vercel (deployment status).

---

## 2. Quantity / Numeric

**What it is:** A measurable amount. Revenue, count, duration, percentage, score.

**How to represent:**

- **Always right-align** numeric columns. Digit position (ones, tens, hundreds) must
  align vertically across rows to enable instant positional comparison without reading
  each number. Left-aligned numbers force the eye to find the start of each value.
- Use **tabular/monospaced numerals** when available in the type system (CSS: `font-variant-numeric: tabular-nums`).
- For **KPI / single metric** displays: large typographic treatment, supporting label,
  optional trend indicator (↑ +12% vs last period). See referents: Stripe Dashboard,
  Grafana panels, Vercel Analytics.
- For **comparison across items**: horizontal bar chart within the table cell (inline bar),
  or a separate bar chart.
- For **ranges**: sparkline, min/max indicator, or distribution bar.
- **Currency**: always include symbol and locale-appropriate formatting. Never raw integers.
- **Large numbers**: format with separators (1,200,000 not 1200000) and consider
  abbreviated forms (1.2M) with a tooltip showing the precise value.

**Referents:** Stripe (revenue metrics), GitHub (contribution counts), Grafana (time-series
panels), Linear (velocity), Notion (formula columns).

---

## 3. Time / Temporal

**What it is:** Timestamps, durations, sequences of events, periods.

**The key question:** Is the *order* of events more important than the *attributes* of events?

If yes → **timeline / activity feed** beats any table sorted by date.

**How to represent by sub-type:**

- **Single timestamp** → relative format when recent ("3 minutes ago"), absolute when
  historical ("Jun 12, 2024"), with full ISO timestamp in a tooltip.
- **Sequence of events (log, activity feed)** → vertical timeline. Each item: timestamp,
  actor/source icon, description, optional detail on expand.
- **Duration** → human-readable ("2h 14m"), progress bar if against a limit,
  sparkline if compared across many instances.
- **Scheduled / future** → calendar, agenda list, countdown.
- **Trend over time** → line chart (continuous) or bar chart (discrete periods).
  Sparklines for compact trend indicators inside a table cell or KPI card.
- **Recurring pattern** → heatmap (GitHub contribution graph, Google Analytics calendar view).

**Never** put a dense event log in a table sorted by timestamp and call it done.
The user's eye is not a database cursor. They need to *see* the time shape.

**Referents:** Linear (activity timeline), GitHub (contribution heatmap, commit history),
Vercel (deployment log), Grafana (time-series), Notion (timeline view),
Stripe (transaction feed), Jira (changelog), Datadog (event stream).

---

## 4. Relation / Association

**What it is:** A connection between two or more entities. User → Orders → Invoices.
Tag applied to multiple items. Dependency between tasks.

**How to represent:**

- **One-to-many with drill-down** → master-detail layout (list on left, detail on right,
  or list with expandable rows). Linear, Notion, Gmail all use this.
- **Many-to-many** → tag clouds, filter-by-tag, relationship graph.
- **Dependency** → DAG visualization, Gantt (if time-bound), tree.
- **Parent-child** → tree view, nested list, breadcrumb trail for navigation.
- **Simple FK reference** → inline linked chip with hover preview
  (e.g., a user's name that previews their profile card on hover).

**Referents:** Linear (project → issue → sub-task tree), Notion (relation properties),
GitHub (PR → issue links, dependency graph), Figma (component → instance network).

---

## 5. Hierarchy / Nesting

**What it is:** A tree structure where items contain sub-items.
File systems, org charts, category trees, recursive comments.

**How to represent:**

- **Collapsible tree** → indented rows with expand/collapse chevron. Best for
  deep hierarchies where the user navigates by expanding nodes of interest.
- **Accordion** → for shallow (2-level) content hierarchies where each parent has
  prose or form content inside.
- **Breadcrumb** → for navigation context within a hierarchy.
- **Outline / nested list** → for document structure.
- **Sunburst / treemap** → for hierarchical *quantities* where proportional size matters
  (e.g., disk usage by folder, budget by department).

**Do not** flatten a hierarchy into a table with a `parent_id` column and leave it at that.
The user cannot reconstruct the tree mentally from flat rows.

**Referents:** VS Code (file explorer), Linear (project > cycle > issue), Notion (page tree),
macOS Finder (column view = tree), GitHub (file browser).

---

## 6. Distribution

**What it is:** How values spread across a range.
Response time distribution, age distribution of users, score distribution.

**How to represent:**

- **Histogram** → frequency distribution of a continuous variable.
- **Box plot** → shows median, quartiles, and outliers. Excellent for comparing
  distributions across categories (e.g., response times by region).
- **Heatmap (grid)** → intensity of a value across two categorical dimensions
  (e.g., hour of day × day of week).
- **Violin plot** → richer than box plot; shows full distribution shape.
- **Density curve** → smooth continuous distribution when data is large.

**Referents:** Datadog (latency distribution), Google Analytics (session duration histogram),
GitHub (code frequency), Vercel (function duration distribution).

---

## 7. Trend / Change Over Time

**What it is:** How a metric evolves. Revenue this month vs last month.
Error rate over the past 24 hours. User growth by week.

**How to represent:**

- **Line chart** → best for continuous metrics over time. Multiple lines for comparison.
- **Area chart** → line chart with fill; emphasizes volume and cumulative feel.
  Use stacked area for part-to-whole over time.
- **Bar chart (time-based)** → for discrete periods (weekly, monthly).
  Grouped bars for comparison across categories within each period.
- **Sparkline** → miniaturized line chart embedded in a table cell or KPI card.
  Conveys trend without taking dashboard real estate.
- **Step chart** → for metrics that change in discrete steps (pricing tier changes,
  feature flags, deployment counts).

**Trend indicators:** Pair any KPI with a Δ indicator (↑ +8.3% vs last period).
Color the indicator (green for positive, red for negative) only when the direction
has clear semantic valence. Revenue up = good. Error rate up = bad. Neutral metrics
should use a neutral color regardless of direction.

**Referents:** Stripe (revenue trend), Vercel (request volume), Grafana (time series),
Linear (velocity trend), GitHub (traffic graph), Datadog (metric explorer).

---

## 8. Progress / Completion

**What it is:** How far along something is toward a defined end state.
Task completion, onboarding steps, upload progress, quota usage.

**How to represent:**

- **Progress bar** → for a single continuous progress toward a known end.
  Label with percentage and/or absolute values ("3 of 7 steps", "2.3 GB of 5 GB").
- **Stepper** → for a sequence of named stages where the user needs to understand
  *which* stage they are in and what comes next. Linear's onboarding, Stripe's
  payment flow, GitHub's PR review stages.
- **Radial / donut** → for quota or capacity usage (disk, seats, API calls).
- **Checklist** → for completion of a non-linear set of items (onboarding tasks,
  setup requirements). Reveal items progressively as prior items complete.
- **Status badge** → for a coarse progress signal (Not started / In progress / Done).

**Referents:** Linear (cycle progress), GitHub (PR review checklist), Stripe (onboarding),
Vercel (deployment stages), Notion (progress property).

---

## 9. Proportion / Part-to-Whole

**What it is:** How parts relate to a total. Market share, budget allocation,
traffic source breakdown.

**How to represent:**

- **Pie / donut chart** → only when there are ≤5 slices and the proportions differ
  meaningfully. Avoid when values are similar — the eye cannot distinguish 23% from 27%.
- **Stacked bar** → better than pie for comparing proportions across multiple groups
  simultaneously.
- **Treemap** → for many categories with hierarchical grouping (e.g., cloud cost
  by service → by resource type).
- **Waffle chart** → for showing proportions in a more readable grid format.

**Never** use a pie chart with more than 6 segments. Use a "Other" bucket and let the
user expand it.

**Referents:** Google Analytics (traffic sources), AWS Cost Explorer (cost breakdown),
Vercel (bandwidth by route).

---

## 10. Geography / Location

**What it is:** Data with a spatial dimension. User location, delivery routes,
regional sales, infrastructure by region.

**How to represent:**

- **Choropleth map** → color-coded regions by metric value (e.g., revenue by country).
- **Point map** → individual location markers (users, stores, incidents).
- **Cluster map** → grouped markers at zoom levels to prevent overplotting.
- **Route map** → paths between locations (logistics, network topology).
- **Region highlight** → for selecting or filtering by geography.

**Do not** represent geographic data as a table with a `country` or `city` column
as the only geographic signal. The spatial pattern is invisible in tabular form.

**Referents:** Stripe Radar (fraud by geography), Cloudflare (traffic by region),
Vercel (edge network), Datadog (infrastructure map).

---

## 11. Category (Fixed Set)

**What it is:** A field that belongs to a known, bounded set of options.
Department, product type, priority level, role.

**How to represent:**

- **Filter pills / segmented control** → for switching the view by category.
- **Chips** → inline label for categorical values in table cells or cards.
- **Color encoding** → assign a consistent color per category across the interface.
  The user learns the encoding quickly. Limit to ≤8 categories with color.
- **Icon + label** → when categories have strong visual metaphors (file types,
  alert severity levels).

**Referents:** Linear (label system), GitHub (issue labels), Notion (select property),
Jira (priority icons).

---

## 12. Free Text / Content

**What it is:** User-generated prose, descriptions, comments, notes.
Not classifiable as structured data.

**How to represent:**

- **Truncated preview with expand** → show the first 1–2 lines, expand on click/hover.
  Never overflow text in a dense data view.
- **Search with highlight** → when the primary task is finding content within text.
- **Rich text editor** → for authoring contexts.
- **Comment thread** → for collaborative annotation, nested replies.
- **Diff view** → for comparing versions of text (code review, document history).

**Referents:** Linear (issue description + comments), GitHub (PR description, review comments),
Notion (page body), Figma (comment pins).

