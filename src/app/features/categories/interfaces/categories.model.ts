export interface CategoryDto {
  id: string;
  name: string;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  id: string;
  name: string;
}