import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ProductsTab from './ProductsTab.tsx';
import CategoriesTab from './CategoriesTab.tsx';

const AdminDashboard = () => {
  const location = useLocation();
  const currentTab = location.pathname.split('/')[2] || 'products';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container py-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Painel Administrativo</h1>
          
          <nav className="flex gap-4">
            <Link
              to="/admin/products"
              className={`btn ${currentTab === 'products' ? 'btn-primary' : 'btn-outline'}`}
            >
              Produtos
            </Link>
            <Link
              to="/admin/categories"
              className={`btn ${currentTab === 'categories' ? 'btn-primary' : 'btn-outline'}`}
            >
              Categorias
            </Link>
          </nav>
        </div>
      </div>

      <div className="container py-8">
        <Routes>
          <Route path="products" element={<ProductsTab />} />
          <Route path="categories" element={<CategoriesTab />} />
          <Route path="/" element={<ProductsTab />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
