export interface WishlistProduct {
  id: number;
  title: string;
  description: string;
  mrpPrice: number;
  sellingPrice: number;
  color: string;
  images: string[];
  category: string;
}

export interface WishlistResponse {
  userId: number;
  products: WishlistProduct[];
}

export interface WishlistState {
  items: WishlistProduct[];
  isLoading: boolean;
  error: string | null;
}
