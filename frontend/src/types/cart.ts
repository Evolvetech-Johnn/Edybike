import { Product } from './product';

export interface CartItem extends Product {
  quantity: number;
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
