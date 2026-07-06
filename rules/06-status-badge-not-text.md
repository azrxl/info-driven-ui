---
rule: "06-status-badge-not-text"
severity: major
applies-to: [all-stacks]
refs: [references/data-semantics.md]
---

# Rule 06: Status Fields Use Badges — Never Plain Text

State/status fields from a fixed set (Active, Pending, Overdue, etc.) must always
be represented as color-coded badge/chip components. Plain text status in a dense
data context forces the user to read every cell instead of scanning visually.

## ❌ Incorrect

```tsx
{/* Status as plain text — invisible in a 200-row table */}
<td>{row.status}</td>
<td className="text-sm">{row.priority}</td>
```

```
Name          Status      Priority
John Doe      Active      High
Jane Smith    Pending     Low
Bob Wilson    Overdue     Critical
```

## ✅ Correct

```tsx
const statusVariant: Record<Status, string> = {
  active:  "bg-green-100 text-green-800 border-green-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  overdue: "bg-red-100 text-red-800 border-red-200",
};

<td>
  <Badge className={statusVariant[row.status]}>{row.status}</Badge>
</td>

<td>
  <Badge variant={priorityToVariant(row.priority)}>{row.priority}</Badge>
</td>
```

## Why

Status is a preattentive visual signal — the eye can spot "the red badge" in a column
of green badges without reading any text. Plain text makes every status equal to the eye;
badges create a visual hierarchy where critical states pop out instantly.

**Limit:** ≤ 5-6 distinct status colors per view. More than that and the encoding
breaks down — the user cannot remember the mapping.

→ `references/data-semantics.md` §1 "State / Status"
