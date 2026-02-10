import { FC, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { FaSave, FaTimes, FaPlus, FaMinus } from 'react-icons/fa';
import api from '../../services/api';
import '../../styles/admin.css';

interface Product {
  _id: string;
  name: string;
  stock: number;
  sku?: string;
  imageUrl?: string;
  images?: { url: string }[];
}

const StockAdjust: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [adjustment, setAdjustment] = useState(0);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
      alert('Erro ao carregar produto');
      navigate('/admin/inventory');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (adjustment === 0) {
      alert('Digite um valor de ajuste diferente de zero');
      return;
    }

    if (!reason.trim()) {
      alert('Informe o motivo do ajuste');
      return;
    }

    const newStock = (product?.stock || 0) + adjustment;
    
    if (newStock < 0) {
      alert('O ajuste resultaria em estoque negativo');
      return;
    }

    try {
      setLoading(true);
      
      await api.post('/admin/inventory/adjust', {
        productId: id,
        adjustment,
        reason
      });

      alert('Estoque ajustado com sucesso!');
      navigate('/admin/inventory');
    } catch (error: any) {
      console.error('Erro ao ajustar estoque:', error);
      alert(error.response?.data?.message || 'Erro ao ajustar estoque');
    } finally {
      setLoading(false);
    }
  };

  const presetAdjustment = (value: number) => {
    setAdjustment(value);
  };

  if (!product) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          Carregando produto...
        </div>
      </AdminLayout>
    );
  }

  const newStock = product.stock + adjustment;

  return (
    <AdminLayout>
      <div style={{ maxWidth: '700px' }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--admin-spacing-xl)' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Ajustar Estoque
          </h1>
          <p style={{ color: 'var(--admin-text-secondary)' }}>
            Faça ajustes manuais no estoque do produto
          </p>
        </div>

        {/* Informações do Produto */}
        <div className="admin-table-container" style={{ padding: 'var(--admin-spacing-lg)', marginBottom: 'var(--admin-spacing-xl)' }}>
          <div style={{ display: 'flex', gap: 'var(--admin-spacing-lg)', alignItems: 'center' }}>
            <img
              src={product.imageUrl || product.images?.[0]?.url || '/placeholder.png'}
              alt={product.name}
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover',
                borderRadius: 'var(--admin-radius)'
              }}
            />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                {product.name}
              </h3>
              {product.sku && (
                <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  SKU: {product.sku}
                </p>
              )}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div>
                  <span style={{ color: 'var(--admin-text-secondary)', fontSize: '0.875rem' }}>
                    Estoque Atual:
                  </span>
                  <span style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '700', 
                    marginLeft: '0.5rem',
                    color: product.stock <= 5 ? 'var(--admin-danger)' : 'var(--admin-success)'
                  }}>
                    {product.stock}
                  </span>
                  <span style={{ color: 'var(--admin-text-muted)', marginLeft: '0.25rem' }}>
                    unidades
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário de Ajuste */}
        <form onSubmit={handleSubmit}>
          <div className="admin-table-container" style={{ padding: 'var(--admin-spacing-lg)', marginBottom: 'var(--admin-spacing-xl)' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: 'var(--admin-spacing-lg)' }}>
              Ajuste de Estoque
            </h3>

            {/* Atalhos rápidos */}
            <div style={{ marginBottom: 'var(--admin-spacing-lg)' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                Atalhos Rápidos
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="admin-btn admin-btn-sm admin-btn-outline"
                  onClick={() => presetAdjustment(-10)}
                >
                  <FaMinus /> 10
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-sm admin-btn-outline"
                  onClick={() => presetAdjustment(-5)}
                >
                  <FaMinus /> 5
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-sm admin-btn-outline"
                  onClick={() => presetAdjustment(-1)}
                >
                  <FaMinus /> 1
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-sm admin-btn-outline"
                  onClick={() => presetAdjustment(1)}
                >
                  <FaPlus /> 1
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-sm admin-btn-outline"
                  onClick={() => presetAdjustment(5)}
                >
                  <FaPlus /> 5
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-sm admin-btn-outline"
                  onClick={() => presetAdjustment(10)}
                >
                  <FaPlus /> 10
                </button>
              </div>
            </div>

            {/* Ajuste manual */}
            <div style={{ marginBottom: 'var(--admin-spacing-lg)' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                Quantidade de Ajuste *
              </label>
              <input
                type="number"
                value={adjustment}
                onChange={(e) => setAdjustment(parseInt(e.target.value) || 0)}
                className="admin-filter-input"
                placeholder="Digite o ajuste (+ para adicionar, - para remover)"
                style={{ width: '100%' }}
                required
              />
              <div style={{ 
                marginTop: '0.5rem', 
                fontSize: '0.875rem',
                color: adjustment > 0 ? 'var(--admin-success)' : adjustment < 0 ? 'var(--admin-danger)' : 'var(--admin-text-muted)'
              }}>
                {adjustment !== 0 
                  ? `${adjustment > 0 ? 'Adicionar' : 'Remover'} ${Math.abs(adjustment)} unidade(s)`
                  : 'Digite um valor para ajustar'
                }
              </div>
            </div>

            {/* Novo estoque */}
            <div style={{
              padding: 'var(--admin-spacing-md)',
              backgroundColor: 'var(--admin-bg)',
              borderRadius: 'var(--admin-radius)',
              marginBottom: 'var(--admin-spacing-lg)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600' }}>Estoque Atual:</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>{product.stock}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <span style={{ fontWeight: '600' }}>Ajuste:</span>
                <span style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '700',
                  color: adjustment > 0 ? 'var(--admin-success)' : adjustment < 0 ? 'var(--admin-danger)' : 'inherit'
                }}>
                  {adjustment > 0 ? '+' : ''}{adjustment}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '0.5rem',
                paddingTop: '0.5rem',
                borderTop: '2px solid var(--admin-border)'
              }}>
                <span style={{ fontWeight: '700', fontSize: '1.125rem' }}>Novo Estoque:</span>
                <span style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700',
                  color: newStock < 0 ? 'var(--admin-danger)' : newStock <= 5 ? 'var(--admin-warning)' : 'var(--admin-success)'
                }}>
                  {newStock}
                </span>
              </div>
              {newStock < 0 && (
                <div style={{ 
                  marginTop: '0.5rem', 
                  padding: '0.5rem', 
                  backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                  borderRadius: 'var(--admin-radius-sm)',
                  color: 'var(--admin-danger)',
                  fontSize: '0.875rem'
                }}>
                  ⚠️ Atenção: Estoque não pode ficar negativo!
                </div>
              )}
            </div>

            {/* Motivo */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                Motivo do Ajuste *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="admin-filter-input"
                rows={3}
                placeholder="Explique o motivo do ajuste (ex: inventário, devolução, avaria, etc.)"
                style={{ width: '100%' }}
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 'var(--admin-spacing-md)', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="admin-btn admin-btn-outline"
              onClick={() => navigate('/admin/inventory')}
            >
              <FaTimes /> Cancelar
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={loading || adjustment === 0 || newStock < 0}
            >
              <FaSave /> {loading ? 'Salvando...' : 'Confirmar Ajuste'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default StockAdjust;
