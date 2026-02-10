import { Product } from './index';

export interface CartItem extends Product {
  quantity: number;
  weight?: number; // Peso em kg para cálculo de frete
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}
