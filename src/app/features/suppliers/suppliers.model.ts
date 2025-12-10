export interface SupplierDto {
  id: string;
  name: string;
  contactInfo: string;
  categoryId: string;
}

export interface CreateSupplierRequest {
  name: string;
  contactInfo: string;
  categoryId: string;
}

export interface UpdateSupplierRequest {
  id: string;
  name: string;
  contactInfo: string;
  categoryId: string;
}
