// Type declarations for JS files without TypeScript
declare module '*/api' {
  import { AxiosInstance } from 'axios';
  const api: AxiosInstance;
  export default api;
}

declare module '*/mockProducts' {
  import { Product, Category } from './types';
  export const mockProducts: Product[];
  export const mockCategories: Category[];
}
