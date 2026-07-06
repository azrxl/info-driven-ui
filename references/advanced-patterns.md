# Advanced UI Patterns & Content Gaps

> Premium interfaces balance advanced capabilities (real-time, large scale, globalization) with clean semantics.

---

## 1. Dark Mode & Semantic Theming

In dark mode, semantic colors (red/green/amber) must maintain their semantic meaning without becoming visually overwhelming or blending into the background.

*   **Avoid high saturation backgrounds:** In light mode, a `bg-red-100` background is readable. In dark mode, a bright red background causes eye strain and reduces contrast.
*   **The Muted Tint Pattern:** Use high-transparency semantic backgrounds with higher-contrast text.
    *   **Paid/Success:** Light: `bg-green-100 text-green-800` | Dark: `bg-green-500/10 text-green-400 border-green-500/20`
    *   **Pending/Warning:** Light: `bg-amber-100 text-amber-800` | Dark: `bg-amber-500/10 text-amber-400 border-amber-500/20`
    *   **Critical/Error:** Light: `bg-red-100 text-red-800` | Dark: `bg-red-500/10 text-red-400 border-red-500/20`
*   **Color Meanings Remain Constant:** Do not swap meanings. Green is always healthy, red is always warning, even under dark mode themes.

---

## 2. Real-Time Data & Live Collaboration

When data is updating dynamically (WebSockets, polling, multi-user presence):

*   **Avoid layout shift:** When new rows arrive, do not shift the user's current scrolled viewport.
*   **New Data Banner:** Instead of inserting new records directly at the top of a list (which pushes down the row the user might be reading), display a sticky toast or top banner: `"5 new events available — Click to view"`.
*   **Active Presence Indicator:** For multi-user environments (Notion, Figma, Linear):
    *   Show avatar stacks in the top right.
    *   When someone is editing a specific field/row, show a thin colored border around the cell with a tooltip showing who is editing: `[Border: Violet] -> Tooltip: "Sarah is editing"`.
*   **Live Signals:** Use pulsing dots (`relative flex h-2 w-2` with `animate-ping` absolute overlay) to indicate an active socket stream, accompanied by a status message like "Connected to live stream".

---

## 3. Large Dataset Patterns (Virtual Scrolling vs Pagination)

When rendering tables containing thousands of items:

*   **Paging vs Infinite Scroll:**
    *   **Use Pagination (pages with sizes):** When the user needs to refer to specific items, share URLs to list pages, or make comparisons between separate blocks of items.
    *   **Use Infinite Scroll:** When the task is purely exploratory (e.g., social feed, chronological audit trail) and the user has no interest in individual item indexing.
    *   **Use Virtualized Scrolling:** When the list is very large (>1,000 items) but must feel like a single continuous list. Use libraries like `@tanstack/react-virtual` or `@vue/virtual-scroller`.
*   **Virtual Scroll Constraints:** Always reserve explicit heights for list items to avoid layout collapse, and show skeleton rows for content blocks currently virtualization-preloaded.

---

## 4. Data Transition Animations

Micro-animations convey context changes without jarring the user.

*   **Numeric Changes (Counter Roll):** When a KPI metric increments or decrements, do not just swap the text. Use a CSS animation or library (like `framer-motion` or transition effects) to slide digits vertically, suggesting scale changes.
*   **Chart Filtering Transitions:** When changing chart filters (e.g., swapping from 30 days to 7 days), elements must smoothly animate paths rather than flashing blank and drawing from scratch.
*   **Interactive Row Sorting:** When sorting columns, rows should transition to their new vertical positions (CSS `transition: transform 0.2s ease`) instead of instantly snapping.

---

## 5. Data Trust & Freshness

Dashboards must be transparent about the status, accuracy, and age of displayed metrics.

*   **Timestamp Freshness:** Always show a `"Last updated X minutes ago"` or `"As of Jan 24, 15:30 UTC"` in the footer of dashboards or panels. Provide a manual refresh icon button next to it.
*   **Estimated vs Settled Metrics:** When displaying provisional data (e.g., billing amount for an active cycle, unconfirmed payouts):
    *   Style the value as italicized or slightly lower opacity.
    *   Append a badge labeled `Est.` or `Provisional`.
    *   Provide a tooltip explaining that values will settle at the cycle close.
*   **Confidence Intervals:** For forecasting/machine learning metrics: show the target metric followed by the range: `75.2% (±1.4%)` or wrap it in a visual band chart.

---

## 6. Internationalization (i18n)

Global UIs require structural adaptation, not just translated text.

*   **Numeric Right-Alignment in RTL:** When page layout switches to Right-to-Left (RTL, e.g. Arabic, Hebrew):
    *   Alignments swap: labels align to the right, and numbers align to the left (still keeping the digit-place scanning convention relative to page read order).
*   **Locale-Aware Formatting:** Always format currencies and numbers using the user's specific locale (e.g., `Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })` displays `1.200,00 €` while `'en-US'` displays `$1,200.00`).
*   **Localized Date Formatting:** Relative timestamps must match locale guidelines (e.g., "il y a 3 jours" instead of "3 days ago").

---

## 7. Permission-Aware UI (Conditional Visibility)

Avoid showing features that the user's role cannot access, and avoid generic "403 Permission Denied" screens.

*   **Column-Level Permissions:** If a user cannot view a field (e.g. `salary`), omit the column completely from their table layout rather than rendering blank spaces or asterisks (`***`).
*   **Action-Level Permissions:** If an action (e.g., "Edit Server") is restricted:
    *   Do not hide the action entirely if they need to know it exists.
    *   Render the button in a **disabled state**.
    *   Add a tooltip explaining: `"Requires Administrator role to edit. Contact workspace owner to request access."`

---

## 8. Saved Views & Persistent Preferences

Power users require workspace customization.

*   **Saved Filters/Views:** Provide a mechanism to save active filter queries (e.g. `Status = Pending`, `Assignee = Me`) as a custom named view. Display saved views in the sidebar (Linear model).
*   **Pinned Columns:** Allow users to pin critical columns (like Customer Name) to the left side of horizontally overflowing tables. Pinned columns remain fixed while the rest of the table scrolls horizontally.
*   **Preferences Persistence:** Save table density preferences (`comfortable` / `compact`), column ordering, and collapsed layout sections to `localStorage` or backend settings.

---

## 9. Command Palette (Cmd+K)

The command palette is the global navigator of modern web apps.

*   **Triggering:** Bind `Ctrl+K` (Windows/Linux) and `Cmd+K` (macOS) globally. Always show a search button in the top navigation labeled `Search... ⌘K` to discover it.
*   **Categorization:** Group results logically inside the list:
    *   `Navigation` (Go to Settings, Go to Billing)
    *   `Actions` (Create Issue, Invite Member)
    *   `Recent Items` (Recently viewed invoices, active projects)
*   **Keyboard Handling:**
    *   `ArrowUp` / `ArrowDown` to navigate selection.
    *   `Enter` to confirm the selected action.
    *   `Escape` to dismiss the palette.
*   **Referents:** GitHub (Command Palette), Linear (Command Menu), Vercel (Cmd+K).
