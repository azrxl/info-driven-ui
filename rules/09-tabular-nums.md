---
rule: "09-tabular-nums"
severity: minor
applies-to: [all-stacks]
refs: [references/data-semantics.md]
---

# Rule 09: Numeric Values Use Tabular Numerals

All numeric values displayed in columns, KPI cards, or anywhere numbers are compared
must use `font-variant-numeric: tabular-nums` to ensure equal-width digits. Without
this, proportional fonts cause visual misalignment even when text is right-aligned.

## ❌ Incorrect

```tsx
{/* Proportional numerals — digit widths vary, causing visual jitter in columns */}
<td className="text-right">{row.amount.toLocaleString()}</td>

{/* KPI card without tabular-nums — numbers shift position when they update */}
<div className="text-3xl font-bold">${revenue.toLocaleString()}</div>
```

```css
/* No font-variant-numeric set — browser uses proportional figures by default */
.amount-cell {
  text-align: right;
}
```

## ✅ Correct

```tsx
{/* tabular-nums ensures each digit occupies equal width */}
<td className="text-right font-mono tabular-nums">
  ${row.amount.toLocaleString()}
</td>

{/* KPI card — numbers won't shift position when value changes */}
<div className="text-3xl font-bold tabular-nums">
  ${revenue.toLocaleString()}
</div>
```

```css
/* Explicit tabular-nums in CSS */
.amount-cell {
  text-align: right;
  font-variant-numeric: tabular-nums;
}
```

## Why

Proportional numerals render `1` narrower than `0`, causing numbers to misalign even
in right-aligned columns. `tabular-nums` gives every digit the same width, making
columns truly scannable. This matters especially for financial data, quantities, and
any metric that updates in real time (the number won't "jump" when digits change).

→ `references/data-semantics.md` §2 "Quantity / Numeric"
