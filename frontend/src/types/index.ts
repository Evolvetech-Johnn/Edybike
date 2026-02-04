// Product Types
export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: Category;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// User and Auth Types
export interface User {
  _id: string;
  username: string;
  email?: string;
  role?: 'admin' | 'user';
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
