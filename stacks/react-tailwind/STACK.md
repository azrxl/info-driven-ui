---
stack: react-tailwind
description: >
  Component guidance for React + Tailwind CSS without a component library (no shadcn).
  Load this file when the user's stack is React + Tailwind only, using Radix UI
  primitives directly for accessible behavior (tooltips, dropdowns, dialogs).
---

# Stack: React + Tailwind (headless primitives, no shadcn)

> Use Radix UI primitives directly for accessible behavior (focus management,
> keyboard nav, ARIA) and style them by hand with Tailwind. This is the right
> choice when the user doesn't want the shadcn CLI/copy-paste model.

## Status / State → Badge (custom component)

```tsx
type BadgeVariant = "success" | "warning" | "critical" | "neutral" | "info"

const variantStyles: Record<BadgeVariant, string> = {
  success:  "bg-green-100 text-green-800 border-green-200",
  warning:  "bg-amber-100 text-amber-800 border-amber-200",
  critical: "bg-red-100 text-red-800 border-red-200",
  neutral:  "bg-gray-100 text-gray-700 border-gray-200",
  info:     "bg-blue-100 text-blue-800 border-blue-200",
}

function Badge({ variant, children }: { variant: BadgeVariant; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]}`}>
      {children}
    </span>
  )
}

// Usage — map data status to variant explicitly, never by array index
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="critical">Overdue</Badge>
```

## Data Tables → Native table + right-aligned numerics

```tsx
<table className="w-full text-sm">
  <thead>
    <tr className="border-b text-left text-muted-foreground">
      <th className="py-2 px-3">Name</th>
      <th className="py-2 px-3">Status</th>
      <th className="py-2 px-3 text-right">Amount</th>
    </tr>
  </thead>
  <tbody>
    {rows.map((row) => (
      <tr key={row.id} className="group border-b hover:bg-muted/50">
        <td className="py-2 px-3">{row.name}</td>
        <td className="py-2 px-3"><Badge variant={statusToVariant(row.status)}>{row.status}</Badge></td>
        <td className="py-2 px-3 text-right font-mono tabular-nums">
          ${row.amount.toLocaleString()}
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

## Tooltips → @radix-ui/react-tooltip

```tsx
import * as Tooltip from "@radix-ui/react-tooltip"

<Tooltip.Provider delayDuration={200}>
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      <button aria-label="Archive" className="p-2 rounded hover:bg-muted">
        <ArchiveIcon className="h-4 w-4" />
      </button>
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content
        className="rounded bg-gray-900 text-white text-xs px-2 py-1 shadow-md"
        sideOffset={5}
      >
        Archive this item
        <Tooltip.Arrow className="fill-gray-900" />
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>
```

## Empty States

```tsx
function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <InboxIcon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm">{description}</p>
      {actionLabel && (
        <button onClick={onAction} className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
          <PlusIcon className="h-4 w-4 mr-2" />
          {actionLabel}
        </button>
      )}
    </div>
  )
}
```

## Skeleton Loading

```tsx
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className}`} />
}

// Table skeleton
{Array.from({ length: 5 }).map((_, i) => (
  <tr key={i} className="border-b">
    <td className="py-2 px-3"><Skeleton className="h-4 w-32" /></td>
    <td className="py-2 px-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
    <td className="py-2 px-3"><Skeleton className="h-4 w-20 ml-auto" /></td>
  </tr>
))}
```

## Row Hover Actions

```tsx
<tr className="group border-b hover:bg-muted/50">
  <td className="py-2 px-3">{row.name}</td>
  <td className="py-2 px-3 text-right">
    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button className="p-1.5 rounded hover:bg-muted"><PencilIcon className="h-4 w-4" /></button>
      <button className="p-1.5 rounded hover:bg-muted"><MoreHorizontalIcon className="h-4 w-4" /></button>
    </div>
  </td>
</tr>
```

## KPI Cards

```tsx
<div className="rounded-lg border p-4">
  <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
  <p className="text-2xl font-bold tabular-nums mt-1">$48,295</p>
  <p className="text-xs text-muted-foreground mt-1">
    <span className="text-green-600">↑ +12.5%</span> vs last month
  </p>
</div>
```

## Toast Feedback → react-hot-toast or custom

```tsx
import toast from "react-hot-toast"

toast.success("Issue archived")

toast((t) => (
  <span>
    Issue deleted.
    <button onClick={() => { restoreIssue(id); toast.dismiss(t.id) }} className="ml-2 underline">
      Undo
    </button>
  </span>
))

toast.error("Failed to save changes")
```