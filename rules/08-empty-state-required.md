---
rule: "08-empty-state-required"
severity: major
applies-to: [all-stacks]
refs: [references/invisible-ui.md]
---

# Rule 08: Every List/Table Must Have a Designed Empty State

Every component that renders a collection (table, list, card grid, feed) must include
a purposeful empty state with three elements: illustration/icon, explanation, and a
primary CTA that resolves the empty condition.

**Three distinct empty states:**
1. **Truly empty** — nothing exists yet → encouraging, action-forward
2. **No results** — filters returned nothing → helpful, offer filter reset
3. **No access** — permission denied → explain why, offer escalation

## ❌ Incorrect

```tsx
{/* No empty state — renders an empty table shell */}
<table>
  <thead><tr><th>Name</th><th>Status</th></tr></thead>
  <tbody>
    {items.map(item => <tr key={item.id}>...</tr>)}
  </tbody>
</table>
```

```tsx
{/* Lazy empty state — no explanation, no action */}
{items.length === 0 && <p>No data.</p>}
```

## ✅ Correct

```tsx
{items.length === 0 ? (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="rounded-full bg-muted p-4 mb-4">
      <InboxIcon className="h-8 w-8 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-1">No tasks yet</h3>
    <p className="text-sm text-muted-foreground mb-4 max-w-sm">
      Tasks you create will appear here. Track your work and collaborate with your team.
    </p>
    <Button onClick={onCreateFirst}>
      <PlusIcon className="h-4 w-4 mr-2" />
      Create your first task
    </Button>
  </div>
) : (
  <DataTable data={items} />
)}

{/* Separate no-results state for filtered views */}
{items.length === 0 && hasActiveFilters && (
  <div className="text-center py-12">
    <SearchIcon className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
    <h3 className="text-lg font-semibold mb-1">No results found</h3>
    <p className="text-sm text-muted-foreground mb-4">
      Try adjusting your filters or search terms.
    </p>
    <Button variant="outline" onClick={clearFilters}>Clear all filters</Button>
  </div>
)}
```

## Why

An empty state is not an error — it is the user's first impression of a feature.
A blank table or a bare "No data" message communicates abandonment. A designed empty
state guides the user toward their first action and builds trust.

→ `references/invisible-ui.md` "Empty States"
