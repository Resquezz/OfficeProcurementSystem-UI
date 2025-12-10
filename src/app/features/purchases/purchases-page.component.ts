import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PurchasesService } from './purchases.service';
import { CategoriesService } from '../categories/categories.service';
import { UsersService } from '../users/users.service';
import { CategoryDto } from '../categories/categories.model';
import { UserDto } from '../users/users.model';
import { CreatePurchaseRequest, PurchaseDto, PurchaseStatus, UpdatePurchaseRequest } from './purchases.model';

@Component({
  selector: 'app-purchases-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './purchases-page.component.html',
  styleUrl: './purchases-page.component.scss'
})
export class PurchasesPageComponent implements OnInit {
  private readonly purchasesService = inject(PurchasesService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly usersService = inject(UsersService);
  private readonly fb = inject(FormBuilder);

  private readonly titlePattern = /^(?!\s*$)[A-Za-zА-Яа-яЁёІіЇїЄєҐґ0-9'’\-\s]+$/;
  private readonly textPattern = /^(?!\s*$).+/;
  private readonly amountPattern = /^(?!\s*$)\d+(\.\d+)?$/;

  readonly purchases = signal<PurchaseDto[]>([]);
  readonly categories = signal<CategoryDto[]>([]);
  readonly users = signal<UserDto[]>([]);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly showForm = signal(false);
  readonly pendingDelete = signal<PurchaseDto | null>(null);
  readonly editingId = signal<string | null>(null);

  readonly statusOptions: { label: string; value: PurchaseStatus }[] = [
    { label: 'Очікує', value: PurchaseStatus.Pending },
    { label: 'Схвалено', value: PurchaseStatus.Approved },
    { label: 'Відхилено', value: PurchaseStatus.Rejected }
  ];

  readonly hasPurchases = computed(() => this.purchases().length > 0);

  readonly form = this.fb.nonNullable.group({
    title: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(120), Validators.pattern(this.titlePattern)]),
    description: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(500), Validators.pattern(this.textPattern)]),
    requestedAmount: this.fb.nonNullable.control(0, [Validators.required, Validators.min(0), Validators.pattern(this.amountPattern)]),
    userId: this.fb.nonNullable.control('', [Validators.required]),
    categoryId: this.fb.nonNullable.control('', [Validators.required]),
    status: this.fb.nonNullable.control<PurchaseStatus>(PurchaseStatus.Pending, [Validators.required])
  });

  ngOnInit(): void {
    this.loadReferenceData();
    this.loadPurchases();
  }

  trackById(_: number, item: PurchaseDto): string {
    return item.id;
  }

  userName(userId: string | null | undefined): string {
    const found = this.users().find((u) => u.id === userId);
    return found ? `${found.name} ${found.surname}` : 'Невідомо';
  }

  categoryName(categoryId: string | null | undefined): string {
    const found = this.categories().find((c) => c.id === categoryId);
    return found?.name ?? 'Невідомо';
  }

  statusLabel(status: PurchaseStatus | null | undefined): string {
    const found = this.statusOptions.find((s) => s.value === status);
    return found?.label ?? 'Невідомо';
  }

  startCreate(): void {
    this.resetForm();
    this.showForm.set(true);
  }

  editPurchase(purchase: PurchaseDto): void {
    this.editingId.set(purchase.id);
    this.form.patchValue({
      title: purchase.title,
      description: purchase.description,
      requestedAmount: purchase.requestedAmount,
      userId: purchase.userId,
      categoryId: purchase.categoryId,
      status: purchase.status
    });
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
  }

  private resetForm(): void {
    this.editingId.set(null);
    const firstUser = this.users()[0]?.id ?? '';
    const firstCategory = this.categories()[0]?.id ?? '';
    this.form.reset({
      title: '',
      description: '',
      requestedAmount: 0,
      userId: firstUser,
      categoryId: firstCategory,
      status: PurchaseStatus.Pending
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { title, description, requestedAmount, userId, categoryId, status } = this.form.getRawValue();
    const editingId = this.editingId();

    this.loading.set(true);
    this.error.set(null);

    if (editingId) {
      const payload: UpdatePurchaseRequest = {
        id: editingId,
        title,
        description,
        requestedAmount,
        userId,
        categoryId,
        status
      };

      this.purchasesService.updatePurchase(payload).subscribe({
        next: (updated) => {
          this.purchases.update((items) => items.map((item) => (item.id === updated.id ? updated : item)));
          this.loading.set(false);
          this.closeForm();
          this.resetForm();
        },
        error: (err) => this.handleError(err)
      });
    } else {
      const payload: CreatePurchaseRequest = { title, description, requestedAmount, userId, categoryId };
      this.purchasesService.createPurchase(payload).subscribe({
        next: (created) => {
          this.purchases.update((items) => [created, ...items]);
          this.loading.set(false);
          this.closeForm();
          this.resetForm();
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  openDeleteDialog(purchase: PurchaseDto): void {
    this.pendingDelete.set(purchase);
  }

  cancelDelete(): void {
    this.pendingDelete.set(null);
  }

  confirmDelete(): void {
    const purchase = this.pendingDelete();
    if (!purchase) {
      return;
    }
    this.loading.set(true);
    this.error.set(null);

    this.purchasesService.deletePurchase(purchase.id).subscribe({
      next: () => {
        this.purchases.update((items) => items.filter((item) => item.id !== purchase.id));
        this.loading.set(false);
        this.pendingDelete.set(null);
        if (this.editingId() === purchase.id) {
          this.resetForm();
          this.closeForm();
        }
      },
      error: (err) => this.handleError(err)
    });
  }

  refresh(): void {
    this.loadPurchases();
    this.loadReferenceData();
  }

  private loadPurchases(): void {
    this.loading.set(true);
    this.error.set(null);

    this.purchasesService.getPurchases().subscribe({
      next: (data) => {
        this.purchases.set(data);
        this.loading.set(false);
      },
      error: (err) => this.handleError(err)
    });
  }

  private loadReferenceData(): void {
    this.categoriesService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        const currentCategory = this.form.controls.categoryId.value;
        if (!currentCategory && data.length) {
          this.form.patchValue({ categoryId: data[0].id });
        }
      },
      error: (err) => this.handleError(err)
    });

    this.usersService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        const currentUser = this.form.controls.userId.value;
        if (!currentUser && data.length) {
          this.form.patchValue({ userId: data[0].id });
        }
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
