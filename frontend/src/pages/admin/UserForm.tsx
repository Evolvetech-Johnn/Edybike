import { FC, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import PermissionsMatrix from '../../components/admin/PermissionsMatrix';
import api from '../../services/api';
import '../../styles/admin.css';

const DEFAULT_PERMISSIONS = {
  super_admin: {
    products: { view: true, create: true, edit: true, delete: true },
    inventory: { view: true, adjust: true },
    orders: { view: true, update: true, cancel: true },
    promotions: { view: true, create: true, edit: true, delete: true },
    analytics: { view: true },
    users: { view: true, create: true, edit: true, delete: true },
    settings: { view: true, edit: true }
  },
  admin: {
    products: { view: true, create: true, edit: true, delete: true },
    inventory: { view: true, adjust: true },
    orders: { view: true, update: true, cancel: false },
    promotions: { view: true, create: true, edit: true, delete: false },
    analytics: { view: true },
    users: { view: true, create: false, edit: false, delete: false },
    settings: { view: true, edit: false }
  },
  operador: {
    products: { view: true, create: false, edit: true, delete: false },
    inventory: { view: true, adjust: true },
    orders: { view: true, update: true, cancel: false },
    promotions: { view: true, create: false, edit: false, delete: false },
    analytics: { view: false },
    users: { view: false, create: false, edit: false, delete: false },
    settings: { view: false, edit: false }
  }
};

const UserForm: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin',
    permissions: DEFAULT_PERMISSIONS.admin,
    status: 'ativo'
  });
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    if (id) loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      const res = await api.get(`/admin/users/${id}`);
      setFormData({
        name: res.data.name,
        email: res.data.email,
        password: '',
        confirmPassword: '',
        role: res.data.role,
        permissions: res.data.permissions || DEFAULT_PERMISSIONS[res.data.role as keyof typeof DEFAULT_PERMISSIONS],
        status: res.data.status
      });
      setUserInfo(res.data);
    } catch (error) {
      alert('Erro ao carregar usuário');
      navigate('/admin/users');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    setFormData(prev => ({
      ...prev,
      role: newRole,
      permissions: DEFAULT_PERMISSIONS[newRole as keyof typeof DEFAULT_PERMISSIONS] || prev.permissions
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.role) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (!id && !formData.password) {
      alert('Senha é obrigatória para novos usuários');
      return;
    }

    if (formData.password && formData.password.length < 8) {
      alert('Senha deve ter no mínimo 8 caracteres');
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      alert('Senhas não conferem');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        permissions: formData.permissions,
        status: formData.status,
        ...(formData.password && { password: formData.password })
      };

      if (id) {
        await api.put(`/admin/users/${id}`, payload);
      } else {
        await api.post('/admin/users', payload);
      }
      
      navigate('/admin/users');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao salvar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ marginBottom: 'var(--admin-spacing-xl)' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          {id ? 'Editar Usuário' : 'Novo Usuário'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Card 1: Informações Básicas */}
        <div className="admin-card" style={{ marginBottom: 'var(--admin-spacing-lg)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: 'var(--admin-spacing-md)' }}>
            Informações Básicas
          </h3>
          <div className="admin-grid admin-grid-2">
            <div className="admin-form-group">
              <label className="admin-form-label">Nome Completo *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="admin-form-input"
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="admin-form-input"
                required
              />
            </div>
          </div>
          {!id && (
            <div className="admin-grid admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-form-label">Senha *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="admin-form-input"
                  minLength={8}
                  required
                />
                <small style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                  Mínimo 8 caracteres
                </small>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Confirmar Senha *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="admin-form-input"
                  required
                />
              </div>
            </div>
          )}
          <div className="admin-form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="status"
                checked={formData.status === 'ativo'}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.checked ? 'ativo' : 'bloqueado' }))}
              />
              <span>Usuário Ativo</span>
            </label>
          </div>
        </div>

        {/* Card 2: Role e Permissões */}
        <div className="admin-card" style={{ marginBottom: 'var(--admin-spacing-lg)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: 'var(--admin-spacing-md)' }}>
            Role e Permissões
          </h3>
          <div className="admin-form-group">
            <label className="admin-form-label">Role *</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleRoleChange}
              className="admin-form-input"
              style={{ maxWidth: '300px' }}
              required
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
              <option value="operador">Operador</option>
            </select>
          </div>
          <div style={{ marginTop: 'var(--admin-spacing-md)' }}>
            <button
              type="button"
              className="admin-btn admin-btn-outline admin-btn-sm"
              onClick={() => setFormData(prev => ({
                ...prev,
                permissions: DEFAULT_PERMISSIONS[prev.role as keyof typeof DEFAULT_PERMISSIONS]
              }))}
              style={{ marginBottom: 'var(--admin-spacing-md)' }}
            >
              Usar Permissões Padrão do Role
            </button>
            <PermissionsMatrix
              permissions={formData.permissions}
              onChange={(perms) => setFormData(prev => ({ ...prev, permissions: perms }))}
              disabled={formData.role === 'super_admin'}
            />
            {formData.role === 'super_admin' && (
              <small style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: '0.5rem', display: 'block' }}>
                Super Admin possui todas as permissões
              </small>
            )}
          </div>
        </div>

        {/* Card 3: Info Adicional (apenas edit) */}
        {id && userInfo && (
          <div className="admin-card" style={{ marginBottom: 'var(--admin-spacing-lg)' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: 'var(--admin-spacing-md)' }}>
              Informações Adicionais
            </h3>
            <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div>
                <strong>Criado em:</strong> {new Date(userInfo.createdAt).toLocaleString('pt-BR')}
              </div>
              <div>
                <strong>Último acesso:</strong> {userInfo.lastLogin ? new Date(userInfo.lastLogin).toLocaleString('pt-BR') : 'Nunca'}
              </div>
            </div>
          </div>
        )}

        {/* Ações */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Usuário'}
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-outline"
            onClick={() => navigate('/admin/users')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default UserForm;
