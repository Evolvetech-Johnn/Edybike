import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { FaPlus, FaEdit, FaTrash, FaTag, FaPowerOff } from 'react-icons/fa';
import api from '../../services/api';
import '../../styles/admin.css';

interface Promotion {
  _id: string;
  name: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  products: any[];
  categories: any[];
  usageCount: number;
  computedStatus: {
    label: string;
    variant: string;
  };
}

interface Stats {
  total: number;
  active: number;
  scheduled: number;
  totalUsage: number;
}

const PromotionsList: FC = () => {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, scheduled: 0, totalUsage: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });

  useEffect(() => {
    loadData();
  }, [filters.status]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [promotionsRes, statsRes] = await Promise.all([
        api.get('/admin/promotions', { params: filters }),
        api.get('/admin/promotions/stats')
      ]);
      setPromotions(promotionsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Erro ao carregar promoções:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleToggleActive = async (id: string) => {
    try {
      await api.patch(`/admin/promotions/${id}/toggle-active`);
      loadData();
    } catch (error) {
      console.error('Erro ao alternar status:', error);
      alert('Erro ao alternar status da promoção');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja deletar a promoção "${name}"?`)) {
      return;
    }

    try {
      await api.delete(`/admin/promotions/${id}`);
      loadData();
    } catch (error) {
      console.error('Erro ao deletar promoção:', error);
      alert('Erro ao deletar promoção');
    }
  };

  const handleApplyToProducts = async (id: string, name: string) => {
    if (!confirm(`Aplicar promoção "${name}" aos produtos agora?`)) {
      return;
    }

    try {
      const response = await api.post(`/admin/promotions/${id}/apply-to-products`);
      alert(response.data.message);
      loadData();
    } catch (error) {
      console.error('Erro ao aplicar promoção:', error);
      alert('Erro ao aplicar promoção');
    }
  };

  const getStatusBadgeClass = (variant: string) => {
    const map: Record<string, string> = {
      success: 'admin-badge success',
      info: 'admin-badge info',
      danger: 'admin-badge danger',
      secondary: 'admin-badge'
    };
    return map[variant] || 'admin-badge';
  };

  const getApplyToText = (promo: Promotion) => {
    if (promo.products.length > 0) {
      return `${promo.products.length} produto(s)`;
    }
    if (promo.categories.length > 0) {
      return `Categoria`;
    }
    return 'Todos os produtos';
  };

  const formatDiscountValue = (type: string, value: number) => {
    return type === 'percentage' ? `${value}%` : `R$ ${value.toFixed(2)}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--admin-spacing-xl)' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              Promoções
            </h1>
            <p style={{ color: 'var(--admin-text-secondary)' }}>
              Gerencie campanhas promocionais e descontos
            </p>
          </div>
          <button
            className="admin-btn admin-btn-primary"
            onClick={() => navigate('/admin/promotions/new')}
          >
            <FaPlus /> Nova Promoção
          </button>
        </div>

        {/* KPIs */}
        <div className="admin-grid admin-grid-4" style={{ marginBottom: 'var(--admin-spacing-xl)' }}>
          <div className="kpi-card">
            <div className="kpi-card-header">
              <span className="kpi-card-title">Total</span>
              <div className="kpi-card-icon primary">
                <FaTag />
              </div>
            </div>
            <div className="kpi-card-value">{stats.total}</div>
            <div className="kpi-card-footer">
              <span className="kpi-card-label">Promoções cadastradas</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-card-header">
              <span className="kpi-card-title">Ativas</span>
              <div className="kpi-card-icon success">
                <FaTag />
              </div>
            </div>
            <div className="kpi-card-value">{stats.active}</div>
            <div className="kpi-card-footer">
              <span className="kpi-card-label">Rodando agora</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-card-header">
              <span className="kpi-card-title">Agendadas</span>
              <div className="kpi-card-icon info">
                <FaTag />
              </div>
            </div>
            <div className="kpi-card-value">{stats.scheduled}</div>
            <div className="kpi-card-footer">
              <span className="kpi-card-label">Futuras</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-card-header">
              <span className="kpi-card-title">Uso Total</span>
              <div className="kpi-card-icon warning">
                <FaTag />
              </div>
            </div>
            <div className="kpi-card-value">{stats.totalUsage}</div>
            <div className="kpi-card-footer">
              <span className="kpi-card-label">Aplicações</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="admin-filter-bar">
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 'var(--admin-spacing-md)', flex: 1, flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Buscar por nome..."
              className="admin-filter-input"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              style={{ flex: 1, minWidth: '200px' }}
            />

            <select
              className="admin-filter-input"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              style={{ minWidth: '150px' }}
            >
              <option value="">Todos Status</option>
              <option value="active">Ativas</option>
              <option value="inactive">Inativas</option>
              <option value="scheduled">Agendadas</option>
              <option value="expired">Expiradas</option>
            </select>

            <button type="submit" className="admin-btn admin-btn-primary">
              Filtrar
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Desconto</th>
                <th>Período</th>
                <th>Status</th>
                <th>Aplicação</th>
                <th>Uso</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                    Carregando...
                  </td>
                </tr>
              ) : promotions.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                    Nenhuma promoção encontrada
                  </td>
                </tr>
              ) : (
                promotions.map((promo) => (
                  <tr key={promo._id}>
                    <td>
                      <div>
                        <strong>{promo.name}</strong>
                        {promo.description && (
                          <div style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)', marginTop: '0.25rem' }}>
                            {promo.description.substring(0, 50)}{promo.description.length > 50 ? '...' : ''}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={promo.discountType === 'percentage' ? 'admin-badge success' : 'admin-badge warning'}>
                        {formatDiscountValue(promo.discountType, promo.discountValue)}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.875rem' }}>
                        {formatDate(promo.startDate)} - {formatDate(promo.endDate)}
                      </div>
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(promo.computedStatus.variant)}>
                        {promo.computedStatus.label}
                      </span>
                    </td>
                    <td>{getApplyToText(promo)}</td>
                    <td>{promo.usageCount}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          className="admin-btn admin-btn-sm admin-btn-icon"
                          onClick={() => handleApplyToProducts(promo._id, promo.name)}
                          title="Aplicar em produtos"
                          style={{ backgroundColor: 'var(--admin-success)', color: 'white' }}
                        >
                          <FaTag size={14} />
                        </button>
                        <button
                          className="admin-btn admin-btn-sm admin-btn-icon"
                          onClick={() => handleToggleActive(promo._id)}
                          title={promo.isActive ? 'Desativar' : 'Ativar'}
                        >
                          <FaPowerOff size={14} />
                        </button>
                        <button
                          className="admin-btn admin-btn-sm admin-btn-icon"
                          onClick={() => navigate(`/admin/promotions/${promo._id}/edit`)}
                          title="Editar"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          className="admin-btn admin-btn-sm admin-btn-icon"
                          onClick={() => handleDelete(promo._id, promo.name)}
                          style={{ backgroundColor: 'var(--admin-danger)', color: 'white' }}
                          title="Deletar"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PromotionsList;
