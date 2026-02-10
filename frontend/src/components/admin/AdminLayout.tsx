import { FC, ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaBox,
  FaShoppingCart,
  FaChartLine,
  FaTags,
  FaUsers,
  FaCog,
  FaWarehouse,
  FaBars,
  FaSignOutAlt
} from 'react-icons/fa';
import '../styles/admin.css';

interface AdminLayoutProps {
  children: ReactNode;
}

interface NavItem {
  path: string;
  label: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: <FaHome /> },
  { path: '/admin/products', label: 'Produtos', icon: <FaBox /> },
  { path: '/admin/inventory', label: 'Estoque', icon: <FaWarehouse /> },
  { path: '/admin/orders', label: 'Pedidos', icon: <FaShoppingCart /> },
  { path: '/admin/analytics', label: 'Análises', icon: <FaChartLine /> },
  { path: '/admin/promotions', label: 'Promoções', icon: <FaTags /> },
  { path: '/admin/users', label: 'Usuários', icon: <FaUsers /> },
  { path: '/admin/settings', label: 'Configurações', icon: <FaCog /> },
];

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleLogout = () => {
    // Limpar token e redirecionar
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin/login';
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'show-mobile' : ''}`}>
        <div className="admin-sidebar-header">
          <span className="admin-sidebar-logo">⚡ Edy Bike</span>
          <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>Admin</span>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div style={{ padding: 'var(--admin-spacing-lg)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={handleLogout}
            className="admin-nav-item"
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            <span className="admin-nav-icon"><FaSignOutAlt /></span>
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`admin-main ${sidebarCollapsed ? 'expanded' : ''}`}>
        {/* Header */}
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="admin-btn admin-btn-icon admin-btn-outline"
              onClick={() => {
                setSidebarCollapsed(!sidebarCollapsed);
                setMobileMenuOpen(!mobileMenuOpen);
              }}
            >
              <FaBars />
            </button>
            <h1 className="admin-header-title">
              {navItems.find(item => isActive(item.path))?.label || 'Admin'}
            </h1>
          </div>

          <div className="admin-header-actions">
            <span style={{ color: 'var(--admin-text-secondary)', fontSize: '0.875rem' }}>
              {JSON.parse(localStorage.getItem('user') || '{}')?.email || 'Admin'}
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
