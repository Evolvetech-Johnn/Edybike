import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaToggleOn,
  FaToggleOff,
  FaStar,
  FaRegStar,
  FaTag,
  FaBox
} from 'react-icons/fa';
import api from '../../services/api';
import '../../styles/admin.css';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: { name: string } | null;
  active: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  salePrice?: number;
  imageUrl?: string;
  images?: { url: string }[];
  deletedAt?: Date | null;
}

const ProductsList: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: 'active', // 'active', 'inactive', 'deleted', 'all'
    featured: '',
    onSale: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    loadProducts();
  }, [filters, pagination.page]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.category && { category: filters.category }),
        ...(filters.status && { status: filters.status }),
        ...(filters.featured && { featured: filters.featured }),
        ...(filters.onSale && { onSale: filters.onSale })
      });

      const response = await api.get(`/admin/products?${params}`);
      
      setProducts(response.data.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        pages: response.data.pagination.pages
      }));
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (productId: string) => {
    try {
      await api.patch(`/admin/products/${productId}/toggle-active`);
      loadProducts();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      alert('Erro ao alterar status do produto');
    }
  };

  const handleToggleFeatured = async (productId: string, currentFeatured: boolean) => {
    try {
      await api.patch(`/admin/products/${productId}/featured`, {
        featured: !currentFeatured
      });
      loadProducts();
    } catch (error) {
      console.error('Erro ao alterar destaque:', error);
      alert('Erro ao alterar destaque do produto');
    }
  };

  const handleSoftDelete = async (productId: string) => {
    if (!confirm('Tem certeza que deseja remover este produto?')) return;
    
    try {
      await api.delete(`/admin/products/${productId}`);
      loadProducts();
    } catch (error) {
      console.error('Erro ao remover produto:', error);
      alert('Erro ao remover produto');
    }
  };

  const handleRestore = async (productId: string) => {
    try {
      await api.post(`/admin/products/${productId}/restore`);
      loadProducts();
    } catch (error) {
      console.error('Erro ao restaurar produto:', error);
      alert('Erro ao restaurar produto');
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
      {/* Header com ação */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--admin-spacing-xl)' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Produtos
          </h1>
          <p style={{ color: 'var(--admin-text-secondary)' }}>
            Gerencie produtos, preços, estoque e promoções
          </p>
        </div>
        <Link to="/admin/products/new" className="admin-btn admin-btn-primary">
          <FaPlus /> Novo Produto
        </Link>
      </div>

      {/* Filtros */}
      <div className="admin-filter-bar">
        <input
          type="text"
          placeholder="Buscar por nome, SKU..."
          className="admin-filter-input"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        
        <select
          className="admin-filter-input"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          style={{ minWidth: '150px' }}
        >
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
          <option value="deleted">Removidos</option>
          <option value="all">Todos</option>
        </select>

        <select
          className="admin-filter-input"
          value={filters.featured}
          onChange={(e) => setFilters({ ...filters, featured: e.target.value })}
          style={{ minWidth: '150px' }}
        >
          <option value="">Todos</option>
          <option value="true">Destaques</option>
        </select>

        <select
          className="admin-filter-input"
          value={filters.onSale}
          onChange={(e) => setFilters({ ...filters, onSale: e.target.value })}
          style={{ minWidth: '150px' }}
        >
          <option value="">Todos</option>
          <option value="true">Em Promoção</option>
        </select>

        <button
          className="admin-btn admin-btn-outline"
          onClick={() => setFilters({
            search: '',
            category: '',
            status: 'active',
            featured: '',
            onSale: ''
          })}
        >
          Limpar Filtros
        </button>
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
            label: 'Nome',
            render: (value, row) => (
              <div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{value}</div>
                {row.category && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                    {row.category.name}
                  </div>
                )}
              </div>
            )
          },
          {
            key: 'price',
            label: 'Preço',
            render: (value, row) => (
              <div>
                {row.isOnSale && row.salePrice ? (
                  <>
                    <div style={{ textDecoration: 'line-through', color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>
                      {formatCurrency(value)}
                    </div>
                    <div style={{ color: 'var(--admin-danger)', fontWeight: '600' }}>
                      {formatCurrency(row.salePrice)}
                    </div>
                  </>
                ) : (
                  <div style={{ fontWeight: '600' }}>{formatCurrency(value)}</div>
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
                <FaBox
                  style={{
                    color: value <= 5 ? 'var(--admin-danger)' : 'var(--admin-success)'
                  }}
                />
                <span style={{
                  fontWeight: '600',
                  color: value <= 5 ? 'var(--admin-danger)' : 'inherit'
                }}>
                  {value}
                </span>
              </div>
            )
          },
          {
            key: 'active',
            label: 'Status',
            render: (value, row) => (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <StatusBadge status={value ? 'Ativo' : 'Inativo'} />
                {row.isFeatured && <StatusBadge status="Destaque" variant="warning" />}
                {row.isOnSale && <StatusBadge status="Promoção" variant="danger" />}
                {row.deletedAt && <StatusBadge status="Removido" variant="danger" />}
              </div>
            )
          },
          {
            key: '_id',
            label: 'Ações',
            render: (value, row) => (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {row.deletedAt ? (
                  <button
                    className="admin-btn admin-btn-sm admin-btn-primary"
                    onClick={() => handleRestore(value)}
                    title="Restaurar"
                  >
                    Restaurar
                  </button>
                ) : (
                  <>
                    <Link
                      to={`/admin/products/${value}/edit`}
                      className="admin-btn admin-btn-sm admin-btn-outline"
                      title="Editar"
                    >
                      <FaEdit />
                    </Link>
                    
                    <button
                      className="admin-btn admin-btn-sm admin-btn-outline"
                      onClick={() => handleToggleActive(value)}
                      title={row.active ? 'Desativar' : 'Ativar'}
                    >
                      {row.active ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                    
                    <button
                      className="admin-btn admin-btn-sm admin-btn-outline"
                      onClick={() => handleToggleFeatured(value, row.isFeatured)}
                      title={row.isFeatured ? 'Remover destaque' : 'Destacar'}
                      style={{
                        color: row.isFeatured ? 'var(--admin-warning)' : 'inherit'
                      }}
                    >
                      {row.isFeatured ? <FaStar /> : <FaRegStar />}
                    </button>
                    
                    <button
                      className="admin-btn admin-btn-sm admin-btn-danger"
                      onClick={() => handleSoftDelete(value)}
                      title="Remover"
                    >
                      <FaTrash />
                    </button>
                  </>
                )}
              </div>
            )
          }
        ]}
        data={products}
        loading={loading}
        emptyMessage="Nenhum produto encontrado"
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

export default ProductsList;
