---
rule: "04-destructive-actions"
severity: critical
applies-to: [all-stacks]
refs: [references/progressive-disclosure.md, references/invisible-ui.md]
---

# Rule 04: Destructive Actions Are Never Permanently Visible

Delete, Remove, Revoke, Ban — destructive actions must be hidden behind hover,
overflow menu, or context menu. They must never be a permanently visible button
in a table row.

**The test:** Can a user accidentally trigger a destructive action while scanning
the table? If yes, the action is too visible.

## ❌ Incorrect

```tsx
{/* Delete button permanently visible in every row — accident-prone */}
<tr>
  <td>{row.name}</td>
  <td>{row.status}</td>
  <td>
    <button className="text-red-600" onClick={() => deleteItem(row.id)}>
      Delete
    </button>
  </td>
</tr>
```

## ✅ Correct

```tsx
{/* Destructive action hidden in hover-revealed overflow menu */}
<tr className="group">
  <td>{row.name}</td>
  <td>{row.status}</td>
  <td>
    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button aria-label="More actions">
            <MoreHorizontalIcon className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => editItem(row.id)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => confirmDelete(row.id)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </td>
</tr>
```

```tsx
{/* Alternative: timed undo instead of confirmation dialog */}
function handleDelete(id: string) {
  // Optimistic removal
  removeFromList(id);
  toast("Item deleted", {
    action: { label: "Undo", onClick: () => restoreItem(id) },
    duration: 6000,
  });
}
```

## Why

Destructive actions in the permanent view create two problems:
1. **Accidental triggering** — especially on dense tables with many rows.
2. **Visual noise** — red "Delete" buttons in every row dominate the visual hierarchy,
   stealing attention from the user's actual task.

The progressive disclosure spectrum places destructive actions at the deepest level:
overflow menu → confirmation step → execution.

→ `references/progressive-disclosure.md` "Destructive actions", `references/invisible-ui.md` "Undo"
