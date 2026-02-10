import { FC, useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import { FaArrowUp, FaArrowDown, FaExchangeAlt } from 'react-icons/fa';
import api from '../../services/api';
import '../../styles/admin.css';

interface StockMovement {
  _id: string;
  productId: {
    _id: string;
    name: string;
    sku?: string;
  };
  type: 'entrada' | 'saida' | 'ajuste' | 'venda' | 'devolucao';
  quantity: number;
  reason: string;
  userId: {
    name?: string;
    email: string;
  };
  previousStock: number;
  newStock: number;
  createdAt: string;
}

const StockMovements: FC = () => {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    loadMovements();
  }, [filters, pagination.page]);

  const loadMovements = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.type && { type: filters.type }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      });

      const response = await api.get(`/admin/inventory/movements?${params}`);
      
      setMovements(response.data.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        pages: response.data.pagination.pages
      }));
    } catch (error) {
      console.error('Erro ao carregar movimentações:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'entrada':
      case 'devolucao':
        return <FaArrowUp style={{ color: 'var(--admin-success)' }} />;
      case 'saida':
      case 'venda':
        return <FaArrowDown style={{ color: 'var(--admin-danger)' }} />;
      case 'ajuste':
        return <FaExchangeAlt style={{ color: 'var(--admin-warning)' }} />;
      default:
        return null;
    }
  };

  const getMovementVariant = (type: string): 'success' | 'danger' | 'warning' | 'primary' => {
    switch (type) {
      case 'entrada':
      case 'devolucao':
        return 'success';
      case 'saida':
      case 'venda':
        return 'danger';
      case 'ajuste':
        return 'warning';
      default:
        return 'primary';
    }
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

  return (
    <AdminLayout>
      {/* Header */}
      <div style={{ marginBottom: 'var(--admin-spacing-xl)' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Movimentações de Estoque
        </h1>
        <p style={{ color: 'var(--admin-text-secondary)' }}>
          Histórico completo de entradas, saídas e ajustes
        </p>
      </div>

      {/* Filtros */}
      <div className="admin-filter-bar">
        <select
          className="admin-filter-input"
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          style={{ minWidth: '180px' }}
        >
          <option value="">Todos os Tipos</option>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
          <option value="ajuste">Ajuste</option>
          <option value="venda">Venda</option>
          <option value="devolucao">Devolução</option>
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

        <button
          className="admin-btn admin-btn-outline"
          onClick={() => setFilters({ type: '', startDate: '', endDate: '' })}
        >
          Limpar Filtros
        </button>
      </div>

      {/* Tabela */}
      <DataTable
        columns={[
          {
            key: 'createdAt',
            label: 'Data/Hora',
            render: (value) => formatDate(value)
          },
          {
            key: 'productId',
            label: 'Produto',
            render: (value) => (
              <div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                  {value?.name || 'N/A'}
                </div>
                {value?.sku && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                    SKU: {value.sku}
                  </div>
                )}
              </div>
            )
          },
          {
            key: 'type',
            label: 'Tipo',
            render: (value) => (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {getMovementIcon(value)}
                <StatusBadge 
                  status={value.toUpperCase()} 
                  variant={getMovementVariant(value)}
                />
              </div>
            )
          },
          {
            key: 'quantity',
            label: 'Quantidade',
            render: (value, row) => (
              <div style={{
                fontWeight: '600',
                color: row.type === 'entrada' || row.type === 'devolucao' 
                  ? 'var(--admin-success)' 
                  : row.type === 'saida' || row.type === 'venda'
                  ? 'var(--admin-danger)'
                  : 'inherit'
              }}>
                {(row.type === 'entrada' || row.type === 'devolucao') ? '+' : ''}
                {value}
              </div>
            )
          },
          {
            key: 'previousStock',
            label: 'Antes',
            render: (value) => (
              <div style={{ color: 'var(--admin-text-muted)' }}>{value}</div>
            )
          },
          {
            key: 'newStock',
            label: 'Depois',
            render: (value) => (
              <div style={{ fontWeight: '600' }}>{value}</div>
            )
          },
          {
            key: 'reason',
            label: 'Motivo',
            render: (value) => (
              <div style={{ 
                maxWidth: '200px', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }} title={value}>
                {value}
              </div>
            )
          },
          {
            key: 'userId',
            label: 'Responsável',
            render: (value) => (
              <div style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)' }}>
                {value?.name || value?.email || 'Sistema'}
              </div>
            )
          }
        ]}
        data={movements}
        loading={loading}
        emptyMessage="Nenhuma movimentação encontrada"
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

export default StockMovements;
