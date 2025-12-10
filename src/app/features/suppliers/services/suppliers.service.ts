import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateSupplierRequest, SupplierDto, UpdateSupplierRequest } from '../interfaces/suppliers.model';

@Injectable({ providedIn: 'root' })
export class SuppliersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/Suppliers';

  getSuppliers(): Observable<SupplierDto[]> {
    return this.http.get<SupplierDto[]>(this.baseUrl);
  }

  getSupplier(id: string): Observable<SupplierDto> {
    return this.http.get<SupplierDto>(`${this.baseUrl}/${id}`);
  }

  createSupplier(payload: CreateSupplierRequest): Observable<SupplierDto> {
    return this.http.post<SupplierDto>(this.baseUrl, payload);
  }

  updateSupplier(payload: UpdateSupplierRequest): Observable<SupplierDto> {
    return this.http.put<SupplierDto>(this.baseUrl, payload);
  }

  deleteSupplier(id: string): Observable<void> {
    return this.http.request<void>('delete', this.baseUrl, {
      body: { id }
    });
  }
}