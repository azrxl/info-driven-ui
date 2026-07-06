---
rule: "03-tooltip-coverage"
severity: major
applies-to: [all-stacks]
refs: [references/invisible-ui.md, references/progressive-disclosure.md]
---

# Rule 03: Mandatory Tooltip Coverage

Every non-obvious UI element must have a tooltip. The absence of tooltips is the most
reliable signal of an interface that was never used by real users. (Kole Jain)

**Mandatory coverage — all 7 must have tooltips:**
1. Icon-only buttons
2. Abbreviated values (1.2K, 2.3M)
3. Column headers in data tables
4. Status badges
5. Disabled controls (explain *why*)
6. Relative timestamps ("3 days ago")
7. Truncated text strings

## ❌ Incorrect

```tsx
{/* Icon button with no tooltip — user cannot identify the action */}
<button onClick={onArchive}>
  <ArchiveIcon className="h-4 w-4" />
</button>

{/* Abbreviated value with no way to see the full number */}
<span>1.2K</span>

{/* Disabled button with no explanation */}
<button disabled>Publish</button>
```

## ✅ Correct

```tsx
{/* Icon button with descriptive tooltip */}
<Tooltip>
  <TooltipTrigger asChild>
    <button aria-label="Archive this issue" onClick={onArchive}>
      <ArchiveIcon className="h-4 w-4" />
    </button>
  </TooltipTrigger>
  <TooltipContent>Archive this issue</TooltipContent>
</Tooltip>

{/* Abbreviated value shows full number on hover */}
<Tooltip>
  <TooltipTrigger>
    <span className="tabular-nums">1.2K</span>
  </TooltipTrigger>
  <TooltipContent>1,247 total requests</TooltipContent>
</Tooltip>

{/* Disabled button explains why */}
<Tooltip>
  <TooltipTrigger asChild>
    <button disabled>Publish</button>
  </TooltipTrigger>
  <TooltipContent>Complete all required fields first</TooltipContent>
</Tooltip>
```

## Why

If the user could reasonably ask "what does this mean?", the answer belongs in a tooltip.
Tooltips are the highest-density progressive disclosure mechanism — they add zero visual
clutter at rest and maximum context on intent.

→ `references/invisible-ui.md` "Mandatory tooltip coverage", `references/progressive-disclosure.md` "Tooltips"
