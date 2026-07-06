---
stack: angular
description: >
  Component guidance for Angular (v17+) + Tailwind CSS + Angular Material.
  Load this file when the user's stack is confirmed as Angular.
---

# Stack: Angular + Angular Material + Tailwind

> Use Angular Material primitives for accessible table, tooltip, menu, and dialog behaviors.
> Use Tailwind for layout, spacing, and micro-interactions.

## Status / State → MatChip

```html
<mat-chip-set>
  <mat-chip [class]="statusStyles[status]">
    {{ status | titlecase }}
  </mat-chip>
</mat-chip-set>
```

```typescript
statusStyles = {
  paid: 'bg-green-500/15 text-green-700 border-green-500/20',
  pending: 'bg-amber-500/15 text-amber-700 border-amber-500/20',
  overdue: 'bg-red-500/15 text-red-700 border-red-500/20'
};
```

## Data Tables → `<table mat-table>`

```html
<table mat-table [dataSource]="data" class="w-full">
  <!-- Numeric column with text-right and tabular nums -->
  <ng-container matColumnDef="amount">
    <th mat-header-cell *matHeaderCellDef class="text-right">Amount</th>
    <td mat-cell *matCellDef="let row" class="text-right font-mono tabular-nums">
      {{ row.amount | currency }}
    </td>
  </ng-container>
</table>
```

## Tooltips → `matTooltip`

```html
<button mat-icon-button matTooltip="Archive item" aria-label="Archive item">
  <mat-icon>archive</mat-icon>
</button>
```

## Toast Feedback → `MatSnackBar`

```typescript
import { MatSnackBar } from '@angular/material/snack-bar';

constructor(private snackBar: MatSnackBar) {}

deleteItem(id: string) {
  const ref = this.snackBar.open('Invoice deleted', 'Undo', { duration: 6000 });
  ref.onAction().subscribe(() => {
    // Restore logic
  });
}
```

## Complete Reference Component: Angular Data Table with Full Lifecycle

This component implements a complete table component in Angular using signals, Angular Material, and Tailwind CSS.

### TS Component

```typescript
import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

export interface Invoice {
  id: string;
  customer: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  date: string; // ISO String
}

@Component({
  selector: 'app-invoice-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './STACK.md.html', // Pointing inline structure conceptually
  styles: [`
    tr.group:hover {
      background-color: rgb(249 250 251 / 0.5);
    }
  `]
})
export class InvoiceTableComponent {
  @Input({ required: true }) isLoading = false;
  @Input({ required: true }) error: Error | null = null;
  @Input({ required: true }) set data(value: Invoice[] | null) {
    this.invoicesSignal.set(value || []);
  }

  @Output() retry = new EventEmitter<void>();
  @Output() delete = new EventEmitter<string>();

  invoicesSignal = signal<Invoice[]>([]);
  filterQuery = signal<string>('');

  filteredInvoices = computed(() => {
    const query = this.filterQuery().toLowerCase();
    return this.invoicesSignal().filter(inv => 
      inv.customer.toLowerCase().includes(query)
    );
  });

  displayedColumns = ['customer', 'status', 'amount', 'date', 'actions'];

  statusStyles: Record<string, string> = {
    paid: 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400 border-green-200 dark:border-green-900/50',
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-900/50',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400 border-red-200 dark:border-red-900/50'
  };

  constructor(private snackBar: MatSnackBar) {}

  updateFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.filterQuery.set(value);
  }

  formatRelativeTime(isoString: string): string {
    const date = new Date(isoString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    return `${diffDays} days ago`;
  }

  onDeleteInvoice(invoice: Invoice) {
    this.delete.emit(invoice.id);
    const snackBarRef = this.snackBar.open('Invoice deleted', 'Undo', { duration: 5000 });
    snackBarRef.onAction().subscribe(() => {
      // Undo logic callback
    });
  }
}
```

### HTML Template

```html
<div class="space-y-4">
  <!-- Search input -->
  <div class="relative max-w-sm flex items-center">
    <span class="absolute left-3 text-gray-400">
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
    </span>
    <input
      (input)="updateFilter($event)"
      placeholder="Filter by customer..."
      class="pl-9 h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-black"
    />
  </div>

  <!-- 1. Loading State -->
  <div *ngIf="isLoading" class="overflow-x-auto rounded-lg border border-gray-200">
    <table class="min-w-full divide-y divide-gray-200 text-sm">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-4 py-3 text-left text-gray-500 font-medium">Customer</th>
          <th class="px-4 py-3 text-left text-gray-500 font-medium">Status</th>
          <th class="px-4 py-3 text-right text-gray-500 font-medium">Amount</th>
          <th class="px-4 py-3 text-right text-gray-500 font-medium">Date</th>
          <th class="px-4 py-3 w-[80px]"></th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let i of [1,2,3,4,5]">
          <td class="px-4 py-3"><div class="animate-pulse rounded bg-gray-200 h-4 w-32"></div></td>
          <td class="px-4 py-3"><div class="animate-pulse rounded bg-gray-200 h-5 w-16 rounded-full"></div></td>
          <td class="px-4 py-3 text-right"><div class="animate-pulse rounded bg-gray-200 h-4 w-20 ml-auto"></div></td>
          <td class="px-4 py-3 text-right"><div class="animate-pulse rounded bg-gray-200 h-4 w-24 ml-auto"></div></td>
          <td class="px-4 py-3"><div class="animate-pulse rounded bg-gray-200 h-8 w-8 rounded-md"></div></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 2. Error State -->
  <div *ngIf="!isLoading && error" class="flex flex-col items-center justify-center rounded-lg border border-red-100 bg-red-50/50 p-8 text-center">
    <span class="text-red-600 mb-3"><svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg></span>
    <h3 class="font-semibold text-red-950">Failed to load invoices</h3>
    <p class="text-sm text-red-700 mt-1 mb-4">{{ error.message || 'A network error occurred.' }}</p>
    <button 
      (click)="retry.emit()"
      class="inline-flex items-center justify-center rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 focus:outline-none"
    >
      Retry Load
    </button>
  </div>

  <!-- 3. Empty State -->
  <div *ngIf="!isLoading && !error && invoicesSignal().length === 0" class="flex flex-col items-center justify-center py-16 text-center border rounded-lg">
    <div class="rounded-full bg-gray-100 p-4 mb-4">
      <span class="text-gray-400"><svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2h12a2 2 0 002-2z"/></svg></span>
    </div>
    <h3 class="text-lg font-semibold mb-1">No invoices found</h3>
    <p class="text-sm text-gray-500 mb-4 max-w-sm">Generate your first invoice to bill clients.</p>
    <button class="inline-flex items-center justify-center rounded-md bg-black text-white px-4 py-2 text-sm font-medium">Create Invoice</button>
  </div>

  <!-- 4. No-Results State -->
  <div *ngIf="!isLoading && !error && invoicesSignal().length > 0 && filteredInvoices().length === 0" class="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-lg">
    <h3 class="font-semibold mb-1">No matching invoices</h3>
    <p class="text-sm text-gray-500 mb-4">No customer matches "{{ filterQuery() }}". Try adjusting your search query.</p>
    <button (click)="filterQuery.set('')" class="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-50">Clear Filter</button>
  </div>

  <!-- Table Content -->
  <div *ngIf="!isLoading && !error && filteredInvoices().length > 0" class="rounded-md border border-gray-200">
    <table mat-table [dataSource]="filteredInvoices()" class="w-full text-sm">
      <ng-container matColumnDef="customer">
        <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-left font-medium text-gray-500">Customer</th>
        <td mat-cell *matCellDef="let row" class="px-4 py-3 font-medium text-gray-900">{{ row.customer }}</td>
      </ng-container>

      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-left font-medium text-gray-500">
          <span matTooltip="The current collection phase of the invoice" class="cursor-help border-b border-dotted border-gray-400">Status</span>
        </th>
        <td mat-cell *matCellDef="let row" class="px-4 py-3">
          <span [className]="'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ' + statusStyles[row.status]">
            {{ row.status | uppercase }}
          </span>
        </td>
      </ng-container>

      <ng-container matColumnDef="amount">
        <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-right font-medium text-gray-500">Amount</th>
        <td mat-cell *matCellDef="let row" class="px-4 py-3 text-right font-mono tabular-nums text-gray-900">
          {{ row.amount | currency }}
        </td>
      </ng-container>

      <ng-container matColumnDef="date">
        <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-right font-medium text-gray-500">Date</th>
        <td mat-cell *matCellDef="let row" class="px-4 py-3 text-right text-gray-500">
          <span [matTooltip]="row.date | date:'medium'">{{ formatRelativeTime(row.date) }}</span>
        </td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef class="w-[80px]"></th>
        <td mat-cell *matCellDef="let row" class="px-4 py-3 text-right">
          <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button mat-icon-button matTooltip="Archive invoice records" class="text-gray-500">
              <mat-icon class="text-sm">archive</mat-icon>
            </button>
            <button mat-icon-button [matMenuTriggerFor]="menu" class="text-gray-500">
              <mat-icon class="text-sm">more_horiz</mat-icon>
            </button>
            <mat-menu #menu="matMenu" xPosition="before">
              <button mat-menu-item>Download PDF</button>
              <button mat-menu-item>Send Reminder</button>
              <button mat-menu-item (click)="onDeleteInvoice(row)" class="text-red-600">Delete</button>
            </mat-menu>
          </div>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns" class="bg-gray-50"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="group border-b"></tr>
    </table>
  </div>
</div>
```
