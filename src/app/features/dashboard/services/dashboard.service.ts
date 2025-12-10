import { Injectable, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { DashboardStat, DashboardSummary } from '../interfaces/dashboard.model';
import { BudgetsService } from '../../budgets/services/budgets.service';
import { PurchasesService } from '../../purchases/services/purchases.service';
import { SuppliersService } from '../../suppliers/services/suppliers.service';
import { UsersService } from '../../users/services/users.service';
import { PurchaseStatus } from '../../purchases/interfaces/purchases.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly budgetsService = inject(BudgetsService);
  private readonly purchasesService = inject(PurchasesService);
  private readonly suppliersService = inject(SuppliersService);
  private readonly usersService = inject(UsersService);

  readonly summary = signal<DashboardSummary | null>(null);
  readonly stats = signal<DashboardStat[]>([]);

  load(): void {
    forkJoin({
      budgets: this.budgetsService.getBudgets(),
      purchases: this.purchasesService.getPurchases(),
      suppliers: this.suppliersService.getSuppliers(),
      users: this.usersService.getUsers()
    }).subscribe({
      next: ({ budgets, purchases, suppliers, users }) => {
        const pendingPurchases = purchases.filter((purchase) => purchase.status === PurchaseStatus.Pending);
        const approvedPurchases = purchases.filter((purchase) => purchase.status === PurchaseStatus.Approved);
        const spendToDate = approvedPurchases.reduce((total, purchase) => total + purchase.requestedAmount, 0);

        this.summary.set({
          budgetsTotal: budgets.length,
          purchasesPending: pendingPurchases.length,
          suppliersCount: suppliers.length,
          usersCount: users.length,
          spendToDate
        });

        this.stats.set([
          { label: 'Активні бюджети', value: budgets.length },
          { label: 'Запити очікують', value: pendingPurchases.length },
          { label: 'Схвалено', value: approvedPurchases.length },
          { label: 'Постачальники', value: suppliers.length }
        ]);
      },
      error: () => {
        this.summary.set(null);
        this.stats.set([]);
      }
    });
  }
}