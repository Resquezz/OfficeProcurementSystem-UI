import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriesService } from '../services/categories.service';
import { CategoryDto, CreateCategoryRequest, UpdateCategoryRequest } from '../interfaces/categories.model';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.scss'
})
export class CategoriesPageComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  private readonly fb = inject(FormBuilder);


  private readonly namePattern = /^(?!\s*$)[A-Za-zА-Яа-яЁёІіЇїЄєҐґ0-9'’\-\s]+$/;

  readonly categories = signal<CategoryDto[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly editingId = signal<string | null>(null);
  readonly pendingDelete = signal<CategoryDto | null>(null);
  readonly showForm = signal(false);

  readonly hasCategories = computed(() => this.categories().length > 0);

  readonly form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(120),
      Validators.pattern(this.namePattern)
    ])
  });

  ngOnInit(): void {
    this.loadCategories();
  }

  trackById(_: number, item: CategoryDto): string {
    return item.id;
  }

  startCreate(): void {
    this.resetFormValues();
    this.showForm.set(true);
  }

  editCategory(category: CategoryDto): void {
    this.editingId.set(category.id);
    this.form.patchValue({ name: category.name });
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
  }

  private resetFormValues(): void {
    this.editingId.set(null);
    this.form.reset({ name: '' });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name } = this.form.getRawValue();
    const editingId = this.editingId();

    this.loading.set(true);
    this.error.set(null);

    if (editingId) {
      const payload: UpdateCategoryRequest = { id: editingId, name };
      this.categoriesService.updateCategory(payload).subscribe({
        next: (updated) => {
          this.categories.update((items) => items.map((item) => (item.id === updated.id ? updated : item)));
          this.loading.set(false);
          this.closeForm();
          this.resetFormValues();
        },
        error: (err) => this.handleError(err)
      });
    } else {
      const payload: CreateCategoryRequest = { name };
      this.categoriesService.createCategory(payload).subscribe({
        next: (created) => {
          this.categories.update((items) => [created, ...items]);
          this.loading.set(false);
          this.closeForm();
          this.resetFormValues();
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  openDeleteDialog(category: CategoryDto): void {
    this.pendingDelete.set(category);
  }

  cancelDelete(): void {
    this.pendingDelete.set(null);
  }

  confirmDelete(): void {
    const category = this.pendingDelete();
    if (!category) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.categoriesService.deleteCategory(category.id).subscribe({
      next: () => {
        this.categories.update((items) => items.filter((item) => item.id !== category.id));
        this.loading.set(false);
        this.pendingDelete.set(null);
        if (this.editingId() === category.id) {
          this.resetFormValues();
          this.closeForm();
        }
      },
      error: (err) => this.handleError(err)
    });
  }

  refresh(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.loading.set(true);
    this.error.set(null);

    this.categoriesService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
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