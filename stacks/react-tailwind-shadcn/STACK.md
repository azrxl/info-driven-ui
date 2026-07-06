---
stack: react-shadcn-tailwind
description: >
  Component guidance for React + shadcn/ui + Tailwind CSS v4.
  Load this file when the user's stack is confirmed as React with shadcn/ui.
---

# Stack: React + shadcn/ui + Tailwind CSS

> This file maps info-driven-ui principles to concrete shadcn/ui components.
> Read data-semantics.md and component-engine.md first, then use this file
> to implement the chosen component in the user's stack.

## Status / State → Badge

```tsx
import { Badge } from "@/components/ui/badge"

// Semantic color variants
<Badge variant="default">Active</Badge>       // neutral/blue
<Badge variant="destructive">Overdue</Badge>  // red
// For custom semantic colors, extend with className:
<Badge className="bg-green-100 text-green-800 border-green-200">Complete</Badge>
<Badge className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>
```

## Data Tables → DataTable with TanStack Table

```tsx
// Right-align numeric columns
{
  accessorKey: "amount",
  header: () => <div className="text-right">Amount</div>,
  cell: ({ row }) => (
    <div className="text-right font-mono tabular-nums">
      ${row.getValue("amount").toLocaleString()}
    </div>
  ),
}
```

## Tooltips → Tooltip

```tsx
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Icon-only button with tooltip (mandatory pattern)
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="icon">
        <ArchiveIcon className="h-4 w-4" />
        <span className="sr-only">Archive</span>
      </Button>
    </TooltipTrigger>
    <TooltipContent>Archive this item</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

## Empty States

```tsx
// Pattern for empty list states
<div className="flex flex-col items-center justify-center py-16 text-center">
  <div className="rounded-full bg-muted p-4 mb-4">
    <InboxIcon className="h-8 w-8 text-muted-foreground" />
  </div>
  <h3 className="text-lg font-semibold mb-1">No items yet</h3>
  <p className="text-sm text-muted-foreground mb-4 max-w-sm">
    Items you create will appear here.
  </p>
  <Button>
    <PlusIcon className="h-4 w-4 mr-2" />
    Create your first item
  </Button>
</div>
```

## Skeleton Loading

```tsx
import { Skeleton } from "@/components/ui/skeleton"

// Table skeleton — mirrors the table layout
{Array.from({ length: 5 }).map((_, i) => (
  <TableRow key={i}>
    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
    <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
    <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
  </TableRow>
))}
```

## Row Hover Actions (Progressive Disclosure)

```tsx
// Reveal actions on row hover using group/group-hover Tailwind classes
<TableRow className="group">
  <TableCell>{item.name}</TableCell>
  <TableCell>{item.status}</TableCell>
  <TableCell>
    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button variant="ghost" size="icon">
        <PencilIcon className="h-4 w-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </TableCell>
</TableRow>
```

## KPI Cards

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

<Card>
  <CardHeader className="pb-2">
    <CardTitle className="text-sm font-medium text-muted-foreground">
      Monthly Revenue
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold tabular-nums">$48,295</div>
    <p className="text-xs text-muted-foreground mt-1">
      <span className="text-green-600">↑ +12.5%</span> vs last month
    </p>
  </CardContent>
</Card>
```

## Toast for Action Feedback

```tsx
import { toast } from "sonner"  // preferred with shadcn

// Success
toast.success("Issue archived")

// With undo action
toast("Issue deleted", {
  action: {
    label: "Undo",
    onClick: () => restoreIssue(id),
  },
  duration: 6000,
})

// Error with retry
toast.error("Failed to save changes", {
  action: {
    label: "Retry",
    onClick: () => saveChanges(),
  },
})
```

