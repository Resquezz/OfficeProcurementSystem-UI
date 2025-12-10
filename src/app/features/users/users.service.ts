import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateUserRequest, UpdateUserRequest, UserDto } from './users.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/Users';

  getUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.baseUrl);
  }

  getUser(id: string): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.baseUrl}/${id}`);
  }

  createUser(payload: CreateUserRequest): Observable<UserDto> {
    return this.http.post<UserDto>(this.baseUrl, payload);
  }

  updateUser(payload: UpdateUserRequest): Observable<UserDto> {
    return this.http.put<UserDto>(this.baseUrl, payload);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.request<void>('delete', this.baseUrl, {
      body: { id }
    });
  }
}
