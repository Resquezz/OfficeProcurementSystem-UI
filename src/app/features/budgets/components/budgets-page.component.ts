import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BudgetsService } from '../services/budgets.service';
import { Budget, CreateBudgetRequest, UpdateBudgetRequest } from '../interfaces/budgets.model';

@Component({
  selector: 'app-budgets-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './budgets-page.component.html',
  styleUrl: './budgets-page.component.scss'
})
export class BudgetsPageComponent implements OnInit {
  private readonly budgetsService = inject(BudgetsService);
  private readonly fb = inject(FormBuilder);

  // Require at least one non-space; allow letters, digits, apostrophes, dashes, and spaces for budget names.
  private readonly namePattern = /^(?!\s*$)[A-Za-zА-Яа-яЁёІіЇїЄєҐґ0-9'’\-\s]+$/;
  // Numeric with optional decimal; disallow whitespace-only input.
  private readonly amountPattern = /^(?!\s*$)\d+(\.\d+)?$/;

  readonly budgets = signal<Budget[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly editingId = signal<string | null>(null);
  readonly pendingDelete = signal<Budget | null>(null);
  readonly showForm = signal(false);

  readonly hasBudgets = computed(() => this.budgets().length > 0);

  readonly form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(120),
      Validators.pattern(this.namePattern)
    ]),
    generalAmount: this.fb.nonNullable.control(0, [
      Validators.required,
      Validators.min(0),
      Validators.pattern(this.amountPattern)
    ]),
    availableAmount: this.fb.nonNullable.control(0, [
      Validators.required,
      Validators.min(0),
      Validators.pattern(this.amountPattern)
    ])
  });

  ngOnInit(): void {
    this.loadBudgets();
  }

  trackByGuid(_: number, item: Budget): string {
    return item.guid;
  }

  startCreate(): void {
    this.resetFormValues();
    this.showForm.set(true);
  }

  editBudget(budget: Budget): void {
    this.editingId.set(budget.guid);
    this.form.setValue({
      name: budget.name,
      generalAmount: budget.generalAmount,
      availableAmount: budget.availableAmount
    });
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
  }

  private resetFormValues(): void {
    this.editingId.set(null);
    this.form.reset({ name: '', generalAmount: 0, availableAmount: 0 });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, generalAmount, availableAmount } = this.form.getRawValue();
    const generalAmountNum = Number(generalAmount);
    const availableAmountNum = Number(availableAmount);
    const editingId = this.editingId();

    this.loading.set(true);
    this.error.set(null);

    if (editingId) {
      const payload: UpdateBudgetRequest = {
        id: editingId,
        name,
        generalAmount: generalAmountNum,
        availableAmount: availableAmountNum
      };

      this.budgetsService.updateBudget(payload).subscribe({
        next: (updated) => {
          this.budgets.update((items) =>
            items.map((item) => (item.guid === updated.guid ? updated : item))
          );
          this.loading.set(false);
          this.showForm.set(false);
          this.resetFormValues();
        },
        error: (err) => this.handleError(err)
      });
    } else {
      const payload: CreateBudgetRequest = {
        name,
        generalAmount: generalAmountNum
      };

      this.budgetsService.createBudget(payload).subscribe({
        next: (created) => {
          this.budgets.update((items) => [created, ...items]);
          this.loading.set(false);
          this.showForm.set(false);
          this.resetFormValues();
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  openDeleteDialog(budget: Budget): void {
    this.pendingDelete.set(budget);
  }

  cancelDelete(): void {
    this.pendingDelete.set(null);
  }

  confirmDelete(): void {
    const budget = this.pendingDelete();
    if (!budget) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.budgetsService.deleteBudget(budget.guid).subscribe({
      next: () => {
        this.budgets.update((items) => items.filter((item) => item.guid !== budget.guid));
        this.loading.set(false);
        this.pendingDelete.set(null);
        if (this.editingId() === budget.guid) {
          this.startCreate();
        }
      },
      error: (err) => this.handleError(err)
    });
  }

  refresh(): void {
    this.loadBudgets();
  }

  private loadBudgets(): void {
    this.loading.set(true);
    this.error.set(null);

    this.budgetsService.getBudgets().subscribe({
      next: (budgets) => {
        this.budgets.set(budgets);
        this.loading.set(false);
      },
      error: (err) => this.handleError(err)
    });
  }

  private handleError(err: unknown): void {
    console.error(err);
    this.loading.set(false);
    this.error.set('Не вдалося обробити запит. Перевірте API або повторіть спробу.');
  }
}