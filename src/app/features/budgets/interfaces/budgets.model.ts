export interface Budget {
  guid: string;
  generalAmount: number;
  availableAmount: number;
  name: string;
}

export interface CreateBudgetRequest {
  generalAmount: number;
  name: string;
}

export interface UpdateBudgetRequest {
  id: string;
  generalAmount: number;
  availableAmount: number;
  name: string;
}