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

## Complete Reference Component: Data Table with Full Lifecycle

This component implements the full data lifecycle: loading skeleton, empty state, filter no-results, relative dates with absolute tooltips, right-aligned tabular numerals, status badges, row-hover actions, and optimistic deletion with toast-based undo.

```tsx
import React, { useState } from "react"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { 
  Archive, MoreHorizontal, AlertCircle, Inbox, Search, Undo, RefreshCw 
} from "lucide-react"

export interface Invoice {
  id: string
  customer: string
  amount: number
  status: "paid" | "pending" | "overdue"
  date: string // ISO string
}

interface InvoiceTableProps {
  isLoading: boolean
  error: Error | null
  data: Invoice[] | null
  onRetry: () => void
  onDelete: (id: string) => Promise<void>
}

export function InvoiceTable({ isLoading, error, data, onRetry, onDelete }: InvoiceTableProps) {
  const [filterQuery, setFilterQuery] = useState("")

  // 1. Loading State (Skeleton screen matching layout shape)
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Date</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                <TableCell><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  // 2. Error State (Actionable, explains what happened)
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-red-100 bg-red-50/50 p-8 text-center">
        <AlertCircle className="h-8 w-8 text-red-600 mb-3" />
        <h3 className="font-semibold text-red-900">Failed to load invoices</h3>
        <p className="text-sm text-red-700 mt-1 mb-4">{error.message || "A network error occurred."}</p>
        <Button variant="outline" size="sm" onClick={onRetry} className="border-red-200 hover:bg-red-50">
          <RefreshCw className="h-4 w-4 mr-2" /> Retry Load
        </Button>
      </div>
    )
  }

  // 3. Truly Empty State (Nothing exists in database)
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Inbox className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No invoices found</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-sm">
          Generate your first invoice to bill clients and receive payments.
        </p>
        <Button>Create Invoice</Button>
      </div>
    )
  }

  // Filter logic
  const filteredData = data.filter(inv => 
    inv.customer.toLowerCase().includes(filterQuery.toLowerCase())
  )

  // Helper mapping status to semantic badges
  const statusConfig = {
    paid: { label: "Paid", variant: "default", className: "bg-green-500/15 text-green-700 hover:bg-green-500/15 border-green-500/20" },
    pending: { label: "Pending", variant: "default", className: "bg-amber-500/15 text-amber-700 hover:bg-amber-500/15 border-amber-500/20" },
    overdue: { label: "Overdue", variant: "destructive", className: "" }
  } as const

  const formatRelativeTime = (isoString: string) => {
    const date = new Date(isoString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays === 1) return "Today"
    if (diffDays === 2) return "Yesterday"
    return `${diffDays} days ago`
  }

  return (
    <div className="space-y-4">
      {/* Search Input for interactive filtering */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Filter by customer..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="pl-9 h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      {/* 4. No-Results Empty State (Filtered state is empty) */}
      {filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
          <Search className="h-8 w-8 text-muted-foreground mb-3" />
          <h3 className="font-semibold mb-1">No matching invoices</h3>
          <p className="text-sm text-muted-foreground mb-4">
            No customer matches "{filterQuery}". Try adjusting your search query.
          </p>
          <Button variant="outline" size="sm" onClick={() => setFilterQuery("")}>
            Clear Filter
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <TooltipProvider delayDuration={200}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help border-b border-dotted border-muted-foreground">Status</span>
                      </TooltipTrigger>
                      <TooltipContent>The current collection phase of the invoice</TooltipContent>
                    </Tooltip>
                  </TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((invoice) => (
                  <TableRow key={invoice.id} className="group">
                    <TableCell className="font-medium">{invoice.customer}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={statusConfig[invoice.status].variant}
                        className={statusConfig[invoice.status].className}
                      >
                        {statusConfig[invoice.status].label}
                      </Badge>
                    </TableCell>
                    {/* Numeric Value: Right-aligned + tabular numbers */}
                    <TableCell className="text-right font-mono tabular-nums">
                      ${invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    {/* Date Value: Right-aligned + Relative (Absolute date in tooltip) */}
                    <TableCell className="text-right text-muted-foreground">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <time className="cursor-help">{formatRelativeTime(invoice.date)}</time>
                        </TooltipTrigger>
                        <TooltipContent>{new Date(invoice.date).toLocaleString()}</TooltipContent>
                      </Tooltip>
                    </TableCell>
                    {/* Row Hover Actions: Invisible at rest, visible on row hover */}
                    <TableCell>
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Archive className="h-4 w-4" />
                              <span className="sr-only">Archive</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Archive invoice records</TooltipContent>
                        </Tooltip>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Download PDF</DropdownMenuItem>
                            <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:bg-destructive/15 focus:text-destructive"
                              onClick={() => {
                                onDelete(invoice.id)
                                toast("Invoice deleted", {
                                  action: {
                                    label: "Undo",
                                    onClick: () => {
                                      // Logic to undo deletion
                                    }
                                  },
                                  duration: 5000
                                })
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TooltipProvider>
        </div>
      )}
    </div>
  )
}
```

