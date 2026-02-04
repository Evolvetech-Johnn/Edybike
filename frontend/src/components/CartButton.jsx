import { useCart } from '../context/CartContext';
import { FaShoppingCart } from 'react-icons/fa';

const CartButton = () => {
  const { getCartCount, toggleCart } = useCart();
  const count = getCartCount();

  return (
    <button 
      className="cart-button"
      onClick={toggleCart}
      aria-label="Abrir carrinho"
    >
      <FaShoppingCart style={{ fontSize: '1.5rem' }} />
      {count > 0 && (
        <span className="cart-badge">{count}</span>
      )}
    </button>
  );
};

export default CartButton;
