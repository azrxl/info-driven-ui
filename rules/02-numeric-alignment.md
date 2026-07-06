---
rule: "02-numeric-alignment"
severity: major
applies-to: [all-stacks]
refs: [references/data-semantics.md]
---

# Rule 02: Numeric Columns Are Right-Aligned

Numbers must right-align in columns so digit positions (ones, tens, hundreds) align
vertically across rows. Left-aligned numbers force the eye to find the start of each value.

## ❌ Incorrect

```tsx
{/* Numbers left-aligned like text — digit positions don't line up */}
<td className="py-2 px-3">{row.revenue.toLocaleString()}</td>
<td className="py-2 px-3">{row.count}</td>
```

```
Revenue       Count
$1,200        42
$850          187
$12,400       5
```

## ✅ Correct

```tsx
{/* Right-aligned + tabular-nums for instant positional comparison */}
<td className="py-2 px-3 text-right font-mono tabular-nums">
  ${row.revenue.toLocaleString()}
</td>
<td className="py-2 px-3 text-right tabular-nums">
  {row.count.toLocaleString()}
</td>
```

```
    Revenue     Count
     $1,200        42
       $850       187
    $12,400         5
```

## Why

Right alignment makes digit positions (ones, tens, hundreds, thousands) stack vertically.
The user compares magnitudes by visual position instead of reading each number. This is
the difference between scanning a column in 200ms vs reading each cell individually.

`tabular-nums` (CSS `font-variant-numeric: tabular-nums`) ensures each digit has equal
width, preventing misalignment caused by proportional fonts.

→ `references/data-semantics.md` §2
