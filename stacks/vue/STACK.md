---
stack: vue
description: >
  Component guidance for Vue 3 + Tailwind CSS, using Reka UI (formerly radix-vue)
  for accessible headless primitives and TanStack Table for data tables.
  Load this file when the user's stack is confirmed as Vue.
---

# Stack: Vue 3 + Tailwind + Reka UI

> Reka UI provides accessible headless primitives (tooltip, dropdown, dialog) for Vue,
> equivalent to Radix for React. Style with Tailwind. Use @tanstack/vue-table for
> data-heavy tables with sorting/filtering.

## Status / State → Badge (custom component)

```vue
<!-- Badge.vue -->
<script setup lang="ts">
type BadgeVariant = "success" | "warning" | "critical" | "neutral" | "info"
const props = defineProps<{ variant: BadgeVariant }>()

const variantStyles: Record<BadgeVariant, string> = {
  success:  "bg-green-100 text-green-800 border-green-200",
  warning:  "bg-amber-100 text-amber-800 border-amber-200",
  critical: "bg-red-100 text-red-800 border-red-200",
  neutral:  "bg-gray-100 text-gray-700 border-gray-200",
  info:     "bg-blue-100 text-blue-800 border-blue-200",
}
</script>

<template>
  <span :class="['inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium', variantStyles[variant]]">
    <slot />
  </span>
</template>

<!-- Usage -->
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
```

## Data Tables → @tanstack/vue-table

```vue
<script setup lang="ts">
import { useVueTable, getCoreRowModel, createColumnHelper } from '@tanstack/vue-table'

const columnHelper = createColumnHelper<Employee>()
const columns = [
  columnHelper.accessor('name', { header: 'Name' }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => h(Badge, { variant: statusToVariant(info.getValue()) }, () => info.getValue()),
  }),
  columnHelper.accessor('amount', {
    header: () => h('div', { class: 'text-right' }, 'Amount'),
    cell: (info) => h('div', { class: 'text-right font-mono tabular-nums' }, `$${info.getValue().toLocaleString()}`),
  }),
]
</script>
```

## Tooltips → Reka UI Tooltip

```vue
<script setup lang="ts">
import { TooltipRoot, TooltipTrigger, TooltipContent, TooltipProvider, TooltipPortal } from 'reka-ui'
</script>

<template>
  <TooltipProvider :delay-duration="200">
    <TooltipRoot>
      <TooltipTrigger as-child>
        <button aria-label="Archive" class="p-2 rounded hover:bg-muted">
          <ArchiveIcon class="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent class="rounded bg-gray-900 text-white text-xs px-2 py-1 shadow-md" :side-offset="5">
          Archive this item
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
```

## Empty States

```vue
<template>
  <div class="flex flex-col items-center justify-center py-16 text-center">
    <div class="rounded-full bg-muted p-4 mb-4">
      <InboxIcon class="h-8 w-8 text-muted-foreground" />
    </div>
    <h3 class="text-lg font-semibold mb-1">{{ title }}</h3>
    <p class="text-sm text-muted-foreground mb-4 max-w-sm">{{ description }}</p>
    <button v-if="actionLabel" @click="$emit('action')" class="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
      <PlusIcon class="h-4 w-4 mr-2" />
      {{ actionLabel }}
    </button>
  </div>
</template>
```

## Skeleton Loading

```vue
<template>
  <div class="animate-pulse rounded bg-muted" :class="className" />
</template>

<!-- Table skeleton -->
<tr v-for="i in 5" :key="i" class="border-b">
  <td class="py-2 px-3"><Skeleton class="h-4 w-32" /></td>
  <td class="py-2 px-3"><Skeleton class="h-5 w-16 rounded-full" /></td>
  <td class="py-2 px-3"><Skeleton class="h-4 w-20 ml-auto" /></td>
</tr>
```

## Row Hover Actions

```vue
<template>
  <tr class="group border-b hover:bg-muted/50">
    <td class="py-2 px-3">{{ row.name }}</td>
    <td class="py-2 px-3">
      <div class="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button class="p-1.5 rounded hover:bg-muted"><PencilIcon class="h-4 w-4" /></button>
        <button class="p-1.5 rounded hover:bg-muted"><MoreHorizontalIcon class="h-4 w-4" /></button>
      </div>
    </td>
  </tr>
</template>
```

## KPI Cards

```vue
<template>
  <div class="rounded-lg border p-4">
    <p class="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
    <p class="text-2xl font-bold tabular-nums mt-1">$48,295</p>
    <p class="text-xs text-muted-foreground mt-1">
      <span class="text-green-600">↑ +12.5%</span> vs last month
    </p>
  </div>
</template>
```

## Toast Feedback → vue-sonner

```vue
<script setup lang="ts">
import { toast } from 'vue-sonner'

function archiveItem() {
  toast.success('Issue archived')
}

function deleteItem(id: string) {
  toast('Issue deleted', {
    action: { label: 'Undo', onClick: () => restoreIssue(id) },
    duration: 6000,
  })
}

function saveError() {
  toast.error('Failed to save changes', {
    action: { label: 'Retry', onClick: saveChanges },
  })
}
</script>
```

## Complete Reference Component: Vue 3 + Reka UI + Tailwind Table

A complete implementation in Vue 3 using Reka UI (radix-vue) headless primitives.

```vue
<!-- InvoiceTable.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  TooltipProvider, TooltipRoot, TooltipTrigger, TooltipPortal, TooltipContent, TooltipArrow 
} from 'reka-ui'
import { 
  DropdownMenuRoot, DropdownMenuTrigger, DropdownMenuPortal, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator 
} from 'reka-ui'
import { toast } from 'vue-sonner'
import { 
  Archive, MoreHorizontal, AlertCircle, Inbox, Search, RefreshCw 
} from 'lucide-vue-next'

export interface Invoice {
  id: string
  customer: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
  date: string // ISO string
}

const props = defineProps<{
  isLoading: boolean
  error: Error | null
  data: Invoice[] | null
}>()

const emit = defineEmits<{
  (e: 'retry'): void
  (e: 'delete', id: string): void
}>()

const filterQuery = ref('')

const filteredData = computed(() => {
  if (!props.data) return []
  return props.data.filter(inv => 
    inv.customer.toLowerCase().includes(filterQuery.value.toLowerCase())
  )
})

const statusVariantStyles = {
  paid: 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400 border-green-200 dark:border-green-900/50',
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-900/50',
  overdue: 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400 border-red-200 dark:border-red-900/50'
} as const

const formatRelativeTime = (isoString: string) => {
  const date = new Date(isoString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays === 1) return 'Today'
  if (diffDays === 2) return 'Yesterday'
  return `${diffDays} days ago`
}

const handleDelete = (id: string) => {
  emit('delete', id)
  toast.success('Invoice deleted', {
    action: {
      label: 'Undo',
      onClick: () => {
        // Undo logic
      }
    },
    duration: 5000
  })
}
</script>

<template>
  <div class="space-y-4">
    <!-- Search Input -->
    <div class="relative max-w-sm">
      <Search class="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
      <input
        v-model="filterQuery"
        placeholder="Filter by customer..."
        class="pl-9 h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-black"
      />
    </div>

    <!-- 1. Loading State -->
    <div v-if="isLoading" class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-sm">
        <thead class="bg-gray-50 dark:bg-gray-900/50">
          <tr>
            <th class="px-4 py-3 text-left font-medium text-gray-500">Customer</th>
            <th class="px-4 py-3 text-left font-medium text-gray-500">Status</th>
            <th class="px-4 py-3 text-right font-medium text-gray-500">Amount</th>
            <th class="px-4 py-3 text-right font-medium text-gray-500">Date</th>
            <th class="px-4 py-3 w-[80px]"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
          <tr v-for="i in 5" :key="i">
            <td class="px-4 py-3"><div class="animate-pulse rounded bg-gray-200 dark:bg-gray-800 h-4 w-32" /></td>
            <td class="px-4 py-3"><div class="animate-pulse rounded bg-gray-200 dark:bg-gray-800 h-5 w-16 rounded-full" /></td>
            <td class="px-4 py-3 text-right"><div class="animate-pulse rounded bg-gray-200 dark:bg-gray-800 h-4 w-20 ml-auto" /></td>
            <td class="px-4 py-3 text-right"><div class="animate-pulse rounded bg-gray-200 dark:bg-gray-800 h-4 w-24 ml-auto" /></td>
            <td class="px-4 py-3"><div class="animate-pulse rounded bg-gray-200 dark:bg-gray-800 h-8 w-8 rounded-md" /></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 2. Error State -->
    <div v-else-if="error" class="flex flex-col items-center justify-center rounded-lg border border-red-100 bg-red-50/50 p-8 text-center">
      <AlertCircle class="h-8 w-8 text-red-600 mb-3" />
      <h3 class="font-semibold text-red-950">Failed to load invoices</h3>
      <p class="text-sm text-red-700 mt-1 mb-4">{{ error.message || 'A network error occurred.' }}</p>
      <button 
        @click="emit('retry')"
        class="inline-flex items-center justify-center rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 focus:outline-none"
      >
        <RefreshCw class="h-4 w-4 mr-2" /> Retry Load
      </button>
    </div>

    <!-- 3. Empty State -->
    <div v-else-if="!data || data.length === 0" class="flex flex-col items-center justify-center py-16 text-center border rounded-lg dark:border-gray-800">
      <div class="rounded-full bg-gray-100 dark:bg-gray-800 p-4 mb-4">
        <Inbox class="h-8 w-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-semibold mb-1">No invoices found</h3>
      <p class="text-sm text-gray-500 mb-4 max-w-sm">
        Generate your first invoice to bill clients and receive payments.
      </p>
      <button class="inline-flex items-center justify-center rounded-md bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-sm font-medium">
        Create Invoice
      </button>
    </div>

    <!-- 4. No-Results Empty State -->
    <div v-else-if="filteredData.length === 0" class="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-lg dark:border-gray-800">
      <Search class="h-8 w-8 text-gray-400 mb-3" />
      <h3 class="font-semibold mb-1">No matching invoices</h3>
      <p class="text-sm text-gray-500 mb-4">
        No customer matches "{{ filterQuery }}". Try adjusting your search query.
      </p>
      <button 
        @click="filterQuery = ''"
        class="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
      >
        Clear Filter
      </button>
    </div>

    <!-- Table content -->
    <div v-else class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
      <TooltipProvider :delay-duration="200">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-sm">
          <thead class="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th class="px-4 py-3 text-left font-medium text-gray-500">Customer</th>
              <th class="px-4 py-3 text-left font-medium text-gray-500">
                <TooltipRoot>
                  <TooltipTrigger as-child>
                    <span class="cursor-help border-b border-dotted border-gray-400">Status</span>
                  </TooltipTrigger>
                  <TooltipPortal>
                    <TooltipContent class="rounded bg-black text-white text-xs px-2 py-1 shadow-md max-w-xs" :side-offset="5">
                      The current collection phase of the invoice
                      <TooltipArrow class="fill-black" />
                    </TooltipContent>
                  </TooltipPortal>
                </TooltipRoot>
              </th>
              <th class="px-4 py-3 text-right font-medium text-gray-500">Amount</th>
              <th class="px-4 py-3 text-right font-medium text-gray-500">Date</th>
              <th class="px-4 py-3 w-[80px]"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-black">
            <tr v-for="invoice in filteredData" :key="invoice.id" class="group hover:bg-gray-50/50 dark:hover:bg-gray-950/20">
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{{ invoice.customer }}</td>
              <td class="px-4 py-3">
                <span :class="['inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium', statusVariantStyles[invoice.status]]">
                  {{ invoice.status.toUpperCase() }}
                </span>
              </td>
              <td class="px-4 py-3 text-right font-mono tabular-nums text-gray-900 dark:text-gray-100">
                ${{ invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              </td>
              <td class="px-4 py-3 text-right text-gray-500">
                <TooltipRoot>
                  <TooltipTrigger as-child>
                    <time class="cursor-help">{{ formatRelativeTime(invoice.date) }}</time>
                  </TooltipTrigger>
                  <TooltipPortal>
                    <TooltipContent class="rounded bg-black text-white text-xs px-2 py-1 shadow-md" :side-offset="5">
                      {{ new Date(invoice.date).toLocaleString() }}
                      <TooltipArrow class="fill-black" />
                    </TooltipContent>
                  </TooltipPortal>
                </TooltipRoot>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <TooltipRoot>
                    <TooltipTrigger as-child>
                      <button class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                        <Archive class="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipPortal>
                      <TooltipContent class="rounded bg-black text-white text-xs px-2 py-1 shadow-md" :side-offset="5">
                        Archive invoice records
                        <TooltipArrow class="fill-black" />
                      </TooltipContent>
                    </TooltipPortal>
                  </TooltipRoot>
                  
                  <DropdownMenuRoot>
                    <DropdownMenuTrigger as-child>
                      <button class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                        <MoreHorizontal class="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuContent 
                        class="min-w-[140px] rounded-md bg-white dark:bg-gray-900 p-1 shadow-lg border border-gray-200 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300"
                        :side-offset="5"
                        align="end"
                      >
                        <DropdownMenuItem class="px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer outline-none">
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem class="px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer outline-none">
                          Send Reminder
                        </DropdownMenuItem>
                        <DropdownMenuSeparator class="h-px bg-gray-200 dark:bg-gray-800 my-1" />
                        <DropdownMenuItem 
                          class="px-2 py-1.5 rounded text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer outline-none"
                          @click="handleDelete(invoice.id)"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenuPortal>
                  </DropdownMenuRoot>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </TooltipProvider>
    </div>
  </div>
</template>
```

```