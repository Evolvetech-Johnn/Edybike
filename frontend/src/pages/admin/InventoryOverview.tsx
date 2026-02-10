import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import KPICard from '../../components/admin/KPICard';
import { FaBox, FaExclamationTriangle, FaBoxes, FaDollarSign, FaPlus } from 'react-icons/fa';
import api from '../../services/api';
import '../../styles/admin.css';

interface Product {
  _id: string;
  name: string;
  stock: number;
  category?: { name: string };
  price: number;
  sku: string;
  imageUrl?: string;
  images?: { url: string }[];
}

interface InventoryStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalStockValue: number;
}

const InventoryOverview: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(5);
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('low');

  useEffect(() => {
    loadInventoryData();
  }, [threshold, filter]);

  const loadInventoryData = async () => {
    try {
      setLoading(true);
      
      const [currentStockRes, statsRes] = await Promise.all([
        api.get(`/admin/inventory/current?threshold=${threshold}&lowStockOnly=${filter === 'low'}`),
        api.get('/admin/inventory/stats')
      ]);

      let productsData = currentStockRes.data.data;
      
      // Aplicar filtro de out of stock se necessário
      if (filter === 'out') {
        productsData = productsData.filter((p: Product) => p.stock === 0);
      }

      setProducts(productsData);
      setStats(statsRes.data.data);
    } catch (error) {
      console.error('Erro ao carregar inventário:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--admin-spacing-xl)' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Controle de Estoque
          </h1>
          <p style={{ color: 'var(--admin-text-secondary)' }}>
            Visão geral do inventário e alertas de estoque baixo
          </p>
        </div>
        <Link to="/admin/inventory/movements" className="admin-btn admin-btn-outline">
          Ver Movimentações
        </Link>
      </div>

      {/* KPIs */}
      <div className="admin-grid admin-grid-4 admin-mb-xl">
        <KPICard
          title="Total de Produtos"
          value={stats?.totalProducts || 0}
          icon={<FaBoxes />}
          variant="primary"
          label={`${stats?.activeProducts || 0} ativos`}
        />

        <KPICard
          title="Estoque Baixo"
          value={stats?.lowStockProducts || 0}
          icon={<FaExclamationTriangle />}
          variant="warning"
          label={`≤ ${threshold} unidades`}
        />

        <KPICard
          title="Sem Estoque"
          value={stats?.outOfStockProducts || 0}
          icon={<FaBox />}
          variant="danger"
          label="produtos esgotados"
        />

        <KPICard
          title="Valor Total"
          value={formatCurrency(stats?.totalStockValue || 0)}
          icon={<FaDollarSign />}
          variant="success"
          label="estoque valorizado"
        />
      </div>

      {/* Filtros */}
      <div className="admin-filter-bar">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ fontWeight: '600' }}>Alerta de estoque baixo:</label>
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value) || 5)}
            className="admin-filter-input"
            min="1"
            max="50"
            style={{ width: '100px' }}
          />
          <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>unidades</span>
        </div>

        <select
          className="admin-filter-input"
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'low' | 'out')}
          style={{ minWidth: '200px' }}
        >
          <option value="low">Apenas Estoque Baixo</option>
          <option value="out">Apenas Sem Estoque</option>
          <option value="all">Todos os Produtos</option>
        </select>
      </div>

      {/* Tabela */}
      <DataTable
        columns={[
          {
            key: 'imageUrl',
            label: 'Imagem',
            render: (value, row) => (
              <img
                src={value || row.images?.[0]?.url || '/placeholder.png'}
                alt={row.name}
                style={{
                  width: '48px',
                  height: '48px',
                  objectFit: 'cover',
                  borderRadius: 'var(--admin-radius)'
                }}
              />
            )
          },
          {
            key: 'name',
            label: 'Produto',
            render: (value, row) => (
              <div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{value}</div>
                {row.category && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                    {row.category.name}
                  </div>
                )}
                {row.sku && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                    SKU: {row.sku}
                  </div>
                )}
              </div>
            )
          },
          {
            key: 'stock',
            label: 'Estoque',
            render: (value) => (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {value === 0 ? (
                  <StatusBadge status="Esgotado" variant="danger" />
                ) : value <= threshold ? (
                  <StatusBadge status={`${value} unid.`} variant="warning" />
                ) : (
                  <StatusBadge status={`${value} unid.`} variant="success" />
                )}
              </div>
            )
          },
          {
            key: 'price',
            label: 'Valor Unit.',
            render: (value) => formatCurrency(value)
          },
          {
            key: '_id',
            label: 'Valor Total',
            render: (value, row) => (
              <div style={{ fontWeight: '600' }}>
                {formatCurrency(row.price * row.stock)}
              </div>
            )
          },
          {
            key: '_id',
            label: 'Ações',
            render: (value, row) => (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link
                  to={`/admin/inventory/adjust/${value}`}
                  className="admin-btn admin-btn-sm admin-btn-primary"
                >
                  <FaPlus /> Ajustar
                </Link>
                <Link
                  to={`/admin/inventory/history/${value}`}
                  className="admin-btn admin-btn-sm admin-btn-outline"
                >
                  Histórico
                </Link>
              </div>
            )
          }
        ]}
        data={products}
        loading={loading}
        emptyMessage={
          filter === 'low' 
            ? 'Nenhum produto com estoque baixo' 
            : filter === 'out'
            ? 'Nenhum produto sem estoque'
            : 'Nenhum produto encontrado'
        }
      />
    </AdminLayout>
  );
};

export default InventoryOverview;
