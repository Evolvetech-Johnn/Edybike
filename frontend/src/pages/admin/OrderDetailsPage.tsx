import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import StatusBadge from '../../components/admin/StatusBadge';
import { FaTimes, FaShippingFast, FaMapMarkerAlt, FaCreditCard, FaBox } from 'react-icons/fa';
import api from '../../services/api';
import '../../styles/admin.css';

interface OrderDetails {
  _id: string;
  cliente: {
    nome?: string;
    email: string;
    telefone?: string;
  };
  items: Array<{
    productId: {
      name: string;
      imageUrl?: string;
      images?: { url: string }[];
    };
    quantity: number;
    price: number;
  }>;
  endereco: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  frete?: {
    modalidade?: string;
    valor?: number;
    prazo?: number;
  };
  pagamento?: {
    metodo: string;
    status: string;
  };
  total: number;
  subtotal: number;
  status: string;
  tracking?: string;
  createdAt: string;
  updatedAt: string;
}

const OrderDetailsPage: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/orders/${id}`);
      setOrder(response.data.data);
      setNewStatus(response.data.data.status);
    } catch (error) {
      console.error('Erro ao carregar pedido:', error);
      alert('Erro ao carregar pedido');
      navigate('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus || newStatus === order?.status) {
      alert('Selecione um status diferente');
      return;
    }

    try {
      setActionLoading(true);
      await api.patch(`/admin/orders/${id}/status`, { status: newStatus });
      alert('Status atualizado com sucesso!');
      loadOrder();
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      alert(error.response?.data?.message || 'Erro ao atualizar status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Tem certeza que deseja cancelar este pedido? O estoque será devolvido.')) {
      return;
    }

    try {
      setActionLoading(true);
      await api.post(`/admin/orders/${id}/cancel`);
      alert('Pedido cancelado com sucesso!');
      loadOrder();
    } catch (error: any) {
      console.error('Erro ao cancelar pedido:', error);
      alert(error.response?.data?.message || 'Erro ao cancelar pedido');
    } finally {
      setActionLoading(false);
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

  if (loading || !order) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          Carregando pedido...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ maxWidth: '1200px' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 'var(--admin-spacing-xl)' 
        }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              Pedido #{order._id.substring(0, 8)}
            </h1>
            <p style={{ color: 'var(--admin-text-secondary)' }}>
              Criado em {formatDate(order.createdAt)}
            </p>
          </div>
          <button
            className="admin-btn admin-btn-outline"
            onClick={() => navigate('/admin/orders')}
          >
            <FaTimes /> Voltar
          </button>
        </div>

        <div className="admin-grid admin-grid-3" style={{ marginBottom: 'var(--admin-spacing-xl)' }}>
          {/* Card: Informações do Cliente */}
          <div className="admin-table-container" style={{ padding: 'var(--admin-spacing-lg)' }}>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '700', 
              marginBottom: 'var(--admin-spacing-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <FaBox /> Cliente
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <div>
                <strong>Nome:</strong> {order.cliente.nome || 'N/A'}
              </div>
              <div>
                <strong>Email:</strong> {order.cliente.email}
              </div>
              {order.cliente.telefone && (
                <div>
                  <strong>Telefone:</strong> {order.cliente.telefone}
                </div>
              )}
            </div>
          </div>

          {/* Card: Endereço de Entrega */}
          <div className="admin-table-container" style={{ padding: 'var(--admin-spacing-lg)' }}>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '700', 
              marginBottom: 'var(--admin-spacing-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <FaMapMarkerAlt /> Entrega
            </h3>
            <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
              {order.endereco.rua}, {order.endereco.numero}
              {order.endereco.complemento && <>, {order.endereco.complemento}</>}
              <br />
              {order.endereco.bairro}
              <br />
              {order.endereco.cidade} - {order.endereco.estado}
              <br />
              CEP: {order.endereco.cep}
            </div>
          </div>

          {/* Card: Pagamento */}
          <div className="admin-table-container" style={{ padding: 'var(--admin-spacing-lg)' }}>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '700', 
              marginBottom: 'var(--admin-spacing-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <FaCreditCard /> Pagamento
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <div>
                <strong>Método:</strong> {order.pagamento?.metodo || 'N/A'}
              </div>
              <div>
                <strong>Status:</strong>{' '}
                <StatusBadge 
                  status={order.pagamento?.status || 'N/A'} 
                  variant={order.pagamento?.status === 'APROVADO' ? 'success' : 'warning'}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Items do Pedido */}
        <div className="admin-table-container" style={{ padding: 'var(--admin-spacing-lg)', marginBottom: 'var(--admin-spacing-xl)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: 'var(--admin-spacing-lg)' }}>
            Itens do Pedido
          </h3>
          
          <table className="admin-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th style={{ textAlign: 'center' }}>Quantidade</th>
                <th style={{ textAlign: 'right' }}>Preço Unit.</th>
                <th style={{ textAlign: 'right' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img
                        src={item.productId.imageUrl || item.productId.images?.[0]?.url || '/placeholder.png'}
                        alt={item.productId.name}
                        style={{
                          width: '48px',
                          height: '48px',
                          objectFit: 'cover',
                          borderRadius: 'var(--admin-radius)'
                        }}
                      />
                      <span style={{ fontWeight: '600' }}>{item.productId.name}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(item.price)}</td>
                  <td style={{ textAlign: 'right', fontWeight: '600' }}>
                    {formatCurrency(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totais */}
          <div style={{ 
            marginTop: 'var(--admin-spacing-lg)', 
            paddingTop: 'var(--admin-spacing-lg)',
            borderTop: '2px solid var(--admin-border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '300px' }}>
              <span>Subtotal:</span>
              <span style={{ fontWeight: '600' }}>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.frete && (
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '300px' }}>
                <span>
                  Frete ({order.frete.modalidade})
                  {order.frete.prazo && ` - ${order.frete.prazo} dias`}:
                </span>
                <span style={{ fontWeight: '600' }}>{formatCurrency(order.frete.valor || 0)}</span>
              </div>
            )}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              width: '300px',
              fontSize: '1.25rem',
              fontWeight: '700'
            }}>
              <span>Total:</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Status e Ações */}
        <div className="admin-grid admin-grid-2">
          {/* Card: Atualizar Status */}
          <div className="admin-table-container" style={{ padding: 'var(--admin-spacing-lg)' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: 'var(--admin-spacing-lg)' }}>
              <FaShippingFast style={{ marginRight: '0.5rem' }} />
              Gerenciar Status
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-spacing-md)' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Status Atual
                </label>
                <StatusBadge status={order.status} />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Alterar para
                </label>
                <select
                  className="admin-filter-input"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="AGUARDANDO_PAGAMENTO">Aguardando Pagamento</option>
                  <option value="PAGAMENTO_APROVADO">Pagamento Aprovado</option>
                  <option value="EM_SEPARACAO">Em Separação</option>
                  <option value="ENVIADO">Enviado</option>
                  <option value="ENTREGUE">Entregue</option>
                  <option value="CANCELADO">Cancelado</option>
                </select>
              </div>

              <button
                className="admin-btn admin-btn-primary"
                onClick={handleUpdateStatus}
                disabled={actionLoading || newStatus === order.status}
                style={{ width: '100%' }}
              >
                {actionLoading ? 'Atualizando...' : 'Atualizar Status'}
              </button>
            </div>
          </div>

          {/* Card: Ações */}
          <div className="admin-table-container" style={{ padding: 'var(--admin-spacing-lg)' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: 'var(--admin-spacing-lg)' }}>
              Ações Administrativas
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-spacing-md)' }}>
              {order.tracking && (
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Código de Rastreio
                  </label>
                  <div style={{
                    padding: '0.75rem',
                    backgroundColor: 'var(--admin-bg)',
                    borderRadius: 'var(--admin-radius)',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }}>
                    {order.tracking}
                  </div>
                </div>
              )}

              <button
                className="admin-btn admin-btn-danger"
                onClick={handleCancelOrder}
                disabled={actionLoading || order.status === 'CANCELADO'}
                style={{ width: '100%' }}
              >
                {actionLoading ? 'Processando...' : 'Cancelar Pedido'}
              </button>

              <div style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderRadius: 'var(--admin-radius)',
                fontSize: '0.875rem',
                color: 'var(--admin-danger)'
              }}>
                ⚠️ Cancelar o pedido retorna automaticamente o estoque dos produtos
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderDetailsPage;
