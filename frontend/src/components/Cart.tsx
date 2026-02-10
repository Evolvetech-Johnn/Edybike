import { FC } from 'react';
import { useCart } from '../context/CartContext';
import { useFrete } from '../hooks/useFrete';
import { useNavigate } from 'react-router-dom';
// @ts-ignore - Dados ainda sendo migrados se necessário, mas já estão em TS agora
import { formatPrice } from '../data/categoryProducts';
import { FaTimes, FaPlus, FaMinus, FaTrash, FaShoppingBag } from 'react-icons/fa';
import CEPInput from './CEPInput';
import ShippingOptions from './ShippingOptions';
import { showSuccessToast, showInfoToast, showErrorToast } from './ToastProvider';

const Cart: FC = () => {
  const navigate = useNavigate();
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

  const {
    opcoesFrete,
    freteSelecionado,
    loading: freteLoading,
    erro: freteErro,
    calcularFrete,
    selecionarFrete
  } = useFrete();

  if (!isOpen) return null;

  const subtotal = getCartTotal();
  const valorFrete = freteSelecionado?.valor || 0;
  const total = subtotal + valorFrete;

  // Calcular peso total (assumir 2kg por item se não tiver peso)
  const pesoTotal = items.reduce((acc, item) => acc + ((item.weight || 2) * item.quantity), 0);

  const handleCalcularFrete = (cep: string) => {
    if (items.length === 0) {
      showErrorToast('Adicione produtos ao carrinho primeiro');
      return;
    }

    calcularFrete({
      cep,
      pesoTotal,
      valorTotal: subtotal
    });
  };

  const handleRemoverItem = (id: string, nome: string) => {
    removeFromCart(id);
    showInfoToast(`${nome} removido do carrinho`);
  };

  const handleLimparCarrinho = () => {
    if (items.length === 0) return;
    
    clearCart();
    showSuccessToast('Carrinho limpo com sucesso!');
  };

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

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
                </div>

                {/* Remove Button */}
                <button
                  className="cart-remove-btn"
                  onClick={() => handleRemoverItem(item.id, item.name)}
                  aria-label="Remover produto"
                >
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Frete Section */}
        {items.length > 0 && (
          <>
            <CEPInput 
              onCalculate={handleCalcularFrete}
              loading={freteLoading}
            />
            
            {freteErro && (
              <div className="frete-erro">
                <p>{freteErro}</p>
              </div>
            )}

            {opcoesFrete.length > 0 && (
              <div className="shipping-options-container">
                <ShippingOptions
                  opcoes={opcoesFrete}
                  selecionado={freteSelecionado}
                  onSelect={selecionarFrete}
                  loading={freteLoading}
                />
              </div>
            )}
          </>
        )}

        {/* Footer/Summary */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="order-summary">
              <div className="summary-line">
                <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'itens'})</span>
                <span>R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              
              {freteSelecionado && (
                <div className="summary-line">
                  <span>Frete ({freteSelecionado.transportadora})</span>
                  <span>R$ {valorFrete.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}
              
              <div className="summary-total">
                <span>Total</span>
                <span>R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            <button 
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={handleCheckout}
            >
              Finalizar Compra
            </button>

            <button 
              className="btn-clear-cart"
              onClick={handleLimparCarrinho}
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
