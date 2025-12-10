import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SuppliersService } from './suppliers.service';
import { CategoriesService } from '../categories/categories.service';
import { SupplierDto, CreateSupplierRequest, UpdateSupplierRequest } from './suppliers.model';
import { CategoryDto } from '../categories/categories.model';

@Component({
  selector: 'app-suppliers-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './suppliers-page.component.html',
  styleUrl: './suppliers-page.component.scss'
})
export class SuppliersPageComponent implements OnInit {
  private readonly suppliersService = inject(SuppliersService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly fb = inject(FormBuilder);

  // Require at least one non-space; allow letters, digits, apostrophes, dashes, and spaces.
  private readonly namePattern = /^(?!\s*$)[A-Za-zА-Яа-яЁёІіЇїЄєҐґ0-9'’\-\s]+$/;
  // Allow any non-empty, non-whitespace contact info up to max length.
  private readonly contactPattern = /^(?!\s*$).+/;

  readonly suppliers = signal<SupplierDto[]>([]);
  readonly categories = signal<CategoryDto[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly showForm = signal(false);
  readonly pendingDelete = signal<SupplierDto | null>(null);
  readonly editingId = signal<string | null>(null);

  readonly hasSuppliers = computed(() => this.suppliers().length > 0);

  readonly form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(120),
      Validators.pattern(this.namePattern)
    ]),
    contactInfo: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(200),
      Validators.pattern(this.contactPattern)
    ]),
    categoryId: this.fb.nonNullable.control('', [Validators.required])
  });

  ngOnInit(): void {
    this.loadCategories();
    this.loadSuppliers();
  }

  trackById(_: number, item: SupplierDto): string {
    return item.id;
  }

  categoryName(categoryId: string | null | undefined): string {
    const found = this.categories().find((c) => c.id === categoryId);
    return found?.name ?? 'Невідома категорія';
  }

  startCreate(): void {
    this.resetForm();
    this.showForm.set(true);
  }

  editSupplier(supplier: SupplierDto): void {
    this.editingId.set(supplier.id);
    this.form.patchValue({
      name: supplier.name,
      contactInfo: supplier.contactInfo,
      categoryId: supplier.categoryId
    });
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
  }

  private resetForm(): void {
    this.editingId.set(null);
    const firstCategoryId = this.categories()[0]?.id ?? '';
    this.form.reset({
      name: '',
      contactInfo: '',
      categoryId: firstCategoryId
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, contactInfo, categoryId } = this.form.getRawValue();
    const editingId = this.editingId();

    this.loading.set(true);
    this.error.set(null);

    if (editingId) {
      const payload: UpdateSupplierRequest = { id: editingId, name, contactInfo, categoryId };
      this.suppliersService.updateSupplier(payload).subscribe({
        next: (updated) => {
          this.suppliers.update((items) => items.map((item) => (item.id === updated.id ? updated : item)));
          this.loading.set(false);
          this.closeForm();
          this.resetForm();
        },
        error: (err) => this.handleError(err)
      });
    } else {
      const payload: CreateSupplierRequest = { name, contactInfo, categoryId };
      this.suppliersService.createSupplier(payload).subscribe({
        next: (created) => {
          this.suppliers.update((items) => [created, ...items]);
          this.loading.set(false);
          this.closeForm();
          this.resetForm();
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  openDeleteDialog(supplier: SupplierDto): void {
    this.pendingDelete.set(supplier);
  }

  cancelDelete(): void {
    this.pendingDelete.set(null);
  }

  confirmDelete(): void {
    const supplier = this.pendingDelete();
    if (!supplier) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.suppliersService.deleteSupplier(supplier.id).subscribe({
      next: () => {
        this.suppliers.update((items) => items.filter((item) => item.id !== supplier.id));
        this.loading.set(false);
        this.pendingDelete.set(null);
        if (this.editingId() === supplier.id) {
          this.resetForm();
          this.closeForm();
        }
      },
      error: (err) => this.handleError(err)
    });
  }

  refresh(): void {
    this.loadSuppliers();
    if (!this.categories().length) {
      this.loadCategories();
    }
  }

  private loadSuppliers(): void {
    this.loading.set(true);
    this.error.set(null);

    this.suppliersService.getSuppliers().subscribe({
      next: (data) => {
        this.suppliers.set(data);
        this.loading.set(false);
      },
      error: (err) => this.handleError(err)
    });
  }

  private loadCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        // Set default category for new forms if empty.
        if (!this.editingId()) {
          const currentCategory = this.form.controls.categoryId.value;
          if (!currentCategory) {
            const firstCategoryId = data[0]?.id ?? '';
            this.form.patchValue({ categoryId: firstCategoryId });
          }
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
