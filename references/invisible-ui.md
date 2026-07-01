# Invisible UI

> A UI without hover states, tooltips, empty states, and loading feedback
> is not a finished UI. It is a prototype that was shipped.

Invisible UI refers to all the interaction affordances, state transitions, and contextual
behaviors that the user does not see when they look at a screenshot — but immediately
feels when they use the interface. A junior implementation renders the happy path.
A senior implementation renders every state the user will encounter.

---

## The Complete State Inventory

Before shipping any component, verify that each of the following states has been
designed. The ones most commonly skipped are marked with ⚠.

### Data States

| State | Description | What to show |
|---|---|---|
| **Loading** | Data is being fetched | Skeleton screen matching the layout of the loaded content |
| **Empty** ⚠ | No data exists yet | Illustration + explanation + primary CTA to create first item |
| **No Results** ⚠ | Data exists but search/filter returned nothing | Clear explanation + suggestion to adjust filters |
| **Error** ⚠ | Data failed to load | Error message + retry action |
| **Partial** | Some data loaded, some failed | Render what succeeded, mark failed sections with a retry |
| **Stale** | Data is cached and may be outdated | Subtle "last updated X ago" + manual refresh trigger |
| **Offline** ⚠ | No network connection | Offline banner + indicator of what is / isn't available |

### Interaction States (per interactive element)

| State | Trigger | Visual signal |
|---|---|---|
| **Default** | Element at rest | Base appearance |
| **Hover** | Cursor enters element | Subtle background shift, reveal secondary actions |
| **Focus** | Keyboard focus / tab | Visible focus ring (never remove outlines without replacement) |
| **Active / Pressed** | Mouse down / touch | Scale down slightly or darken background |
| **Disabled** | Action not available | Reduced opacity + `not-allowed` cursor + tooltip explaining why |
| **Selected** | Item is chosen in a list | Highlighted background + checkmark or selection indicator |
| **Dragging** | Item being dragged | Elevated shadow, slight rotation, translucent clone |
| **Drop target** | Valid drop zone with item being dragged | Highlighted border or background, clear visual affordance |

### Operation States (async actions)

| State | When | What to show |
|---|---|---|
| **Pending** | Action is in flight | Spinner or progress on the triggering button; disable it |
| **Optimistic** | Action assumed to succeed | Immediately show expected result; revert on failure |
| **Success** ⚠ | Action completed | Brief success feedback (toast, inline checkmark, green flash) |
| **Failure** ⚠ | Action failed | Inline error message, revert any optimistic update, retry action |
| **Conflict** | Server state changed while user was acting | Alert with merge/overwrite options |
| **Timeout** | Action took too long | Message with retry and option to continue in background |

### Content States

| State | Description | Pattern |
|---|---|---|
| **Truncated** | Text longer than display area | Truncate with `…` + tooltip or expand trigger |
| **Overflow** | Too many items to show | "Show 8 more" pattern; never silently cut off |
| **Permission denied** ⚠ | User lacks access | Explain why, not just a generic 403 error |
| **Deprecated** | Feature or item is being retired | Inline warning with migration path |

---

## Hover State Patterns

Hover states are where the interface reveals its depth.

### Row hover in a data table

```
At rest:     [ Name       ]  [ Status  ]  [ Date     ]
On hover:    [ Name       ]  [ Status  ]  [ Date     ]  [ ✏ ]  [ 🔗 ]  [ ⋯ ]
             ↑ Background shifts to subtle highlight
```

Actions that appear on row hover:
- View detail (→ drawer or navigate)
- Edit (inline or → edit drawer)
- Copy (copy ID, copy link, copy row value)
- More / overflow (⋯) → for destructive and rare actions

### Card hover

```
At rest:     Card with primary content
On hover:    Card elevation increases (shadow)
             Optional: reveal action buttons at bottom
             Optional: thumbnail transforms (scale, brightness)
```

**Do not** hide the primary action behind hover on mobile. Hover does not exist on touch.

### Cell-level hover

For data tables where cells contain copyable values (IDs, codes, keys):

```
At rest:     abc-123-def
On hover:    abc-123-def  [📋]  ← copy icon appears inline
After copy:  abc-123-def  [✓]   ← brief checkmark confirmation
```

**Referents:** GitHub (commit SHA copy), Stripe (transaction ID copy),
Linear (issue ID copy), Vercel (deployment URL copy).

---

## Tooltip Patterns

Tooltips are the highest-density progressive disclosure mechanism available.
Every non-obvious element must have one.

### Mandatory tooltip coverage

- **Icon-only buttons** — "Archive", "Duplicate", "Settings", etc. must all have tooltips.
  An interface full of unlabeled icons is an interface nobody trusts.
- **Abbreviated values** — "1.2K" should show "1,247 total" in a tooltip.
- **Column headers** — "p95" should explain "95th percentile response time in ms".
- **Status badges** — "Degraded" should explain what that means and since when.
- **Disabled controls** — "Publish" (disabled) should explain "Complete required fields first".
- **Timestamps in relative format** — "3 days ago" should show the full date on hover.
- **Truncated text** — always show the full content in a tooltip.
- **User avatars** — show the user's full name.

### Tooltip content rules

```
✓  "Delete this issue permanently. This cannot be undone."
✗  "Delete"  (just repeating the label)

✓  "Response time at the 95th percentile, in milliseconds"
✗  "p95"  (the abbreviation again)

✓  "Archived on Jun 12, 2024 by @mgarcia"
✗  "This item is archived."
```

**Tooltip placement:** Prefer top or bottom. Never overlap the element the tooltip
is describing. On mobile, tooltips become long-press popovers.

---

## Empty States

An empty state is not an error. It is an opportunity.

Every list, table, or dashboard that can have zero items must have a designed empty state.
An empty state has three components:

1. **An illustration or icon** — conveys the type of content that will appear here.
   Avoid generic "no data" icons. A task list empty state should suggest tasks.
2. **An explanatory message** — tells the user what this space is for and why it's empty.
3. **A primary CTA** — the one action that turns the empty state into a populated state.

```
[  📋  ]
  No tasks yet

  Tasks you create will appear here.
  Track your work and collaborate with your team.

  [ + Create your first task ]
```

**Distinguish between:**
- **Truly empty** (nothing exists yet) → encouraging, action-forward
- **No results** (filters returned nothing) → helpful, offer filter reset
- **No access** (permission denied) → explain why, offer escalation path

**Referents:** Linear (empty project), Notion (empty database), GitHub (empty repo),
Vercel (no deployments), Stripe (no transactions).

---

## Loading Patterns

### Skeleton screens

The correct loading pattern for content-heavy interfaces. A skeleton screen:
- Mirrors the exact layout of the content that will load
- Uses a shimmer animation from left to right
- Has no spinners, no "Loading..." text
- Feels fast because the user understands the shape of what's coming

```
┌─────────────────────────────────────┐
│ ████████████    ███   ████  ░░░░░░ │  ← row skeleton
│ ████████        ███   ████  ░░░░░░ │
│ ██████████████  ███   ████  ░░░░░░ │
└─────────────────────────────────────┘
```

**Use skeletons for:** Tables, card grids, user profiles, feed content.

**Use a spinner for:** Single-action feedback (button submitting, file uploading),
where there is no known shape for what's coming.

**Never use a full-page spinner** for content that has a predictable shape.

### Progressive loading

Load and render data as it arrives rather than waiting for all data.
Show primary content first (names, statuses), fill in secondary content (metrics,
previews) as they resolve.

---

## Microinteraction Patterns

### Copy confirmation

```
Click → Button label changes to "Copied!" for 1.5s → Returns to original label
```

Never just copy silently. The user needs to know the copy succeeded.

### Optimistic updates

When the user performs a fast, reversible action (toggle, status change, like):

1. Immediately reflect the change in the UI
2. Fire the API call in the background
3. If the call fails: revert the UI, show an error toast with a retry option

**Never** make the user wait for a network round-trip for a state toggle.

### Undo

For destructive or significant actions, prefer a timed undo over a confirmation dialog:

```
[ Item deleted.  Undo ]  ← toast, visible for 5–8 seconds
```

This reduces friction (no dialog to dismiss) while providing a safety net.
**Referents:** Gmail (email archive/delete), Linear (issue delete), Notion (block delete).

### Selection mode

When the user needs to act on multiple items:

```
Default:   Rows display as normal
Hover:     Checkbox appears on left
Checked:   Row highlights, bulk action bar appears at bottom/top
           [ 3 selected  |  Archive  Delete  Move  ✕ Clear ]
```

**Never** show the bulk action bar when zero items are selected.

---

## Comment and Annotation Indicators

For collaborative interfaces where items can be annotated:

- A small dot or avatar cluster in the corner of a row/card indicates active comments
- Hovering the indicator reveals a preview of the most recent comment
- Clicking navigates to the item detail with comments visible

**Referents:** Figma (comment pins), Linear (issue comments), GitHub (PR review comments),
Notion (inline comments).

---

## Drag and Drop Affordances

For sortable lists and Kanban boards:

- **Drag handle** (`⠿` icon) appears on row hover — never permanently visible
- **Dragging state**: the item gains elevation (shadow), slight rotation (2–3°),
  and 80–90% opacity. The original slot shows a placeholder.
- **Valid drop zone**: highlighted with a colored border or background
- **Invalid drop zone**: no highlight; cursor changes to `not-allowed`
- **After drop**: item settles with a brief transition, no jarring jump

---

## Keyboard Navigation

Every interactive element must be reachable and operable with a keyboard.
Beyond accessibility compliance, keyboard shortcuts are a power-user feature:

- **Global shortcuts** → `K` for command palette (Linear, GitHub, Vercel all do this)
- **List navigation** → arrow keys move focus between items
- **Quick actions** → `E` to edit, `D` to delete, `Space` to select in focused row

Reveal available shortcuts in a tooltip on hover or via a help shortcut (`?`).
Never require the user to discover shortcuts through documentation alone.
