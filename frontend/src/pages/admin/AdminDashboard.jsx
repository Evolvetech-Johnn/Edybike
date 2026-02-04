import { useState } from 'react';
import ProductsTab from './ProductsTab';
import CategoriesTab from './CategoriesTab';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Painel Administrativo</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
        <button 
          onClick={() => setActiveTab('products')}
          style={{
            padding: '1rem 2rem',
            background: 'transparent',
            borderBottom: activeTab === 'products' ? '2px solid var(--primary-color)' : '2px solid transparent',
            color: activeTab === 'products' ? 'var(--primary-color)' : 'var(--text-muted)',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}
        >
          Produtos
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          style={{
            padding: '1rem 2rem',
            background: 'transparent',
            borderBottom: activeTab === 'categories' ? '2px solid var(--primary-color)' : '2px solid transparent',
            color: activeTab === 'categories' ? 'var(--primary-color)' : 'var(--text-muted)',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}
        >
          Categorias
        </button>
      </div>

      <div>
        {activeTab === 'products' ? <ProductsTab /> : <CategoriesTab />}
      </div>
    </div>
  );
};

export default AdminDashboard;
