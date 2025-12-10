import { Routes } from '@angular/router';
import { BudgetsPageComponent } from './features/budgets/budgets-page.component';
import { UsersPageComponent } from './features/users/users-page.component';
import { CategoriesPageComponent } from './features/categories/categories-page.component';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'budgets' },
	{ path: 'budgets', component: BudgetsPageComponent },
	{ path: 'users', component: UsersPageComponent },
	{ path: 'categories', component: CategoriesPageComponent }
];
