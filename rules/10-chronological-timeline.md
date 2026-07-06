---
rule: "10-chronological-timeline"
severity: major
applies-to: [all-stacks]
refs: [references/component-engine.md, references/data-semantics.md]
---

# Rule 10: Chronological Data Demands Chronological Form

If data has a strong time dimension and the order of events is the primary information,
use a timeline or activity feed — not a table sorted by a date column. The user's eye
is not a database cursor.

## ❌ Incorrect

```tsx
{/* Event log dumped into a table sorted by timestamp — user must read row by row */}
<table>
  <thead>
    <tr>
      <th>Timestamp</th>
      <th>Event</th>
      <th>Actor</th>
    </tr>
  </thead>
  <tbody>
    {events.sort((a, b) => b.date - a.date).map(event => (
      <tr key={event.id}>
        <td>{formatDate(event.date)}</td>
        <td>{event.description}</td>
        <td>{event.actor}</td>
      </tr>
    ))}
  </tbody>
</table>
```

## ✅ Correct

```tsx
{/* Vertical timeline — the time *shape* is visible at a glance */}
<div className="relative">
  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
  {events.map(event => (
    <div key={event.id} className="relative flex gap-4 pb-8 ml-4">
      <div className="absolute -left-4 mt-1.5 flex h-3 w-3 items-center justify-center">
        <div className={cn(
          "h-3 w-3 rounded-full border-2 bg-background",
          event.type === "error" ? "border-red-500" : "border-primary"
        )} />
      </div>
      <div className="flex-1 ml-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{event.description}</span>
          <Badge variant="outline" className="text-xs">{event.type}</Badge>
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          <Avatar className="h-4 w-4"><AvatarImage src={event.actor.avatar} /></Avatar>
          <span>{event.actor.name}</span>
          <span>·</span>
          <Tooltip>
            <TooltipTrigger>
              <time>{event.relativeTime}</time>
            </TooltipTrigger>
            <TooltipContent>{event.absoluteTime}</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  ))}
</div>
```

## Why

A table sorted by timestamp forces the user to read events sequentially as rows.
A timeline lets the user see the *shape* of activity — clusters of events, gaps,
recent vs old — without reading individual entries. The chronological form makes
time visible as a spatial dimension.

This is "The Kole Jain Rule": if you find yourself sorting a table by a timestamp
column to show an event log — stop. Replace it with a timeline or activity feed.

→ `references/component-engine.md` "The Kole Jain Rule", `references/data-semantics.md` §3
