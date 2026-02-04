export interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  price: number;
  image: string;
  features: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
}

export interface ProductWithDiscount extends Product {
  originalPrice: number;
  discount: number;
}
