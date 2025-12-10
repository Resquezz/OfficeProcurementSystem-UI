import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreatePurchaseRequest, PurchaseDto, UpdatePurchaseRequest } from './purchases.model';

@Injectable({ providedIn: 'root' })
export class PurchasesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/Purchases';

  getPurchases(): Observable<PurchaseDto[]> {
    return this.http.get<PurchaseDto[]>(this.baseUrl);
  }

  getPurchase(id: string): Observable<PurchaseDto> {
    return this.http.get<PurchaseDto>(`${this.baseUrl}/${id}`);
  }

  createPurchase(payload: CreatePurchaseRequest): Observable<PurchaseDto> {
    return this.http.post<PurchaseDto>(this.baseUrl, payload);
  }

  updatePurchase(payload: UpdatePurchaseRequest): Observable<PurchaseDto> {
    return this.http.put<PurchaseDto>(this.baseUrl, payload);
  }

  deletePurchase(id: string): Observable<void> {
    return this.http.request<void>('delete', this.baseUrl, {
      body: { id }
    });
  }
}
