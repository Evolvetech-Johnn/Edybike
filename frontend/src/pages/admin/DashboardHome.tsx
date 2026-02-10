import { FC, useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import KPICard from '../../components/admin/KPICard';
import Chart from '../../components/admin/Chart';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import {
  FaDollarSign,
  FaShoppingCart,
  FaChartLine,
  FaExclamationTriangle
} from 'react-icons/fa';
import api from '../../services/api';
import '../../styles/admin.css';

interface DashboardKPIs {
  revenue: {
    value: number;
    growth: number;
  };
  orders: {
    total: number;
    pending: number;
  };
  avgTicket: number;
  alerts: {
    lowStock: number;
  };
}

const DashboardHome: FC = () => {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [salesChart, setSalesChart] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [kpisRes, chartRes, productsRes, ordersRes] = await Promise.all([
        api.get('/admin/dashboard/kpis?period=month'),
        api.get('/admin/dashboard/sales-chart?period=month'),
        api.get('/admin/dashboard/top-products?limit=5'),
        api.get('/admin/dashboard/recent-orders?limit=5')
      ]);

      setKpis(kpisRes.data.data);
      setSalesChart(chartRes.data.data);
      setTopProducts(productsRes.data.data);
      setRecentOrders(ordersRes.data.data);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
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

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--admin-text-muted)' }}>
          Carregando dashboard...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* KPIs Grid */}
      <div className="admin-grid admin-grid-4 admin-mb-xl">
        <KPICard
          title="Faturamento"
          value={formatCurrency(kpis?.revenue.value || 0)}
          icon={<FaDollarSign />}
          variant="success"
          trend={{
            value: kpis?.revenue.growth || 0,
            isPositive: (kpis?.revenue.growth || 0) > 0
          }}
          label="vs. mês anterior"
        />

        <KPICard
          title="Pedidos"
          value={kpis?.orders.total || 0}
          icon={<FaShoppingCart />}
          variant="primary"
          label="no último mês"
        />

        <KPICard
          title="Ticket Médio"
          value={formatCurrency(kpis?.avgTicket || 0)}
          icon={<FaChartLine />}
          variant="info"
        />

        <KPICard
          title="Estoque Baixo"
          value={kpis?.alerts.lowStock || 0}
          icon={<FaExclamationTriangle />}
          variant="warning"
          label="produtos em alerta"
        />
      </div>

      {/* Charts Row */}
      <div className="admin-grid admin-grid-2 admin-mb-xl">
        <Chart
          title="Vendas (Últimos 30 dias)"
          data={salesChart}
          type="line"
          dataKey="sales"
          xAxisKey="date"
          height={320}
        />

        <Chart
          title="Top 5 Produtos Mais Vendidos"
          data={topProducts}
          type="bar"
          dataKey="quantity"
          xAxisKey="name"
          height={320}
        />
      </div>

      {/* Recent Orders Table */}
      <div className="admin-mb-xl">
        <h2 style={{ marginBottom: 'var(--admin-spacing-lg)', fontSize: '1.25rem', fontWeight: '700' }}>
          Pedidos Recentes
        </h2>
        <DataTable
          columns={[
            {
              key: '_id',
              label: 'ID',
              render: (value) => `#${value.substring(0, 8)}`
            },
            {
              key: 'cliente',
              label: 'Cliente',
              render: (value) => value?.nome || value?.email || 'N/A'
            },
            {
              key: 'total',
              label: 'Valor',
              render: (value) => formatCurrency(value)
            },
            {
              key: 'status',
              label: 'Status',
              render: (value) => <StatusBadge status={value} />
            },
            {
              key: 'createdAt',
              label: 'Data',
              render: (value) => formatDate(value)
            }
          ]}
          data={recentOrders}
          loading={loading}
        />
      </div>
    </AdminLayout>
  );
};

export default DashboardHome;
