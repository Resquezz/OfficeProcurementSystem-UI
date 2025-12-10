import { Routes } from '@angular/router';
import { BudgetsPageComponent } from './features/budgets/budgets-page.component';
import { UsersPageComponent } from './features/users/users-page.component';
import { CategoriesPageComponent } from './features/categories/categories-page.component';
import { SuppliersPageComponent } from './features/suppliers/suppliers-page.component';
import { PurchasesPageComponent } from './features/purchases/purchases-page.component';
import { DummyGuard } from './core/guards/dummy.guard';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'budgets' },
	{ path: 'budgets', component: BudgetsPageComponent },
	{ path: 'users', component: UsersPageComponent },
	{ path: 'categories', component: CategoriesPageComponent },
	{ path: 'suppliers', component: SuppliersPageComponent },
	{ path: 'purchases', component: PurchasesPageComponent },
	{
		path: 'cli-sample',
		canActivate: [DummyGuard],
		loadChildren: () => import('./cli-sample/cli-sample.module').then((m) => m.CliSampleModule)
	}
];
