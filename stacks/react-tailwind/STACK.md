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

## Complete Reference Component: Headless Radix + Custom Tailwind Table

A complete implementation in React using Radix UI primitives (`@radix-ui/react-tooltip` and `@radix-ui/react-dropdown-menu`) and custom styled components.

```tsx
import React, { useState } from "react"
import * as Tooltip from "@radix-ui/react-tooltip"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import toast from "react-hot-toast"
import { 
  Archive, MoreHorizontal, AlertCircle, Inbox, Search, RefreshCw 
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

  // Skeleton component
  const Skeleton = ({ className }: { className?: string }) => (
    <div className={`animate-pulse rounded bg-gray-200 dark:bg-gray-800 ${className}`} />
  )

  // 1. Loading State (Skeleton match)
  if (isLoading) {
    return (
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Customer</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">Amount</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">Date</th>
              <th className="px-4 py-3 w-[80px]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                <td className="px-4 py-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
                <td className="px-4 py-3 text-right"><Skeleton className="h-4 w-20 ml-auto" /></td>
                <td className="px-4 py-3 text-right"><Skeleton className="h-4 w-24 ml-auto" /></td>
                <td className="px-4 py-3"><Skeleton className="h-8 w-8 rounded-md" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // 2. Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-red-100 bg-red-50/50 p-8 text-center">
        <AlertCircle className="h-8 w-8 text-red-600 mb-3" />
        <h3 className="font-semibold text-red-950 dark:text-red-900">Failed to load invoices</h3>
        <p className="text-sm text-red-700 mt-1 mb-4">{error.message || "A network error occurred."}</p>
        <button 
          onClick={onRetry}
          className="inline-flex items-center justify-center rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 focus:outline-none"
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Retry Load
        </button>
      </div>
    )
  }

  // 3. Empty State
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg dark:border-gray-800">
        <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4 mb-4">
          <Inbox className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No invoices found</h3>
        <p className="text-sm text-gray-500 mb-4 max-w-sm">
          Generate your first invoice to bill clients and receive payments.
        </p>
        <button className="inline-flex items-center justify-center rounded-md bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-sm font-medium">
          Create Invoice
        </button>
      </div>
    )
  }

  const filteredData = data.filter(inv => 
    inv.customer.toLowerCase().includes(filterQuery.toLowerCase())
  )

  const statusVariantStyles = {
    paid: "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400 border-green-200 dark:border-green-900/50",
    pending: "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-900/50",
    overdue: "bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400 border-red-200 dark:border-red-900/50"
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
      {/* Interactive Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          placeholder="Filter by customer..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="pl-9 h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>

      {/* 4. No-Results Empty State */}
      {filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-lg dark:border-gray-800">
          <Search className="h-8 w-8 text-gray-400 mb-3" />
          <h3 className="font-semibold mb-1">No matching invoices</h3>
          <p className="text-sm text-gray-500 mb-4">
            No customer matches "{filterQuery}". Try adjusting your search query.
          </p>
          <button 
            onClick={() => setFilterQuery("")}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
          >
            Clear Filter
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
          <Tooltip.Provider delayDuration={200}>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Customer</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <span className="cursor-help border-b border-dotted border-gray-400">Status</span>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content className="rounded bg-black text-white text-xs px-2 py-1 shadow-md max-w-xs" sideOffset={5}>
                          The current collection phase of the invoice
                          <Tooltip.Arrow className="fill-black" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Amount</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Date</th>
                  <th className="px-4 py-3 w-[80px]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-black">
                {filteredData.map((invoice) => (
                  <tr key={invoice.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-950/20">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{invoice.customer}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusVariantStyles[invoice.status]}`}>
                        {invoice.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-gray-900 dark:text-gray-100">
                      ${invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500">
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <time className="cursor-help">{formatRelativeTime(invoice.date)}</time>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content className="rounded bg-black text-white text-xs px-2 py-1 shadow-md" sideOffset={5}>
                            {new Date(invoice.date).toLocaleString()}
                            <Tooltip.Arrow className="fill-black" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                              <Archive className="h-4 w-4" />
                            </button>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content className="rounded bg-black text-white text-xs px-2 py-1 shadow-md" sideOffset={5}>
                              Archive invoice records
                              <Tooltip.Arrow className="fill-black" />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                        
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger asChild>
                            <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Portal>
                            <DropdownMenu.Content 
                              className="min-w-[140px] rounded-md bg-white dark:bg-gray-900 p-1 shadow-lg border border-gray-200 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300"
                              sideOffset={5}
                              align="end"
                            >
                              <DropdownMenu.Item className="px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer outline-none">
                                Download PDF
                              </DropdownMenu.Item>
                              <DropdownMenu.Item className="px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer outline-none">
                                Send Reminder
                              </DropdownMenu.Item>
                              <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-800 my-1" />
                              <DropdownMenu.Item 
                                className="px-2 py-1.5 rounded text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer outline-none"
                                onClick={() => {
                                  onDelete(invoice.id)
                                  const tId = toast.success(
                                    <span>
                                      Invoice deleted.{" "}
                                      <button 
                                        onClick={() => {
                                          // Undo action handler
                                          toast.dismiss(tId)
                                        }}
                                        className="underline font-semibold"
                                      >
                                        Undo
                                      </button>
                                    </span>,
                                    { duration: 5000 }
                                  )
                                }}
                              >
                                Delete
                              </DropdownMenu.Item>
                            </DropdownMenu.Content>
                          </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Tooltip.Provider>
        </div>
      )}
    </div>
  )
}
```

```