# `scripts/` — Deterministic Audit Checks

## `audit_linter.py`

A Python 3.10+ linter with **zero external dependencies** that detects info-driven-ui
anti-patterns using regex analysis on frontend source files.

### Quick Start

```bash
# Scan a directory
python scripts/audit_linter.py ./src

# JSON output (structured for LLM consumption)
python scripts/audit_linter.py ./src --json

# Filter by file type
python scripts/audit_linter.py ./src --include "*.tsx"

# Run against built-in bad-code demo fixtures
python scripts/audit_linter.py --demo
```

### Checks

| ID | Severity | Detects | Rule |
|---|---|---|---|
| `CLR001` | Critical | Hardcoded color classes not in a semantic mapping | `rules/01-semantic-color.md` |
| `ALN001` | Major | Numeric table cells without `text-right` / `tabular-nums` | `rules/02-numeric-alignment.md` |
| `TTP001` | Major | Icon-only buttons without `aria-label` or `<Tooltip>` | `rules/03-tooltip-coverage.md` |
| `DEL001` | Critical | Delete/Remove buttons permanently visible (not hover-gated) | `rules/04-destructive-actions.md` |
| `TBL001` | Major | Tables with >6 `<th>` columns, no column picker | `rules/05-table-as-last-resort.md` |
| `SKL001` | Major | Data fetching without loading/skeleton state | `rules/07-skeleton-not-spinner.md` |
| `EMP001` | Major | Collection rendering without empty state | `rules/08-empty-state-required.md` |
| `CHR001` | Major | Event/log table with Date + Event columns (should be timeline) | `rules/10-chronological-timeline.md` |

### How It Works with audit-refactor

The linter runs **before** the LLM audit as STEP 0:

1. The LLM executes `audit_linter.py <path> --json` on the user's codebase
2. The linter returns deterministic findings (no judgment, just pattern matches)
3. The LLM interprets findings in context, filtering false positives and adding
   domain-specific recommendations
4. The LLM then proceeds with STEP 1–6 of the audit framework, using the linter
   findings as a factual starting point

This hybrid approach combines deterministic detection (high recall) with LLM
interpretation (high precision).

### Output Formats

**Human report** (default):
```
# Audit Linter Report
Path: ./src
Total findings: 5

## 🔴 CRITICAL (2)
- **[CLR001]** `UserRow.tsx:6` — Hardcoded color class `text-red-500` used directly...
  → Rule: `rules/01-semantic-color.md`

## 🟠 MAJOR (3)
- **[EMP001]** `TaskList.tsx:9` — Collection rendering detected but no empty state...
```

**JSON** (`--json`):
```json
{
  "total": 5,
  "by_severity": { "critical": 2, "major": 3, "minor": 0 },
  "findings": [
    {
      "check_id": "CLR001",
      "severity": "critical",
      "rule_ref": "rules/01-semantic-color.md",
      "file": "src/UserRow.tsx",
      "line": 6,
      "code_snippet": "<td className=\"text-red-500 font-bold\">...",
      "message": "Hardcoded color class..."
    }
  ]
}
```

### Exit Codes

- `0` — No critical findings (major/minor may exist)
- `1` — At least one critical finding

### Limitations

This linter uses regex heuristics, not AST parsing. It may produce:
- **False positives** in complex template expressions or multi-line JSX
- **False negatives** when patterns are abstracted behind utility functions

The LLM should interpret findings in context and discard false positives
during the audit report generation (STEP 5).
