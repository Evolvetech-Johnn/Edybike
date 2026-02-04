import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSearch, FaUser, FaShoppingCart, FaHeart } from 'react-icons/fa';
import CartButton from './CartButton';

const MainHeader: FC = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ backgroundColor: 'white', padding: '1.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>
        
        {/* Logo */}
        <Link to="/" style={{ flexShrink: 0 }}>
             <img 
                src="/logoedybike.png" 
                alt="Edy Bike" 
                style={{ height: '70px', objectFit: 'contain' }}
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display='none'; 
                    (target.nextSibling as HTMLElement).style.display='block';
                }}
            />
             <span style={{ display: 'none', fontSize: '2rem', fontWeight: 800, color: 'var(--primary-color)' }}>
                Edy<span style={{ color: 'var(--secondary-color)' }}>Bike</span>
             </span>
        </Link>

        {/* Search Bar - Big & Central */}
        <div style={{ flex: 1, position: 'relative' }}>
            <input 
                type="text" 
                placeholder="Busque por produto, categoria ou marca..." 
                style={{ 
                    width: '100%', 
                    padding: '0.85rem 1rem 0.85rem 3rem', 
                    borderRadius: '8px', /* More square/modern than pill for this style */
                    border: '2px solid var(--primary-color)',
                    fontSize: '1rem',
                    backgroundColor: '#fff'
                }}
            />
            <FaSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-color)', fontSize: '1.2rem' }} />
            <button style={{ 
                position: 'absolute', 
                right: '5px', 
                top: '5px', 
                bottom: '5px', 
                backgroundColor: 'var(--primary-color)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px',
                padding: '0 1.5rem',
                fontWeight: 'bold',
                cursor: 'pointer'
            }}>
                Buscar
            </button>
        </div>

        {/* Account & Cart Actions */}
        <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-main)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <FaHeart size={24} color="var(--text-light)" />
            </div>

            <CartButton />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', paddingLeft: '1.5rem', borderLeft: '1px solid #e5e7eb' }}>
                <div style={{ backgroundColor: '#f3f4f6', padding: '0.5rem', borderRadius: '50%' }}>
                    <FaUser size={20} color="var(--text-secondary)" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                        {user ? `Olá, ${user.role}` : 'Bem vindo(a)'}
                    </span>
                    {user && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Link to="/admin" style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Painel</Link>
                            <span onClick={logout} style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--secondary-color)', cursor: 'pointer' }}>Sair</span>
                        </div>
                    )}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default MainHeader;
