export * from './product';
export * from './category';
export * from './cart';

export interface Product {
  id: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  imageUrl: string | null;
  brand: string;
  category: {
    _id?: string;
    name: string;
  } | string;
  model: string;
  inStock: boolean;
  stock: number;
}
