import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag } from 'react-icons/fa';

const OrderSuccess: FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ color: 'var(--success)', marginBottom: '1rem' }}>
                <FaCheckCircle size={80} />
            </div>
            
            <h1 style={{ marginBottom: '1rem', color: 'var(--text)' }}>Pedido Realizado com Sucesso!</h1>
            
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Obrigado por sua compra. O número do seu pedido é: 
                <br />
                <strong style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>#{id}</strong>
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button 
                    onClick={() => navigate('/')} 
                    className="btn btn-primary"
                    style={{ padding: '0.8rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <FaShoppingBag /> Continuar Comprando
                </button>
                
                <button 
                    onClick={() => navigate('/admin/orders')} 
                    className="btn btn-outline"
                    style={{ padding: '0.8rem 2rem' }}
                >
                    Ver Meus Pedidos
                </button>
            </div>
        </div>
    );
};

export default OrderSuccess;
