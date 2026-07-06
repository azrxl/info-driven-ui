#!/usr/bin/env python3
"""
audit_linter.py — Deterministic anti-pattern detector for info-driven-ui.

Scans frontend source files in a directory and detects violations of the
10 atomic rules defined in rules/. Returns structured findings that the
LLM can interpret in context.

Usage:
    python audit_linter.py <path>                  # human-readable report
    python audit_linter.py <path> --json           # JSON output for LLM
    python audit_linter.py <path> --include "*.tsx" # filter by glob
    python audit_linter.py --demo                  # run against built-in fixtures

Zero external dependencies — stdlib only.
"""

import argparse
import json
import os
import re
import sys
from dataclasses import dataclass, asdict
from fnmatch import fnmatch
from pathlib import Path
from typing import Optional


# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------

@dataclass
class Finding:
    check_id: str
    severity: str          # critical | major | minor
    rule_ref: str          # e.g. "rules/01-semantic-color.md"
    file: str
    line: int
    code_snippet: str
    message: str


# ---------------------------------------------------------------------------
# File discovery
# ---------------------------------------------------------------------------

FRONTEND_EXTENSIONS = {
    ".tsx", ".jsx", ".vue", ".svelte", ".ts", ".js",
    ".html", ".astro", ".mdx",
}


def discover_files(root: str, include_glob: Optional[str] = None) -> list[str]:
    """Walk a directory and return frontend source files."""
    files = []
    root_path = Path(root)

    if root_path.is_file():
        return [str(root_path)]

    for dirpath, dirnames, filenames in os.walk(root_path):
        # Skip common non-source directories
        dirnames[:] = [
            d for d in dirnames
            if d not in {"node_modules", ".git", "dist", "build", ".next", ".nuxt", ".svelte-kit", "__pycache__"}
        ]
        for fname in filenames:
            fpath = os.path.join(dirpath, fname)
            ext = os.path.splitext(fname)[1].lower()

            if include_glob and not fnmatch(fname, include_glob):
                continue
            if ext not in FRONTEND_EXTENSIONS:
                continue

            files.append(fpath)

    return sorted(files)


# ---------------------------------------------------------------------------
# Check implementations — all regex-based, zero LLM judgment
# ---------------------------------------------------------------------------

def check_clr001(filepath: str, lines: list[str]) -> list[Finding]:
    """CLR001: Non-semantic hardcoded color classes.

    Detects color utility classes (text-red-*, bg-green-*, border-amber-*, etc.)
    used outside of a semantic mapping object/variable.
    """
    findings = []
    # Pattern: color utilities that are likely decorative
    # We flag any direct use in JSX/template attributes, NOT inside a mapping object
    color_pattern = re.compile(
        r'''(?:class(?:Name)?=["'{`][^"'{`]*)'''
        r'''((?:text|bg|border)-(?:red|green|amber|yellow|orange|blue|purple|pink|emerald|teal|cyan|rose|lime|fuchsia)-\d{2,3})'''
    )
    # Context: if the line is inside a Record/object/map definition, it's likely semantic — skip
    object_context = re.compile(r"""(?:Record|Map|const\s+\w*[Cc]olor|const\s+\w*[Vv]ariant|:\s*{)""")

    for i, line in enumerate(lines, 1):
        matches = color_pattern.findall(line)
        if matches and not object_context.search(line):
            for match in matches:
                findings.append(Finding(
                    check_id="CLR001",
                    severity="critical",
                    rule_ref="rules/01-semantic-color.md",
                    file=filepath,
                    line=i,
                    code_snippet=line.strip()[:120],
                    message=f"Hardcoded color class `{match}` used directly — should derive from a semantic mapping (status, category, severity)."
                ))
    return findings


def check_aln001(filepath: str, lines: list[str]) -> list[Finding]:
    """ALN001: Numeric columns without right-alignment + tabular-nums."""
    findings = []
    content = "\n".join(lines)

    # Find table cells that format/display numbers but lack text-right or tabular-nums
    # Heuristic: <td> containing .toLocaleString(), .toFixed(), currency symbols, or numeric formatting
    numeric_cell = re.compile(
        r"""<td[^>]*?(?:class(?:Name)?=["'][^"']*["'])?[^>]*>"""
        r"""[^<]*?(?:\.toLocaleString|\.toFixed|formatCurrency|formatNumber|\$\{?\w+\.(?:amount|price|revenue|total|count|quantity|cost|balance|salary|rate|score))"""
    )
    right_align = re.compile(r"""text-right|text-end|text-align:\s*right""")
    tabular = re.compile(r"""tabular-nums|font-variant-numeric""")

    for i, line in enumerate(lines, 1):
        if numeric_cell.search(line):
            # Check this line and the surrounding 2 lines for alignment classes
            context = "\n".join(lines[max(0, i-3):i+2])
            if not right_align.search(context):
                findings.append(Finding(
                    check_id="ALN001",
                    severity="major",
                    rule_ref="rules/02-numeric-alignment.md",
                    file=filepath,
                    line=i,
                    code_snippet=line.strip()[:120],
                    message="Numeric value in table cell without `text-right` alignment."
                ))
            if not tabular.search(context):
                findings.append(Finding(
                    check_id="ALN001",
                    severity="minor",
                    rule_ref="rules/09-tabular-nums.md",
                    file=filepath,
                    line=i,
                    code_snippet=line.strip()[:120],
                    message="Numeric value without `tabular-nums` — digits may misalign in proportional fonts."
                ))
    return findings


def check_ttp001(filepath: str, lines: list[str]) -> list[Finding]:
    """TTP001: Icon-only buttons without aria-label or Tooltip wrapper."""
    findings = []
    content = "\n".join(lines)

    # Find <button> elements that contain only an Icon component (no visible text)
    # Pattern: <button ...> followed by only <SomeIcon /> and </button> with no text content
    icon_button = re.compile(
        r"""<button[^>]*>([\s\S]*?)</button>""",
        re.MULTILINE
    )
    has_icon = re.compile(r"""<\w*Icon|<Icon\s""")
    has_text = re.compile(r""">[A-Za-z][^<]+<""")
    has_aria = re.compile(r"""aria-label""")
    has_tooltip = re.compile(r"""Tooltip""")
    has_title = re.compile(r"""title=["']""")

    for match in icon_button.finditer(content):
        inner = match.group(1)
        full = match.group(0)
        if has_icon.search(inner) and not has_text.search(inner):
            if not has_aria.search(full) and not has_title.search(full):
                # Check if wrapped in a Tooltip (look back ~3 lines)
                start_pos = match.start()
                preceding = content[max(0, start_pos - 200):start_pos]
                if not has_tooltip.search(preceding):
                    line_num = content[:start_pos].count('\n') + 1
                    findings.append(Finding(
                        check_id="TTP001",
                        severity="major",
                        rule_ref="rules/03-tooltip-coverage.md",
                        file=filepath,
                        line=line_num,
                        code_snippet=full.strip()[:120],
                        message="Icon-only button without `aria-label` or `<Tooltip>` wrapper — users cannot identify the action."
                    ))
    return findings


def check_del001(filepath: str, lines: list[str]) -> list[Finding]:
    """DEL001: Destructive action buttons permanently visible (not inside group-hover)."""
    findings = []

    delete_button = re.compile(
        r"""<(?:button|Button)[^>]*>[\s]*(?:Delete|Remove|Revoke|Ban|Eliminar|Borrar|Destroy)""",
        re.IGNORECASE
    )
    hover_guard = re.compile(r"""group-hover|opacity-0|hidden\s+group-hover:block|v-show.*hover|:class.*hover""")

    for i, line in enumerate(lines, 1):
        if delete_button.search(line):
            # Check surrounding context (5 lines up) for hover guard
            context = "\n".join(lines[max(0, i-6):i])
            if not hover_guard.search(context):
                findings.append(Finding(
                    check_id="DEL001",
                    severity="critical",
                    rule_ref="rules/04-destructive-actions.md",
                    file=filepath,
                    line=i,
                    code_snippet=line.strip()[:120],
                    message="Destructive action button is permanently visible — move to hover-revealed overflow menu."
                ))
    return findings


def check_tbl001(filepath: str, lines: list[str]) -> list[Finding]:
    """TBL001: Tables with more than 6 <th> columns without a column picker."""
    findings = []
    content = "\n".join(lines)

    # Find <thead> blocks and count <th> elements inside
    thead_pattern = re.compile(r"""<thead[^>]*>([\s\S]*?)</thead>""", re.MULTILINE)
    th_pattern = re.compile(r"""<th[\s>]""")
    column_picker = re.compile(r"""column.?picker|ColumnPicker|ViewOptions|DataTableViewOptions""", re.IGNORECASE)

    for match in thead_pattern.finditer(content):
        th_count = len(th_pattern.findall(match.group(1)))
        if th_count > 6:
            # Check if there's a column picker anywhere in the file
            if not column_picker.search(content):
                line_num = content[:match.start()].count('\n') + 1
                findings.append(Finding(
                    check_id="TBL001",
                    severity="major",
                    rule_ref="rules/05-table-as-last-resort.md",
                    file=filepath,
                    line=line_num,
                    code_snippet=f"<thead> with {th_count} columns",
                    message=f"Table has {th_count} columns (> 6 recommended max) without a column picker. Consider progressive disclosure for secondary columns."
                ))
    return findings


def check_skl001(filepath: str, lines: list[str]) -> list[Finding]:
    """SKL001: Data fetching without corresponding skeleton/loading state."""
    findings = []
    content = "\n".join(lines)

    # Detect data fetching patterns
    fetch_patterns = re.compile(
        r"""(?:useSWR|useQuery|useFetch|\$fetch|fetch\(|axios\.|createResource|createQuery|onMount\s*\(\s*async|\$effect\s*\(\s*async|httpClient)""",
    )
    skeleton_patterns = re.compile(
        r"""Skeleton|skeleton|isLoading|isPending|loading|LoadingState|Shimmer|placeholder""",
        re.IGNORECASE
    )

    if fetch_patterns.search(content) and not skeleton_patterns.search(content):
        # Find the line of the first fetch
        for i, line in enumerate(lines, 1):
            if fetch_patterns.search(line):
                findings.append(Finding(
                    check_id="SKL001",
                    severity="major",
                    rule_ref="rules/07-skeleton-not-spinner.md",
                    file=filepath,
                    line=i,
                    code_snippet=line.strip()[:120],
                    message="Data fetching detected but no loading/skeleton state found in the same file."
                ))
                break
    return findings


def check_emp001(filepath: str, lines: list[str]) -> list[Finding]:
    """EMP001: List/table component without empty state handling."""
    findings = []
    content = "\n".join(lines)

    # Detect list/table rendering patterns
    collection_render = re.compile(
        r"""(?:\.map\s*\(|{#each|v-for|ngFor|\*ngFor|#each|\.forEach)"""
    )
    table_render = re.compile(r"""<(?:table|Table|DataTable)[\s>]""")
    empty_state = re.compile(
        r"""(?:\.length\s*===?\s*0|isEmpty|empty.?state|EmptyState|no.?(?:data|results|items)|NoResults|NoData)""",
        re.IGNORECASE
    )

    has_collection = collection_render.search(content) or table_render.search(content)
    has_empty = empty_state.search(content)

    if has_collection and not has_empty:
        # Find the first collection render line
        for i, line in enumerate(lines, 1):
            if collection_render.search(line) or table_render.search(line):
                findings.append(Finding(
                    check_id="EMP001",
                    severity="major",
                    rule_ref="rules/08-empty-state-required.md",
                    file=filepath,
                    line=i,
                    code_snippet=line.strip()[:120],
                    message="Collection rendering detected but no empty state handling found — add a designed empty state."
                ))
                break
    return findings


def check_chr001(filepath: str, lines: list[str]) -> list[Finding]:
    """CHR001: Event/log data rendered as a table with timestamp column."""
    findings = []
    content = "\n".join(lines)

    # Detect table rendering of chronological data
    # Heuristic: <th> with time-related labels inside a <thead>
    thead_pattern = re.compile(r"""<thead[^>]*>([\s\S]*?)</thead>""", re.MULTILINE)
    time_th = re.compile(
        r"""<th[^>]*>[^<]*(?:Date|Time|Timestamp|Created|Updated|When|Occurred|Logged)[^<]*</th>""",
        re.IGNORECASE
    )
    event_th = re.compile(
        r"""<th[^>]*>[^<]*(?:Event|Action|Activity|Log|Message|Description)[^<]*</th>""",
        re.IGNORECASE
    )

    for match in thead_pattern.finditer(content):
        thead_content = match.group(1)
        if time_th.search(thead_content) and event_th.search(thead_content):
            line_num = content[:match.start()].count('\n') + 1
            findings.append(Finding(
                check_id="CHR001",
                severity="major",
                rule_ref="rules/10-chronological-timeline.md",
                file=filepath,
                line=line_num,
                code_snippet="<thead> with Date + Event columns",
                message="Event/log data rendered as a table with timestamp column — consider a timeline or activity feed instead."
            ))
    return findings


# ---------------------------------------------------------------------------
# Check registry
# ---------------------------------------------------------------------------

ALL_CHECKS = [
    check_clr001,
    check_aln001,
    check_ttp001,
    check_del001,
    check_tbl001,
    check_skl001,
    check_emp001,
    check_chr001,
]


# ---------------------------------------------------------------------------
# Runner
# ---------------------------------------------------------------------------

def run_audit(root: str, include_glob: Optional[str] = None) -> list[Finding]:
    """Run all checks on all files under root. Returns sorted findings."""
    files = discover_files(root, include_glob)
    all_findings: list[Finding] = []

    for fpath in files:
        try:
            with open(fpath, "r", encoding="utf-8", errors="replace") as f:
                lines = f.readlines()
        except (OSError, IOError):
            continue

        lines = [l.rstrip("\n") for l in lines]

        for check_fn in ALL_CHECKS:
            try:
                findings = check_fn(fpath, lines)
                all_findings.extend(findings)
            except Exception as e:
                # Never crash on a single check — report and continue
                print(f"⚠ Check {check_fn.__name__} failed on {fpath}: {e}", file=sys.stderr)

    # Sort: critical first, then major, then minor
    severity_order = {"critical": 0, "major": 1, "minor": 2}
    all_findings.sort(key=lambda f: (severity_order.get(f.severity, 3), f.file, f.line))

    return all_findings


# ---------------------------------------------------------------------------
# Output formatters
# ---------------------------------------------------------------------------

SEVERITY_ICONS = {"critical": "🔴", "major": "🟠", "minor": "🟡"}


def format_report(findings: list[Finding], root: str) -> str:
    """Human-readable report output."""
    if not findings:
        return "✅ No findings — all checks passed."

    lines = []
    lines.append(f"# Audit Linter Report")
    lines.append(f"Path: {root}")
    lines.append(f"Total findings: {len(findings)}")
    lines.append("")

    # Group by severity
    for severity in ["critical", "major", "minor"]:
        group = [f for f in findings if f.severity == severity]
        if not group:
            continue

        icon = SEVERITY_ICONS[severity]
        lines.append(f"## {icon} {severity.upper()} ({len(group)})")
        lines.append("")

        for f in group:
            rel_path = os.path.relpath(f.file, root) if root != f.file else f.file
            lines.append(f"- **[{f.check_id}]** `{rel_path}:{f.line}` — {f.message}")
            lines.append(f"  ```")
            lines.append(f"  {f.code_snippet}")
            lines.append(f"  ```")
            lines.append(f"  → Rule: `{f.rule_ref}`")
            lines.append("")

    return "\n".join(lines)


def format_json(findings: list[Finding]) -> str:
    """JSON output for LLM consumption."""
    return json.dumps(
        {
            "total": len(findings),
            "by_severity": {
                "critical": len([f for f in findings if f.severity == "critical"]),
                "major": len([f for f in findings if f.severity == "major"]),
                "minor": len([f for f in findings if f.severity == "minor"]),
            },
            "findings": [asdict(f) for f in findings],
        },
        indent=2,
    )


# ---------------------------------------------------------------------------
# Built-in demo fixtures
# ---------------------------------------------------------------------------

DEMO_FIXTURES = {
    "demo_bad_table.tsx": """\
import React from "react";

export function EventLog({ events }) {
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>Date</th>
          <th>Event</th>
          <th>User</th>
          <th>Source</th>
          <th>Level</th>
          <th>Duration</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {events.map(e => (
          <tr key={e.id}>
            <td>{e.date}</td>
            <td>{e.description}</td>
            <td>{e.user}</td>
            <td>{e.source}</td>
            <td>{e.level}</td>
            <td>{e.duration}</td>
            <td>{e.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
""",
    "demo_bad_actions.tsx": """\
import React from "react";
import { TrashIcon, PencilIcon } from "lucide-react";

export function UserRow({ user }) {
  return (
    <tr>
      <td>{user.name}</td>
      <td className="text-red-500 font-bold">{user.role}</td>
      <td className="bg-green-200">{user.department}</td>
      <td>{user.salary}</td>
      <td>
        <button onClick={() => editUser(user.id)}>
          <PencilIcon className="h-4 w-4" />
        </button>
        <button className="text-red-600" onClick={() => deleteUser(user.id)}>
          Delete
        </button>
      </td>
    </tr>
  );
}
""",
    "demo_no_empty.tsx": """\
import React from "react";
import { useQuery } from "@tanstack/react-query";

export function TaskList() {
  const { data: tasks } = useQuery({ queryKey: ["tasks"], queryFn: fetchTasks });

  return (
    <ul>
      {tasks?.map(task => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  );
}
""",
}


def run_demo() -> list[Finding]:
    """Run checks against built-in bad-code fixtures."""
    import tempfile

    with tempfile.TemporaryDirectory(prefix="audit_lint_demo_") as tmpdir:
        for fname, content in DEMO_FIXTURES.items():
            fpath = os.path.join(tmpdir, fname)
            with open(fpath, "w") as f:
                f.write(content)

        findings = run_audit(tmpdir)

        # Rewrite file paths to fixture names for clean output
        for finding in findings:
            finding.file = os.path.basename(finding.file)

        return findings


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Deterministic anti-pattern linter for info-driven-ui skill.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    python audit_linter.py ./src                    # scan src/ directory
    python audit_linter.py ./src --json             # JSON output for LLM
    python audit_linter.py ./src --include "*.tsx"   # only .tsx files
    python audit_linter.py --demo                   # run built-in demo
        """,
    )
    parser.add_argument("path", nargs="?", help="Directory or file to scan")
    parser.add_argument("--json", action="store_true", help="Output as JSON (for LLM consumption)")
    parser.add_argument("--include", help="Glob pattern to filter files (e.g. '*.tsx')")
    parser.add_argument("--demo", action="store_true", help="Run against built-in demo fixtures")

    args = parser.parse_args()

    if args.demo:
        findings = run_demo()
        root = "(demo fixtures)"
    elif args.path:
        root = os.path.abspath(args.path)
        if not os.path.exists(root):
            print(f"Error: path '{root}' does not exist.", file=sys.stderr)
            sys.exit(1)
        findings = run_audit(root, args.include)
    else:
        parser.print_help()
        sys.exit(1)

    if args.json:
        print(format_json(findings))
    else:
        print(format_report(findings, root if not args.demo else "(demo)"))

    # Exit code: 1 if critical findings, 0 otherwise
    has_critical = any(f.severity == "critical" for f in findings)
    sys.exit(1 if has_critical else 0)


if __name__ == "__main__":
    main()
