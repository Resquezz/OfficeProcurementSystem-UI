import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryDto, CreateCategoryRequest, UpdateCategoryRequest } from './categories.model';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/Categories';

  getCategories(): Observable<CategoryDto[]> {
    return this.http.get<CategoryDto[]>(this.baseUrl);
  }

  getCategory(id: string): Observable<CategoryDto> {
    return this.http.get<CategoryDto>(`${this.baseUrl}/${id}`);
  }

  createCategory(payload: CreateCategoryRequest): Observable<CategoryDto> {
    return this.http.post<CategoryDto>(this.baseUrl, payload);
  }

  updateCategory(payload: UpdateCategoryRequest): Observable<CategoryDto> {
    return this.http.put<CategoryDto>(this.baseUrl, payload);
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.request<void>('delete', this.baseUrl, {
      body: { id }
    });
  }
}
