import { FC, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useFrete } from '../hooks/useFrete';
import { formatPrice } from '../data/categoryProducts';
import CEPInput from '../components/CEPInput';
import ShippingOptions from '../components/ShippingOptions';
import { showSuccessToast, showErrorToast } from '../components/ToastProvider';
import api from '../services/api';
import '../styles/checkout.css';

const Checkout: FC = () => {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCart();
  const {
    opcoesFrete,
    freteSelecionado,
    loading: freteLoading,
    erro: freteErro,
    calcularFrete,
    selecionarFrete
  } = useFrete();

  const [address, setAddress] = useState({
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    complement: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);

  const subtotal = getCartTotal();
  const shippingCost = freteSelecionado?.valor || 0;
  const total = subtotal + shippingCost;

  // Mock freight calculation wrapper
  const handleCalculateFreight = (cep: string) => {
    // In a real app, this would use the item weights
    const pesoTotal = items.reduce((acc, item) => acc + ((item.weight || 2) * item.quantity), 0);
    calcularFrete({ cep, pesoTotal, valorTotal: subtotal });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!freteSelecionado) {
      showErrorToast('Por favor, selecione uma opção de frete');
      return;
    }

    if (!paymentMethod) {
      showErrorToast('Por favor, selecione um método de pagamento');
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        items: items.map(item => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shipping: {
          address,
          method: freteSelecionado.transportadora,
          cost: shippingCost
        },
        payment: {
          method: paymentMethod,
          total
        }
      };

      // Call API (will likely fail locally without DB, but logic is sound)
      const response = await api.post('/orders', orderData);
      
      clearCart();
      showSuccessToast('Pedido realizado com sucesso!');
      navigate(`/order-success/${response.data._id}`);

    } catch (error: any) {
      console.error('Error placing order:', error);
      // Fallback for demo purposes if backend is down/no DB
      if (import.meta.env.DEV) {
          showErrorToast('Erro ao conectar com servidor. (Modo Dev: Simulando sucesso)');
          clearCart();
          setTimeout(() => navigate('/order-success/demo-order-123'), 1000);
      } else {
        showErrorToast('Erro ao processar pedido. Tente novamente.');
      }
    } finally {
        setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        <h2>Seu carrinho está vazio</h2>
        <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Voltar para Loja
        </button>
      </div>
    );
  }

  return (
    <div className="container checkout-page" style={{ padding: '2rem 0' }}>
      <h1 style={{ marginBottom: '2rem' }}>Finalizar Compra</h1>
      
      <div className="checkout-grid">
        {/* Left Column: Forms */}
        <div className="checkout-left">
          {/* Shipping Section */}
          <section className="checkout-section">
            <h2>1. Entrega</h2>
            <CEPInput onCalculate={handleCalculateFreight} loading={freteLoading} />
            
            {freteErro && <p className="error-text">{freteErro}</p>}
            
            {opcoesFrete.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <ShippingOptions 
                    opcoes={opcoesFrete} 
                    selecionado={freteSelecionado} 
                    onSelect={selecionarFrete} 
                    loading={freteLoading}
                />
              </div>
            )}

            {freteSelecionado && (
                <div className="address-form" style={{ marginTop: '1.5rem' }}>
                    <h3>Endereço de Entrega</h3>
                    <div className="form-grid">
                        <input 
                            type="text" 
                            placeholder="Rua" 
                            className="input-field"
                            value={address.street}
                            onChange={e => setAddress({...address, street: e.target.value})}
                            required
                        />
                        <input 
                            type="text" 
                            placeholder="Número" 
                            className="input-field"
                            style={{ width: '100px' }}
                            value={address.number}
                            onChange={e => setAddress({...address, number: e.target.value})}
                            required
                        />
                         <input 
                            type="text" 
                            placeholder="Complemento" 
                            className="input-field"
                            value={address.complement}
                            onChange={e => setAddress({...address, complement: e.target.value})}
                        />
                    </div>
                </div>
            )}
          </section>

          {/* Payment Section */}
          <section className="checkout-section" style={{ marginTop: '2rem' }}>
            <h2>2. Pagamento</h2>
            <div className="payment-options">
              <label className={`payment-option ${paymentMethod === 'credit_card' ? 'selected' : ''}`}>
                <input 
                    type="radio" 
                    name="payment" 
                    value="credit_card"
                    checked={paymentMethod === 'credit_card'}
                    onChange={e => setPaymentMethod(e.target.value)}
                />
                <span>Cartão de Crédito</span>
              </label>
              
              <label className={`payment-option ${paymentMethod === 'pix' ? 'selected' : ''}`}>
                <input 
                    type="radio" 
                    name="payment" 
                    value="pix"
                    checked={paymentMethod === 'pix'}
                    onChange={e => setPaymentMethod(e.target.value)}
                />
                <span>PIX</span>
              </label>

              <label className={`payment-option ${paymentMethod === 'boleto' ? 'selected' : ''}`}>
                <input 
                    type="radio" 
                    name="payment" 
                    value="boleto"
                    checked={paymentMethod === 'boleto'}
                    onChange={e => setPaymentMethod(e.target.value)}
                />
                <span>Boleto Bancário</span>
              </label>
            </div>
          </section>
        </div>

        {/* Right Column: Summary */}
        <div className="checkout-right">
          <section className="order-summary-card">
            <h2>Resumo do Pedido</h2>
            <div className="summary-items">
              {items.map(item => (
                <div key={item.id} className="summary-item">
                  <span>{item.quantity}x {item.name}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            
            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Frete</span>
                <span>{shippingCost > 0 ? formatPrice(shippingCost) : 'Calculando...'}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <button 
                onClick={handleSubmitOrder} 
                className="btn btn-primary btn-block"
                disabled={loading || !freteSelecionado || !paymentMethod}
                style={{ marginTop: '1.5rem', width: '100%' }}
            >
                {loading ? 'Processando...' : 'Confirmar Pedido'}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
