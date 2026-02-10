import { FC, useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { FaDollarSign, FaShoppingCart, FaBox, FaChartLine } from 'react-icons/fa';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import api from '../../services/api';
import '../../styles/admin.css';

interface Summary {
  revenue: { current: number; previous: number; change: number };
  orders: { current: number; previous: number; change: number };
  products: number;
  conversionRate: number;
}

interface RevenueData {
  label: string;
  revenue: number;
  count: number;
}

interface TopProduct {
  productId: string;
  name: string;
  quantity: number;
  revenue: number;
  imageUrl?: string;
}

interface InventoryStatus {
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

const AnalyticsDashboard: FC = () => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [inventoryStatus, setInventoryStatus] = useState<InventoryStatus | null>(null);
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [summaryRes, revenueRes, topProductsRes, inventoryRes] = await Promise.all([
        api.get('/admin/analytics/summary'),
        api.get(`/admin/analytics/revenue?period=${period}`),
        api.get(`/admin/analytics/top-products?limit=10&period=${period}`),
        api.get('/admin/analytics/inventory-status')
      ]);

      setSummary(summaryRes.data);
      setRevenueData(revenueRes.data.data);
      setTopProducts(topProductsRes.data);
      setInventoryStatus(inventoryRes.data);
    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'var(--admin-success)';
    if (change < 0) return 'var(--admin-danger)';
    return 'var(--admin-text-muted)';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return '↑';
    if (change < 0) return '↓';
    return '→';
  };

  // Cores para Pie Chart
  const INVENTORY_COLORS = {
    inStock: '#10b981',    // green
    lowStock: '#f59e0b',   // yellow
    outOfStock: '#ef4444'  // red
  };

  const inventoryPieData = inventoryStatus ? [
    { name: 'Em Estoque', value: inventoryStatus.inStock, color: INVENTORY_COLORS.inStock },
    { name: 'Baixo Estoque', value: inventoryStatus.lowStock, color: INVENTORY_COLORS.lowStock },
    { name: 'Sem Estoque', value: inventoryStatus.outOfStock, color: INVENTORY_COLORS.outOfStock }
  ] : [];

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '4rem' }}>Carregando analytics...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div style={{ marginBottom: 'var(--admin-spacing-xl)' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Analytics
          </h1>
          <p style={{ color: 'var(--admin-text-secondary)' }}>
            Métricas e insights de vendas
          </p>
        </div>

        {/* Filtro de Período */}
        <div style={{ marginBottom: 'var(--admin-spacing-xl)' }}>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="admin-filter-input"
            style={{ maxWidth: '200px' }}
          >
            <option value="day">Últimos 30 Dias</option>
            <option value="week">Últimas 12 Semanas</option>
            <option value="month">Últimos 12 Meses</option>
            <option value="year">Últimos 3 Anos</option>
          </select>
        </div>

        {/* KPIs */}
        {summary && (
          <div className="admin-grid admin-grid-4" style={{ marginBottom: 'var(--admin-spacing-xl)' }}>
            <div className="kpi-card">
              <div className="kpi-card-header">
                <span className="kpi-card-title">Receita</span>
                <div className="kpi-card-icon success">
                  <FaDollarSign />
                </div>
              </div>
              <div className="kpi-card-value">{formatCurrency(summary.revenue.current)}</div>
              <div className="kpi-card-footer">
                <span style={{ color: getChangeColor(summary.revenue.change) }}>
                  {getChangeIcon(summary.revenue.change)} {Math.abs(summary.revenue.change).toFixed(1)}%
                </span>
                <span className="kpi-card-label"> vs mês anterior</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card-header">
                <span className="kpi-card-title">Pedidos</span>
                <div className="kpi-card-icon primary">
                  <FaShoppingCart />
                </div>
              </div>
              <div className="kpi-card-value">{summary.orders.current}</div>
              <div className="kpi-card-footer">
                <span style={{ color: getChangeColor(summary.orders.change) }}>
                  {getChangeIcon(summary.orders.change)} {Math.abs(summary.orders.change).toFixed(1)}%
                </span>
                <span className="kpi-card-label"> vs mês anterior</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card-header">
                <span className="kpi-card-title">Produtos</span>
                <div className="kpi-card-icon info">
                  <FaBox />
                </div>
              </div>
              <div className="kpi-card-value">{summary.products}</div>
              <div className="kpi-card-footer">
                <span className="kpi-card-label">Ativos no catálogo</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card-header">
                <span className="kpi-card-title">Conversão</span>
                <div className="kpi-card-icon warning">
                  <FaChartLine />
                </div>
              </div>
              <div className="kpi-card-value">{summary.conversionRate.toFixed(1)}%</div>
              <div className="kpi-card-footer">
                <span className="kpi-card-label">Taxa de entrega</span>
              </div>
            </div>
          </div>
        )}

        {/* Gráfico de Receita */}
        <div className="admin-table-container" style={{ padding: 'var(--admin-spacing-lg)', marginBottom: 'var(--admin-spacing-xl)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: 'var(--admin-spacing-lg)' }}>
            Receita ao Longo do Tempo
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--admin-primary)"
                strokeWidth={2}
                dot={{ fill: 'var(--admin-primary)', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Grid: Top Produtos + Status Estoque */}
        <div className="admin-grid admin-grid-2" style={{ marginBottom: 'var(--admin-spacing-xl)' }}>
          {/* Top Produtos */}
          <div className="admin-table-container" style={{ padding: 'var(--admin-spacing-lg)' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: 'var(--admin-spacing-lg)' }}>
              Top 10 Produtos
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={150} />
                <Tooltip formatter={(value: number) => `${value} unidades`} />
                <Bar dataKey="quantity" fill="var(--admin-success)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status de Estoque */}
          <div className="admin-table-container" style={{ padding: 'var(--admin-spacing-lg)' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: 'var(--admin-spacing-lg)' }}>
              Status de Estoque
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={inventoryPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {inventoryPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsDashboard;
