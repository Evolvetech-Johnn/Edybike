import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import KPICard from '../../components/admin/KPICard';
import { FaShoppingCart, FaDollarSign, FaClock, FaCheckCircle } from 'react-icons/fa';
import api from '../../services/api';
import '../../styles/admin.css';

interface Order {
  _id: string;
  cliente: {
    nome?: string;
    email: string;
  };
  total: number;
  status: string;
  createdAt: string;
  pagamento?: {
    status: string;
  };
  items?: { quantity: number }[];
}

interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
}

const OrdersList: FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    minValue: '',
    maxValue: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    loadOrders();
    loadStats();
  }, [filters, pagination.page]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.status && { status: filters.status }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.minValue && { minValue: filters.minValue }),
        ...(filters.maxValue && { maxValue: filters.maxValue }),
        ...(filters.search && { search: filters.search })
      });

      const response = await api.get(`/admin/orders?${params}`);
      
      setOrders(response.data.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        pages: response.data.pagination.pages
      }));
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await api.get('/admin/orders/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'danger' | 'primary' => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('entregue') || statusLower.includes('aprovado')) return 'success';
    if (statusLower.includes('pendente') || statusLower.includes('aguardando')) return 'warning';
    if (statusLower.includes('cancelado') || statusLower.includes('recusado')) return 'danger';
    return 'primary';
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div style={{ marginBottom: 'var(--admin-spacing-xl)' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Pedidos
        </h1>
        <p style={{ color: 'var(--admin-text-secondary)' }}>
          Gerencie todos os pedidos da loja
        </p>
      </div>

      {/* KPIs */}
      <div className="admin-grid admin-grid-4 admin-mb-xl">
        <KPICard
          title="Total de Pedidos"
          value={stats?.totalOrders || 0}
          icon={<FaShoppingCart />}
          variant="primary"
          label="todos os tempos"
        />

        <KPICard
          title="Faturamento Total"
          value={formatCurrency(stats?.totalRevenue || 0)}
          icon={<FaDollarSign />}
          variant="success"
          label="valor aprovado"
        />

        <KPICard
          title="Pedidos Pendentes"
          value={stats?.pendingOrders || 0}
          icon={<FaClock />}
          variant="warning"
          label="aguardando ação"
        />

        <KPICard
          title="Pedidos Concluídos"
          value={stats?.completedOrders || 0}
          icon={<FaCheckCircle />}
          variant="success"
          label="entregues"
        />
      </div>

      {/* Filtros */}
      <div className="admin-filter-bar">
        <input
          type="text"
          placeholder="Buscar por cliente, email, ID..."
          className="admin-filter-input"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />

        <select
          className="admin-filter-input"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          style={{ minWidth: '180px' }}
        >
          <option value="">Todos os Status</option>
          <option value="AGUARDANDO_PAGAMENTO">Aguardando Pagamento</option>
          <option value="PAGAMENTO_APROVADO">Pagamento Aprovado</option>
          <option value="EM_SEPARACAO">Em Separação</option>
          <option value="ENVIADO">Enviado</option>
          <option value="ENTREGUE">Entregue</option>
          <option value="CANCELADO">Cancelado</option>
        </select>

        <input
          type="date"
          className="admin-filter-input"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          placeholder="Data Início"
        />

        <input
          type="date"
          className="admin-filter-input"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          placeholder="Data Fim"
        />

        <input
          type="number"
          className="admin-filter-input"
          value={filters.minValue}
          onChange={(e) => setFilters({ ...filters, minValue: e.target.value })}
          placeholder="Valor Mín."
          style={{ maxWidth: '120px' }}
        />

        <input
          type="number"
          className="admin-filter-input"
          value={filters.maxValue}
          onChange={(e) => setFilters({ ...filters, maxValue: e.target.value })}
          placeholder="Valor Máx."
          style={{ maxWidth: '120px' }}
        />

        <button
          className="admin-btn admin-btn-outline"
          onClick={() => setFilters({
            status: '',
            startDate: '',
            endDate: '',
            minValue: '',
            maxValue: '',
            search: ''
          })}
        >
          Limpar
        </button>
      </div>

      {/* Tabela */}
      <DataTable
        columns={[
          {
            key: '_id',
            label: 'Pedido',
            render: (value) => (
              <div style={{ fontWeight: '600', fontFamily: 'monospace' }}>
                #{value.substring(0, 8)}
              </div>
            )
          },
          {
            key: 'createdAt',
            label: 'Data/Hora',
            render: (value) => (
              <div style={{ fontSize: '0.875rem' }}>
                {formatDate(value)}
              </div>
            )
          },
          {
            key: 'cliente',
            label: 'Cliente',
            render: (value) => (
              <div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                  {value?.nome || 'N/A'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                  {value?.email}
                </div>
              </div>
            )
          },
          {
            key: 'items',
            label: 'Itens',
            render: (value) => (
              <div style={{ textAlign: 'center' }}>
                {value?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0}
              </div>
            )
          },
          {
            key: 'total',
            label: 'Valor',
            render: (value) => (
              <div style={{ fontWeight: '600' }}>
                {formatCurrency(value)}
              </div>
            )
          },
          {
            key: 'status',
            label: 'Status',
            render: (value, row) => (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <StatusBadge status={value} variant={getStatusVariant(value)} />
                {row.pagamento?.status && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                    Pag: {row.pagamento.status}
                  </div>
                )}
              </div>
            )
          },
          {
            key: '_id',
            label: 'Ações',
            render: (value) => (
              <Link
                to={`/admin/orders/${value}`}
                className="admin-btn admin-btn-sm admin-btn-primary"
              >
                Ver Detalhes
              </Link>
            )
          }
        ]}
        data={orders}
        loading={loading}
        emptyMessage="Nenhum pedido encontrado"
      />

      {/* Paginação */}
      {pagination.pages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          marginTop: 'var(--admin-spacing-xl)'
        }}>
          <button
            className="admin-btn admin-btn-outline"
            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
            disabled={pagination.page === 1}
          >
            Anterior
          </button>
          
          <span style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 1rem',
            color: 'var(--admin-text-secondary)'
          }}>
            Página {pagination.page} de {pagination.pages}
          </span>
          
          <button
            className="admin-btn admin-btn-outline"
            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
            disabled={pagination.page === pagination.pages}
          >
            Próxima
          </button>
        </div>
      )}
    </AdminLayout>
  );
};

export default OrdersList;
