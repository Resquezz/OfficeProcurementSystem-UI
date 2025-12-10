import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Budget, CreateBudgetRequest, UpdateBudgetRequest } from '../interfaces/budgets.model';

@Injectable({ providedIn: 'root' })
export class BudgetsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/Budgets';

  getBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(this.baseUrl);
  }

  getBudget(id: string): Observable<Budget> {
    return this.http.get<Budget>(`${this.baseUrl}/${id}`);
  }

  createBudget(payload: CreateBudgetRequest): Observable<Budget> {
    return this.http.post<Budget>(this.baseUrl, payload);
  }

  updateBudget(payload: UpdateBudgetRequest): Observable<Budget> {
    return this.http.put<Budget>(this.baseUrl, payload);
  }

  deleteBudget(id: string): Observable<void> {
    return this.http.request<void>('delete', this.baseUrl, {
      body: { id }
    });
  }
}