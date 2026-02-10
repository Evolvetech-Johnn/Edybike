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

// Type declarations for image files
declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

declare module '*.webp' {
  const value: string;
  export default value;
}

declare module '*.gif' {
  const value: string;
  export default value;
}
