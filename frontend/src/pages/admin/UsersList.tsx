import { FC, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { FaUser, FaCheckCircle, FaBan, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import api from '../../services/api';
import { useToast } from '../../hooks/useToast';
import '../../styles/admin.css';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin?: string;
  createdAt: string;
}

interface Stats {
  total: number;
  active: number;
  blocked: number;
}

const UsersList: FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [filters, setFilters] = useState({ role: '', status: '', search: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersRes, statsRes] = await Promise.all([
        api.get('/admin/users', { params: filters }),
        api.get('/admin/users/stats')
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    if (!confirm('Alterar status do usuário?')) return;
    try {
      await api.patch(`/admin/users/${id}/toggle-status`);
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao alterar status');
    } finally {
      loadData();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deletar usuário? Esta ação não pode ser desfeita.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      loadData();
      toast.success('Usuário deletado com sucesso!');
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao deletar');
    }
  };

  const getRoleBadgeClass = (role: string) => {
    if (role === 'super_admin') return 'admin-badge success';
    if (role === 'admin') return 'admin-badge primary';
    return 'admin-badge info';
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      super_admin: 'Super Admin',
      admin: 'Admin',
      operador: 'Operador',
      gestor: 'Gestor'
    };
    return labels[role] || role;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return <AdminLayout><div style={{ padding: '4rem', textAlign: 'center' }}>Carregando...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div style={{ marginBottom: 'var(--admin-spacing-xl)' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>Usuários</h1>
        <p style={{ color: 'var(--admin-text-secondary)' }}>Gerencie usuários administrativos</p>
      </div>

      {/* KPIs */}
      {stats && (
        <div className="admin-grid admin-grid-3" style={{ marginBottom: 'var(--admin-spacing-xl)' }}>
          <div className="kpi-card">
            <div className="kpi-card-header">
              <span className="kpi-card-title">Total</span>
              <div className="kpi-card-icon primary"><FaUser /></div>
            </div>
            <div className="kpi-card-value">{stats.total}</div>
            <div className="kpi-card-footer"><span className="kpi-card-label">Administradores</span></div>
          </div>
          <div className="kpi-card">
            <div className="kpi-card-header">
              <span className="kpi-card-title">Ativos</span>
              <div className="kpi-card-icon success"><FaCheckCircle /></div>
            </div>
            <div className="kpi-card-value">{stats.active}</div>
            <div className="kpi-card-footer"><span className="kpi-card-label">Com acesso</span></div>
          </div>
          <div className="kpi-card">
            <div className="kpi-card-header">
              <span className="kpi-card-title">Bloqueados</span>
              <div className="kpi-card-icon danger"><FaBan /></div>
            </div>
            <div className="kpi-card-value">{stats.blocked}</div>
            <div className="kpi-card-footer"><span className="kpi-card-label">Sem acesso</span></div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="admin-filter-bar">
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          className="admin-filter-input"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          className="admin-filter-input"
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        >
          <option value="">Todos os Roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="operador">Operador</option>
        </select>
        <select
          className="admin-filter-input"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Todos os Status</option>
          <option value="ativo">Ativos</option>
          <option value="bloqueado">Bloqueados</option>
        </select>
        <button className="admin-btn admin-btn-primary" onClick={() => navigate('/admin/users/new')}>
          + Novo Usuário
        </button>
      </div>

      {/* Tabela */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Role</th>
              <th>Status</th>
              <th>Último Acesso</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--admin-primary), var(--admin-info))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '0.875rem'
                    }}>
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600' }}>{user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td><span className={getRoleBadgeClass(user.role)}>{getRoleLabel(user.role)}</span></td>
                <td>
                  <span className={`admin-badge ${user.status === 'ativo' ? 'success' : 'danger'}`}>
                    {user.status}
                  </span>
                </td>
                <td style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)' }}>
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleString('pt-BR') : 'Nunca'}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="admin-btn admin-btn-icon"
                      onClick={() => handleToggleStatus(user._id)}
                      title={user.status === 'ativo' ? 'Bloquear' : 'Ativar'}
                    >
                      {user.status === 'ativo' ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                    <Link to={`/admin/users/${user._id}/edit`} className="admin-btn admin-btn-icon" title="Editar">
                      <FaEdit />
                    </Link>
                    <button
                      className="admin-btn admin-btn-icon admin-btn-danger"
                      onClick={() => handleDelete(user._id)}
                      title="Deletar"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
            Nenhum usuário encontrado
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UsersList;
