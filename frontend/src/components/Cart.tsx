import { FC } from 'react';
import { useCart } from '../context/CartContext';
// @ts-ignore - Dados ainda sendo migrados se necessário, mas já estão em TS agora
import { formatPrice } from '../data/categoryProducts';
import { FaTimes, FaPlus, FaMinus, FaTrash, FaShoppingBag } from 'react-icons/fa';

const Cart: FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="cart-overlay"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="cart-drawer">
        {/* Header */}
        <div className="cart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FaShoppingBag style={{ fontSize: '1.5rem', color: 'var(--primary)' }} />
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
              Carrinho ({getCartCount()})
            </h2>
          </div>
          <button 
            className="cart-close-btn"
            onClick={closeCart}
            aria-label="Fechar carrinho"
          >
            <FaTimes />
          </button>
        </div>

        {/* Items */}
        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <FaShoppingBag style={{ fontSize: '4rem', color: '#d1d5db', marginBottom: '1rem' }} />
              <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>Seu carrinho está vazio</p>
              <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>Adicione produtos para começar!</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="cart-item fade-in">
                {/* Image */}
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>

                {/* Info */}
                <div className="cart-item-info">
                  <h4 className="cart-item-name">{item.name}</h4>
                  <p className="cart-item-brand">{item.brand} • {item.model}</p>
                  <p className="cart-item-price">{formatPrice(item.price)}</p>

                  {/* Quantity Controls */}
                  <div className="cart-item-controls">
                    <button
                      className="cart-qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Diminuir quantidade"
                    >
                      <FaMinus />
                    </button>
                    <span className="cart-qty">{item.quantity}</span>
                    <button
                      className="cart-qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Aumentar quantidade"
                    >
                      <FaPlus />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <p className="cart-item-subtotal">
                    Subtotal: <strong>{formatPrice(item.price * item.quantity)}</strong>
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  className="cart-remove-btn"
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Remover item"
                >
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>Total:</span>
              <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)' }}>
                {formatPrice(getCartTotal())}
              </span>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginBottom: '0.75rem' }}>
              <FaShoppingBag /> Finalizar Compra
            </button>

            <button 
              className="btn btn-outline" 
              style={{ width: '100%' }}
              onClick={clearCart}
            >
              <FaTrash /> Limpar Carrinho
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
