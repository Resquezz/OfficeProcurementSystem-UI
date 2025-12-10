export interface DashboardStat {
  label: string;
  value: number;
  unit?: string;
}

export interface DashboardSummary {
  budgetsTotal: number;
  purchasesPending: number;
  suppliersCount: number;
  usersCount: number;
  spendToDate: number;
}