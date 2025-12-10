export enum UserRole {
  Employee = 0,
  Analyst = 1,
  Admin = 2
}

export interface UserDto {
  id: string;
  name: string;
  surname: string;
  role: UserRole;
  email: string;
}

export interface CreateUserRequest {
  name: string;
  surname: string;
  role: UserRole;
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  id: string;
  name: string;
  surname: string;
  role: UserRole;
  email: string;
}
