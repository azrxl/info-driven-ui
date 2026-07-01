# Review Checklist

> Run this checklist on every UI before delivering it.
> A failing item is a bug, not a preference.

---

## Data Representation

- [ ] Every status or state field uses a chip/badge, not plain text
- [ ] Every numeric column is right-aligned
- [ ] Currency values include symbol and locale-appropriate formatting
- [ ] Large numbers use separators (1,200,000) or abbreviated form (1.2M) with tooltip
- [ ] Event/log data with a time dimension uses a timeline or feed, not a flat table
- [ ] No table has more than 6 primary columns without a column picker
- [ ] Charts have titles, axis labels, and units
- [ ] Charts have a stated time range or data scope

## Color

- [ ] Color is used to encode meaning, not decoration
- [ ] Red is used only for critical states, errors, or urgent attention required
- [ ] Green is used only for success, healthy, or complete states
- [ ] No more than 6 distinct semantic colors are used in a single view
- [ ] Color is never the *only* encoding — there is always a label, icon, or text backup (accessibility)

## Information Hierarchy

- [ ] There is exactly one primary action visible per view
- [ ] Destructive actions (Delete, Remove, Revoke) are not permanently visible in table rows
- [ ] Secondary actions on rows appear on hover only
- [ ] The most important metric or content is visually dominant (size, position, weight)
- [ ] Secondary content is visually subordinate

## Tooltips

- [ ] Every icon-only button has a tooltip
- [ ] Every abbreviated value has a tooltip showing the full value
- [ ] Every column header in a data table has a tooltip explaining the metric
- [ ] Every status badge has a tooltip explaining its meaning
- [ ] Every disabled control has a tooltip explaining why it is disabled
- [ ] Every relative timestamp ("3 days ago") has a tooltip with the absolute date/time
- [ ] Every truncated text string reveals the full content in a tooltip

## States

- [ ] Loading state is designed (skeleton screen or spinner, appropriate to context)
- [ ] Empty state is designed (illustration + explanation + CTA)
- [ ] No-results state is designed (different from empty — user filtered to nothing)
- [ ] Error state is designed with a retry action
- [ ] Offline/disconnected state is handled visibly
- [ ] Pending state on async actions disables the trigger and shows progress
- [ ] Success feedback exists for completed actions (toast, inline confirmation)
- [ ] Failure feedback exists for failed actions (error message + retry)
- [ ] Hover state exists on all interactive rows and cards
- [ ] Focus state is visible on all interactive elements (keyboard navigation)

## Progressive Disclosure

- [ ] The interface is readable at a glance in under 5 seconds for the primary task
- [ ] Secondary attributes are revealed on interaction, not displayed permanently
- [ ] Advanced or rare actions are in overflow menus or secondary panels
- [ ] Onboarding steps reveal sequentially — Step N+1 only after Step N completes

## Accessibility

- [ ] Color is never the sole encoding of information (always paired with text/icon)
- [ ] Focus rings are visible (not removed without replacement)
- [ ] Interactive elements have accessible labels (aria-label or visible text)
- [ ] Images and icons have alt text or aria-hidden if decorative
- [ ] Contrast ratio meets WCAG AA minimum (4.5:1 for normal text, 3:1 for large text)

## Mobile / Responsive (if applicable)

- [ ] Hover-revealed actions have a touch alternative (long press, swipe, visible action buttons)
- [ ] Touch targets are at least 44×44px
- [ ] Tables that cannot be made responsive have a card-based mobile alternative
- [ ] Tooltips have a long-press or tap alternative

---

## Final Check

Before delivering:

> Can a user who has never seen this interface understand the purpose of the screen
> within 5 seconds without reading a manual?

If not — the primary information hierarchy is broken. Revise before delivering.

