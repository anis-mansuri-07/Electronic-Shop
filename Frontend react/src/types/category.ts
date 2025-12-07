export interface CategoryResponse {
  id: number;
  categoryName: string;
  imageUrl: string | null;
  productCount: number;
}

export interface CategoryRequest {
  categoryName: string;
  imageUrl?: string | null;
}
