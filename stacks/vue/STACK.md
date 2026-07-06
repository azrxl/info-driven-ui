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