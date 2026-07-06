---
stack: svelte
description: >
  Component guidance for Svelte 5 + Tailwind CSS, using shadcn-svelte (built on
  Bits UI / Melt UI primitives) for accessible components. Load this file when
  the user's stack is confirmed as Svelte.
---

# Stack: Svelte 5 + shadcn-svelte + Tailwind

> shadcn-svelte is a direct port of shadcn/ui conventions to Svelte, built on
> Bits UI primitives. Same copy-paste-and-own model as the React version.

## Status / State → Badge

```svelte
<script lang="ts">
  import { Badge } from "$lib/components/ui/badge"
</script>

<Badge variant="default">Active</Badge>
<Badge variant="destructive">Overdue</Badge>
<!-- Custom semantic variants via class -->
<Badge class="bg-green-100 text-green-800 border-green-200">Complete</Badge>
<Badge class="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>
```

## Data Tables → native table + Tailwind (or @tanstack/svelte-table for sorting/filtering)

```svelte
<script lang="ts">
  let { rows } = $props<{ rows: Employee[] }>()
</script>

<table class="w-full text-sm">
  <thead>
    <tr class="border-b text-left text-muted-foreground">
      <th class="py-2 px-3">Name</th>
      <th class="py-2 px-3">Status</th>
      <th class="py-2 px-3 text-right">Amount</th>
    </tr>
  </thead>
  <tbody>
    {#each rows as row (row.id)}
      <tr class="group border-b hover:bg-muted/50">
        <td class="py-2 px-3">{row.name}</td>
        <td class="py-2 px-3"><Badge variant={statusToVariant(row.status)}>{row.status}</Badge></td>
        <td class="py-2 px-3 text-right font-mono tabular-nums">
          ${row.amount.toLocaleString()}
        </td>
      </tr>
    {/each}
  </tbody>
</table>
```

## Tooltips → shadcn-svelte Tooltip (Bits UI)

```svelte
<script lang="ts">
  import * as Tooltip from "$lib/components/ui/tooltip"
</script>

<Tooltip.Provider delayDuration={200}>
  <Tooltip.Root>
    <Tooltip.Trigger>
      <button aria-label="Archive" class="p-2 rounded hover:bg-muted">
        <ArchiveIcon class="h-4 w-4" />
      </button>
    </Tooltip.Trigger>
    <Tooltip.Content>
      <p>Archive this item</p>
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
```

## Empty States

```svelte
<script lang="ts">
  let { title, description, actionLabel, onAction } = $props()
</script>

<div class="flex flex-col items-center justify-center py-16 text-center">
  <div class="rounded-full bg-muted p-4 mb-4">
    <InboxIcon class="h-8 w-8 text-muted-foreground" />
  </div>
  <h3 class="text-lg font-semibold mb-1">{title}</h3>
  <p class="text-sm text-muted-foreground mb-4 max-w-sm">{description}</p>
  {#if actionLabel}
    <button onclick={onAction} class="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
      <PlusIcon class="h-4 w-4 mr-2" />
      {actionLabel}
    </button>
  {/if}
</div>
```

## Skeleton Loading

```svelte
<script lang="ts">
  import { Skeleton } from "$lib/components/ui/skeleton"
</script>

{#each Array(5) as _, i (i)}
  <tr class="border-b">
    <td class="py-2 px-3"><Skeleton class="h-4 w-32" /></td>
    <td class="py-2 px-3"><Skeleton class="h-5 w-16 rounded-full" /></td>
    <td class="py-2 px-3"><Skeleton class="h-4 w-20 ml-auto" /></td>
  </tr>
{/each}
```

## Row Hover Actions

```svelte
<tr class="group border-b hover:bg-muted/50">
  <td class="py-2 px-3">{row.name}</td>
  <td class="py-2 px-3">
    <div class="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button class="p-1.5 rounded hover:bg-muted"><PencilIcon class="h-4 w-4" /></button>
      <button class="p-1.5 rounded hover:bg-muted"><MoreHorizontalIcon class="h-4 w-4" /></button>
    </div>
  </td>
</tr>
```

## KPI Cards

```svelte
<script lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card"
</script>

<Card>
  <CardHeader class="pb-2">
    <CardTitle class="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
  </CardHeader>
  <CardContent>
    <div class="text-2xl font-bold tabular-nums">$48,295</div>
    <p class="text-xs text-muted-foreground mt-1">
      <span class="text-green-600">↑ +12.5%</span> vs last month
    </p>
  </CardContent>
</Card>
```

## Toast Feedback → svelte-sonner

```svelte
<script lang="ts">
  import { toast } from "svelte-sonner"

  function archiveItem() {
    toast.success("Issue archived")
  }

  function deleteItem(id: string) {
    toast("Issue deleted", {
      action: { label: "Undo", onClick: () => restoreIssue(id) },
      duration: 6000,
    })
  }
</script>
```

## Complete Reference Component: Svelte 5 + shadcn-svelte Table

A complete implementation in Svelte 5 with `$props()` runes and Melt UI / Bits UI primitives via shadcn-svelte.

```svelte
<!-- InvoiceTable.svelte -->
<script lang="ts">
  import { Badge } from "$lib/components/ui/badge"
  import { Button } from "$lib/components/ui/button"
  import { Skeleton } from "$lib/components/ui/skeleton"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import { toast } from "svelte-sonner"
  import { 
    Archive, MoreHorizontal, AlertCircle, Inbox, Search, RefreshCw 
  } from "lucide-svelte"

  export interface Invoice {
    id: string
    customer: string
    amount: number
    status: "paid" | "pending" | "overdue"
    date: string // ISO string
  }

  let { 
    isLoading = false, 
    error = null, 
    data = null, 
    onRetry, 
    onDelete 
  } = $props<{
    isLoading: boolean
    error: Error | null
    data: Invoice[] | null
    onRetry: () => void
    onDelete: (id: string) => Promise<void>
  }>()

  let filterQuery = $state("")

  const filteredData = $derived(
    data ? data.filter(inv => inv.customer.toLowerCase().includes(filterQuery.toLowerCase())) : []
  )

  const statusConfig = {
    paid: { label: "Paid", className: "bg-green-500/15 text-green-700 hover:bg-green-500/15 border-green-500/20" },
    pending: { label: "Pending", className: "bg-amber-500/15 text-amber-700 hover:bg-amber-500/15 border-amber-500/20" },
    overdue: { label: "Overdue", className: "bg-red-500/15 text-red-700 hover:bg-red-500/15 border-red-500/20" }
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
</script>

<div class="space-y-4">
  <!-- Search -->
  <div class="relative max-w-sm">
    <Search class="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
    <input
      bind:value={filterQuery}
      placeholder="Filter by customer..."
      class="pl-9 h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    />
  </div>

  {#if isLoading}
    <!-- 1. Loading State -->
    <div class="rounded-md border">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b text-left text-muted-foreground">
            <th class="py-2 px-3">Customer</th>
            <th class="py-2 px-3">Status</th>
            <th class="py-2 px-3 text-right">Amount</th>
            <th class="py-2 px-3 text-right">Date</th>
            <th class="w-[80px]"></th>
          </tr>
        </thead>
        <tbody>
          {#each Array(5) as _, i}
            <tr class="border-b">
              <td class="py-2 px-3"><Skeleton class="h-4 w-32" /></td>
              <td class="py-2 px-3"><Skeleton class="h-5 w-16 rounded-full" /></td>
              <td class="py-2 px-3"><Skeleton class="h-4 w-20 ml-auto" /></td>
              <td class="py-2 px-3"><Skeleton class="h-4 w-24 ml-auto" /></td>
              <td class="py-2 px-3"><Skeleton class="h-8 w-8 rounded-md" /></td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else if error}
    <!-- 2. Error State -->
    <div class="flex flex-col items-center justify-center rounded-lg border border-red-100 bg-red-50/50 p-8 text-center">
      <AlertCircle class="h-8 w-8 text-red-600 mb-3" />
      <h3 class="font-semibold text-red-900">Failed to load invoices</h3>
      <p class="text-sm text-red-700 mt-1 mb-4">{error.message || "A network error occurred."}</p>
      <Button variant="outline" size="sm" onclick={onRetry} class="border-red-200 hover:bg-red-50">
        <RefreshCw class="h-4 w-4 mr-2" /> Retry Load
      </Button>
    </div>
  {:else if !data || data.length === 0}
    <!-- 3. Empty State -->
    <div class="flex flex-col items-center justify-center py-16 text-center border rounded-lg">
      <div class="rounded-full bg-muted p-4 mb-4">
        <Inbox class="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 class="text-lg font-semibold mb-1">No invoices found</h3>
      <p class="text-sm text-muted-foreground mb-4 max-w-sm">
        Generate your first invoice to bill clients and receive payments.
      </p>
      <Button>Create Invoice</Button>
    </div>
  {:else if filteredData.length === 0}
    <!-- 4. No-Results State -->
    <div class="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
      <Search class="h-8 w-8 text-muted-foreground mb-3" />
      <h3 class="font-semibold mb-1">No matching invoices</h3>
      <p class="text-sm text-muted-foreground mb-4">
        No customer matches "{filterQuery}". Try adjusting your search query.
      </p>
      <Button variant="outline" size="sm" onclick={() => filterQuery = ""}>
        Clear Filter
      </Button>
    </div>
  {:else}
    <div class="rounded-md border">
      <Tooltip.Provider delayDuration={200}>
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b text-left text-muted-foreground">
              <th class="py-2 px-3">Customer</th>
              <th class="py-2 px-3">
                <Tooltip.Root>
                  <Tooltip.Trigger asChild let:builder>
                    <span use:builder.action {...builder} class="cursor-help border-b border-dotted border-muted-foreground">Status</span>
                  </Tooltip.Trigger>
                  <Tooltip.Content>The current collection phase of the invoice</Tooltip.Content>
                </Tooltip.Root>
              </th>
              <th class="py-2 px-3 text-right">Amount</th>
              <th class="py-2 px-3 text-right">Date</th>
              <th class="w-[80px]"></th>
            </tr>
          </thead>
          <tbody>
            {#each filteredData as invoice (invoice.id)}
              <tr class="group border-b hover:bg-muted/50">
                <td class="py-2 px-3 font-medium">{invoice.customer}</td>
                <td class="py-2 px-3">
                  <Badge class={statusConfig[invoice.status].className}>
                    {invoice.status.toUpperCase()}
                  </Badge>
                </td>
                <td class="py-2 px-3 text-right font-mono tabular-nums">
                  ${invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td class="py-2 px-3 text-right text-muted-foreground">
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild let:builder>
                      <time use:builder.action {...builder} class="cursor-help">{formatRelativeTime(invoice.date)}</time>
                    </Tooltip.Trigger>
                    <Tooltip.Content>{new Date(invoice.date).toLocaleString()}</Tooltip.Content>
                  </Tooltip.Root>
                </td>
                <td class="py-2 px-3">
                  <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild let:builder>
                        <Button builders={[builder]} variant="ghost" size="icon" class="h-8 w-8">
                          <Archive class="h-4 w-4" />
                          <span class="sr-only">Archive</span>
                        </Button>
                      </Tooltip.Trigger>
                      <Tooltip.Content>Archive invoice records</Tooltip.Content>
                    </Tooltip.Root>

                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild let:builder>
                        <Button builders={[builder]} variant="ghost" size="icon" class="h-8 w-8">
                          <MoreHorizontal class="h-4 w-4" />
                          <span class="sr-only">Actions</span>
                        </Button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content align="end">
                        <DropdownMenu.Item>Download PDF</DropdownMenu.Item>
                        <DropdownMenu.Item>Send Reminder</DropdownMenu.Item>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item 
                          class="text-destructive focus:bg-destructive/15 focus:text-destructive cursor-pointer"
                          onclick={() => {
                            onDelete(invoice.id)
                            toast.success("Invoice deleted", {
                              action: {
                                label: "Undo",
                                onClick: () => {}
                              },
                              duration: 5000
                            })
                          }}
                        >
                          Delete
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </Tooltip.Provider>
    </div>
  {/if}
</div>
```

```