---
rule: "07-skeleton-not-spinner"
severity: minor
applies-to: [all-stacks]
refs: [references/invisible-ui.md]
---

# Rule 07: Skeleton Screens for Content — Spinners for Actions

Content with a predictable layout (tables, cards, feeds) must use skeleton screens
that mirror the loaded layout. Spinners are only for single-action feedback
(button submit, file upload) where the result shape is unknown.

## ❌ Incorrect

```tsx
{/* Full-page spinner for a table that has a known layout */}
{isLoading ? (
  <div className="flex justify-center py-20">
    <Spinner className="h-8 w-8 animate-spin" />
  </div>
) : (
  <DataTable data={data} />
)}
```

```tsx
{/* Generic "Loading..." text — communicates nothing about what's coming */}
{isLoading && <p className="text-center py-10">Loading...</p>}
```

## ✅ Correct

```tsx
{/* Skeleton mirrors the exact table layout — user sees the shape of what's coming */}
{isLoading ? (
  <table className="w-full">
    <thead>
      <tr className="border-b">
        <th className="py-2 px-3"><Skeleton className="h-4 w-16" /></th>
        <th className="py-2 px-3"><Skeleton className="h-4 w-12" /></th>
        <th className="py-2 px-3"><Skeleton className="h-4 w-20" /></th>
      </tr>
    </thead>
    <tbody>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="border-b">
          <td className="py-2 px-3"><Skeleton className="h-4 w-32" /></td>
          <td className="py-2 px-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
          <td className="py-2 px-3"><Skeleton className="h-4 w-20 ml-auto" /></td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <DataTable data={data} />
)}
```

```tsx
{/* Spinner is correct here — button action with unknown result shape */}
<button disabled={isPending} onClick={handleSubmit}>
  {isPending ? <Spinner className="h-4 w-4 animate-spin" /> : "Submit"}
</button>
```

## Why

Skeleton screens feel faster because the user understands the shape of what's coming.
They eliminate layout shift when data loads. A full-page spinner communicates nothing
about the content structure and creates a jarring transition when data appears.

→ `references/invisible-ui.md` "Skeleton screens"
