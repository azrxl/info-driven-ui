---
rule: "05-table-as-last-resort"
severity: major
applies-to: [all-stacks]
refs: [references/component-engine.md, references/data-semantics.md]
---

# Rule 05: Table Is a Last Resort — Not a Default

A table is the correct component only when the user needs to compare multiple attributes
across multiple items simultaneously. If the data has a dominant time dimension, use a
timeline. If items are few, use cards. If comparison is the task, consider a chart.

**Classify the data BEFORE choosing a component.**

## ❌ Incorrect

```tsx
{/* Event log dumped into a table sorted by date — database output, not UI */}
<table>
  <thead>
    <tr>
      <th>Date</th>
      <th>Event</th>
      <th>User</th>
    </tr>
  </thead>
  <tbody>
    {events.map(e => (
      <tr key={e.id}>
        <td>{e.date}</td>
        <td>{e.description}</td>
        <td>{e.user}</td>
      </tr>
    ))}
  </tbody>
</table>
```

```tsx
{/* 4 items displayed as a table — cards would be far more effective */}
<table>
  {plans.map(plan => (
    <tr key={plan.id}>
      <td>{plan.name}</td>
      <td>${plan.price}</td>
      <td>{plan.features.join(", ")}</td>
    </tr>
  ))}
</table>
```

## ✅ Correct

```tsx
{/* Event log → timeline / activity feed (data is chronological) */}
<div className="relative border-l-2 border-muted ml-4">
  {events.map(event => (
    <div key={event.id} className="mb-6 ml-6">
      <div className="absolute -left-2 w-4 h-4 rounded-full bg-primary" />
      <time className="text-xs text-muted-foreground">{event.relativeDate}</time>
      <p className="text-sm font-medium">{event.description}</p>
      <span className="text-xs text-muted-foreground">by {event.user}</span>
    </div>
  ))}
</div>
```

```tsx
{/* Few items → card grid instead of table */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {plans.map(plan => (
    <Card key={plan.id}>
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <p className="text-2xl font-bold">${plan.price}/mo</p>
      </CardHeader>
      <CardContent>
        <ul>{plan.features.map(f => <li key={f}>✓ {f}</li>)}</ul>
      </CardContent>
    </Card>
  ))}
</div>
```

## Why

The table is the most overused component in data UI. It works when users need to
scan and compare many attributes across many items. In all other cases, a more
specific component serves the data's nature better.

→ `references/component-engine.md` "The default table" anti-pattern
