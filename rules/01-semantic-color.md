---
rule: "01-semantic-color"
severity: critical
applies-to: [all-stacks]
refs: [references/data-semantics.md, references/component-engine.md]
---

# Rule 01: Color Is Semantic — Never Decorative

Color must emerge from data meaning. If a color does not encode information, it encodes nothing.

## ❌ Incorrect

```tsx
{/* Colors assigned by arbitrary rotation for "visual variety" */}
const tagColors = ["blue", "purple", "pink", "orange", "teal", "cyan"];

{categories.map((cat, i) => (
  <Badge className={`bg-${tagColors[i % tagColors.length]}-100`}>
    {cat.name}
  </Badge>
))}
```

```tsx
{/* Red used for decoration, not for a critical/error state */}
<div className="border-l-4 border-red-500 p-4">
  <h3>Welcome back!</h3>
  <p>You have 3 new messages</p>
</div>
```

## ✅ Correct

```tsx
{/* Color derives from the status meaning */}
const statusColor: Record<Status, string> = {
  active:   "bg-green-100 text-green-800",  // healthy
  pending:  "bg-amber-100 text-amber-800",  // needs attention
  critical: "bg-red-100 text-red-800",      // requires action
  archived: "bg-gray-100 text-gray-600",    // inactive
};

<Badge className={statusColor[item.status]}>{item.status}</Badge>
```

```tsx
{/* Categories use consistent, deliberate mapping — same category = same color everywhere */}
const categoryColor: Record<Category, string> = {
  engineering: "bg-indigo-100 text-indigo-800",
  design:      "bg-violet-100 text-violet-800",
  marketing:   "bg-sky-100 text-sky-800",
};

<Badge className={categoryColor[item.category]}>{item.category}</Badge>
```

## Why

Color is a preattentive visual variable — the eye processes it before conscious reading.
When color encodes meaning, the user scans a 200-row table in seconds. When color is
decorative, the user's visual system wastes effort looking for a pattern that isn't there.

**Hard constraint:** Red is reserved for critical/error/destructive states. Green is
reserved for healthy/success/complete. Amber/yellow for warnings. Violating this
creates false signals in any data-dense interface.

→ `references/data-semantics.md` §1, `references/component-engine.md` "Anti-Patterns"
