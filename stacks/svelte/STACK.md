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