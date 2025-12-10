export enum PurchaseStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2
}

export interface PurchaseDto {
  id: string;
  userId: string;
  createdAt: string;
  categoryId: string;
  title: string;
  description: string;
  status: PurchaseStatus;
  requestedAmount: number;
}

export interface CreatePurchaseRequest {
  userId: string;
  categoryId: string;
  title: string;
  description: string;
  requestedAmount: number;
}

export interface UpdatePurchaseRequest {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  description: string;
  status: PurchaseStatus;
  requestedAmount: number;
}