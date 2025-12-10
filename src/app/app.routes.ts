import { Routes } from '@angular/router';
import { DummyGuard } from './core/guards/dummy.guard';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'dashboard' },
	{
		path: 'dashboard',
		loadChildren: () => import('./features/dashboard/dashboard.module').then((m) => m.DashboardModule)
	},
	{
		path: 'budgets',
		loadChildren: () => import('./features/budgets/budgets.module').then((m) => m.BudgetsModule)
	},
	{
		path: 'users',
		loadChildren: () => import('./features/users/users.module').then((m) => m.UsersModule)
	},
	{
		path: 'categories',
		loadChildren: () => import('./features/categories/categories.module').then((m) => m.CategoriesModule)
	},
	{
		path: 'suppliers',
		loadChildren: () => import('./features/suppliers/suppliers.module').then((m) => m.SuppliersModule)
	},
	{
		path: 'purchases',
		loadChildren: () => import('./features/purchases/purchases.module').then((m) => m.PurchasesModule)
	},
	{
		path: 'settings',
		loadChildren: () => import('./features/settings/settings.module').then((m) => m.SettingsModule)
	},
	{
		path: 'cli-sample',
		canActivate: [DummyGuard],
		loadChildren: () => import('./cli-sample/cli-sample.module').then((m) => m.CliSampleModule)
	}
];
