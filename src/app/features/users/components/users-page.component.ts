import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { CreateUserRequest, UpdateUserRequest, UserDto, UserRole } from '../interfaces/users.model';

interface RoleOption {
  label: string;
  value: UserRole;
}

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss'
})
export class UsersPageComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly fb = inject(FormBuilder);

  // Require at least one non-space while allowing letters, apostrophes, dashes, and spaces.
  private readonly namePattern = /^(?!\s*$)[A-Za-zА-Яа-яЁёІіЇїЄєҐґ'’\-\s]+$/;

  readonly users = signal<UserDto[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly editingId = signal<string | null>(null);
  readonly pendingDelete = signal<UserDto | null>(null);
  readonly showForm = signal(false);

  readonly hasUsers = computed(() => this.users().length > 0);

  readonly roleOptions: RoleOption[] = [
    { label: 'Працівник', value: UserRole.Employee },
    { label: 'Аналітик', value: UserRole.Analyst },
    { label: 'Адміністратор', value: UserRole.Admin }
  ];

  roleLabel(role: UserRole | null | undefined): string {
    const found = this.roleOptions.find((item) => item.value === role);
    return found?.label ?? 'Невідома роль';
  }

  readonly form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(80),
      Validators.pattern(this.namePattern)
    ]),
    surname: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(80),
      Validators.pattern(this.namePattern)
    ]),
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email, Validators.maxLength(120)]),
    role: this.fb.nonNullable.control<UserRole>(UserRole.Employee, [Validators.required]),
    password: this.fb.nonNullable.control('', [])
  });

  ngOnInit(): void {
    this.loadUsers();
  }

  trackById(_: number, item: UserDto): string {
    return item.id;
  }

  startCreate(): void {
    this.resetFormValues();
    this.showForm.set(true);
  }

  editUser(user: UserDto): void {
    this.editingId.set(user.id);
    this.form.patchValue({
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role,
      password: ''
    });
    this.form.controls.password.clearValidators();
    this.form.controls.password.updateValueAndValidity();
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
  }

  private resetFormValues(): void {
    this.editingId.set(null);
    this.form.reset({
      name: '',
      surname: '',
      email: '',
      role: UserRole.Employee,
      password: ''
    });
    this.form.controls.password.setValidators([Validators.required, Validators.minLength(6)]);
    this.form.controls.password.updateValueAndValidity();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, surname, email, role, password } = this.form.getRawValue();
    const editingId = this.editingId();

    this.loading.set(true);
    this.error.set(null);

    if (editingId) {
      const payload: UpdateUserRequest = {
        id: editingId,
        name,
        surname,
        email,
        role
      };

      this.usersService.updateUser(payload).subscribe({
        next: (updated) => {
          this.users.update((items) => items.map((item) => (item.id === updated.id ? updated : item)));
          this.loading.set(false);
          this.closeForm();
          this.resetFormValues();
        },
        error: (err) => this.handleError(err)
      });
    } else {
      if (this.form.controls.password.invalid) {
        this.form.controls.password.markAsTouched();
        this.loading.set(false);
        return;
      }

      const payload: CreateUserRequest = {
        name,
        surname,
        email,
        role,
        password: password
      };

      this.usersService.createUser(payload).subscribe({
        next: (created) => {
          this.users.update((items) => [created, ...items]);
          this.loading.set(false);
          this.closeForm();
          this.resetFormValues();
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  openDeleteDialog(user: UserDto): void {
    this.pendingDelete.set(user);
  }

  cancelDelete(): void {
    this.pendingDelete.set(null);
  }

  confirmDelete(): void {
    const user = this.pendingDelete();
    if (!user) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.usersService.deleteUser(user.id).subscribe({
      next: () => {
        this.users.update((items) => items.filter((i) => i.id !== user.id));
        this.loading.set(false);
        this.pendingDelete.set(null);
        if (this.editingId() === user.id) {
          this.resetFormValues();
          this.closeForm();
        }
      },
      error: (err) => this.handleError(err)
    });
  }

  refresh(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.loading.set(true);
    this.error.set(null);

    this.usersService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
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