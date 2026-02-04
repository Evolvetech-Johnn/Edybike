import { FC } from 'react';
import { FaTruck, FaCreditCard } from 'react-icons/fa';

const TopBar: FC = () => {
    return (
        <div style={{ backgroundColor: '#111827', color: 'white', fontSize: '0.8rem', padding: '0.5rem 0' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <FaTruck style={{ color: 'var(--primary-color)' }} /> Frete Grátis para todo Sul e Sudeste*
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <FaCreditCard style={{ color: 'var(--primary-color)' }} /> Até 12x sem juros no cartão
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}>Central de Atendimento</a>
                    <a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}>Rastrear Pedido</a>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
