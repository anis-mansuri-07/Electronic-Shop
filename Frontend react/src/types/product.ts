export interface Product {
  id: number;
  title: string;
  description: string;
  mrpPrice: number;
  sellingPrice: number;
  discountPercent: number;
  quantity: number;
  color: string;
  brand: string;
  images: string[];
  category: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductSearchParams {
  category?: string;
  brand?: string;
  colors?: string;
  minPrice?: number;
  maxPrice?: number;
  minDiscount?: number;
  sort?: string;
  pageNumber?: number;
}

export interface ProductCreateRequest {
  title: string;
  description: string;
  mrpPrice: number;
  sellingPrice: number;
  quantity: number;
  color: string;
  brand: string;
  category: string;
}

export interface ProductPage {
  content: Product[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface FilterOptions {
  categories: string[];
  brands: string[];
  colors: string[];
  minPrice: number;
  maxPrice: number;
}
