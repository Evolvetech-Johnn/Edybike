import { FC, useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import { useToast } from '../../hooks/useToast';
import '../../styles/admin.css';

type Tab = 'geral' | 'contato' | 'redes' | 'politicas' | 'avancado';

const SettingsPage: FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('geral');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const [formData, setFormData] = useState({
    siteName: '',
    siteDescription: '',
    logoUrl: '',
    faviconUrl: '',
    address: { street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zipCode: '' },
    phone: '',
    whatsapp: '',
    email: '',
    supportEmail: '',
    social: { instagram: '', facebook: '', youtube: '', twitter: '' },
    policies: { privacy: '', terms: '', returns: '', shipping: '' },
    settings: {
      itemsPerPage: 20,
      maxUploadSize: 5,
      sessionTimeout: 3600,
      enableCache: true,
      maintenanceMode: false,
      allowGuestCheckout: true
    },
    integrations: { googleAnalyticsId: '', facebookPixelId: '', mercadoPagoToken: '', correiosToken: '' }
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await api.get('/admin/settings');
      setFormData(prev => ({ ...prev, ...res.data }));
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm('Salvar configurações?')) return;
    
    try {
      setSaving(true);
      await api.put('/admin/settings', formData);
      toast.success('Configurações salvas com sucesso!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...(prev[parent as keyof typeof prev] as any), [field]: value }
    }));
  };

  if (loading) {
    return <AdminLayout><div style={{ padding: '4rem', textAlign: 'center' }}>Carregando...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div style={{ marginBottom: 'var(--admin-spacing-xl)' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>Configurações do Sistema</h1>
        <p style={{ color: 'var(--admin-text-secondary)' }}>Gerencie configurações da loja</p>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '2px solid var(--admin-border)', marginBottom: 'var(--admin-spacing-xl)', display: 'flex', gap: '1rem' }}>
        {[
          { key: 'geral', label: '📋 Geral' },
          { key: 'contato', label: '📍 Contato' },
          { key: 'redes', label: '📱 Redes Sociais' },
          { key: 'politicas', label: '📄 Políticas' },
          { key: 'avancado', label: '⚙️ Avançado' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as Tab)}
            style={{
              padding: '1rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: `2px solid ${activeTab === tab.key ? 'var(--admin-primary)' : 'transparent'}`,
              color: activeTab === tab.key ? 'var(--admin-primary)' : 'var(--admin-text-secondary)',
              fontWeight: activeTab === tab.key ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Tab: Geral */}
        {activeTab === 'geral' && (
          <div className="admin-card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: 'var(--admin-spacing-md)' }}>Informações Gerais</h3>
            <div className="admin-grid admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-form-label">Nome do Site</label>
                <input
                  type="text"
                  value={formData.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  className="admin-form-input"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Logo URL</label>
                <input
                  type="text"
                  value={formData.logoUrl}
                  onChange={(e) => handleChange('logoUrl', e.target.value)}
                  className="admin-form-input"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Descrição do Site</label>
              <textarea
                value={formData.siteDescription}
                onChange={(e) => handleChange('siteDescription', e.target.value)}
                className="admin-form-input"
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Tab: Contato */}
        {activeTab === 'contato' && (
          <div className="admin-card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: 'var(--admin-spacing-md)' }}>Dados de Contato</h3>
            <div className="admin-grid admin-grid-3">
              <div className="admin-form-group">
                <label className="admin-form-label">Rua</label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => handleNestedChange('address', 'street', e.target.value)}
                  className="admin-form-input"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Número</label>
                <input
                  type="text"
                  value={formData.address.number}
                  onChange={(e) => handleNestedChange('address', 'number', e.target.value)}
                  className="admin-form-input"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Bairro</label>
                <input
                  type="text"
                  value={formData.address.neighborhood}
                  onChange={(e) => handleNestedChange('address', 'neighborhood', e.target.value)}
                  className="admin-form-input"
                />
              </div>
            </div>
            <div className="admin-grid admin-grid-3">
              <div className="admin-form-group">
                <label className="admin-form-label">Cidade</label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => handleNestedChange('address', 'city', e.target.value)}
                  className="admin-form-input"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Estado</label>
                <input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) => handleNestedChange('address', 'state', e.target.value)}
                  className="admin-form-input"
                  maxLength={2}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">CEP</label>
                <input
                  type="text"
                  value={formData.address.zipCode}
                  onChange={(e) => handleNestedChange('address', 'zipCode', e.target.value)}
                  className="admin-form-input"
                />
              </div>
            </div>
            <div className="admin-grid admin-grid-4">
              <div className="admin-form-group">
                <label className="admin-form-label">Telefone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="admin-form-input"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">WhatsApp</label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  className="admin-form-input"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="admin-form-input"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Email Suporte</label>
                <input
                  type="email"
                  value={formData.supportEmail}
                  onChange={(e) => handleChange('supportEmail', e.target.value)}
                  className="admin-form-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab: Redes Sociais */}
        {activeTab === 'redes' && (
          <div className="admin-card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: 'var(--admin-spacing-md)' }}>Redes Sociais</h3>
            <div className="admin-grid admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-form-label">Instagram</label>
                <input
                  type="url"
                  value={formData.social.instagram}
                  onChange={(e) => handleNestedChange('social', 'instagram', e.target.value)}
                  className="admin-form-input"
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Facebook</label>
                <input
                  type="url"
                  value={formData.social.facebook}
                  onChange={(e) => handleNestedChange('social', 'facebook', e.target.value)}
                  className="admin-form-input"
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">YouTube</label>
                <input
                  type="url"
                  value={formData.social.youtube}
                  onChange={(e) => handleNestedChange('social', 'youtube', e.target.value)}
                  className="admin-form-input"
                  placeholder="https://youtube.com/..."
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Twitter</label>
                <input
                  type="url"
                  value={formData.social.twitter}
                  onChange={(e) => handleNestedChange('social', 'twitter', e.target.value)}
                  className="admin-form-input"
                  placeholder="https://twitter.com/..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab: Políticas */}
        {activeTab === 'politicas' && (
          <div className="admin-card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: 'var(--admin-spacing-md)' }}>Políticas</h3>
            <div className="admin-form-group">
              <label className="admin-form-label">Política de Privacidade</label>
              <textarea
                value={formData.policies.privacy}
                onChange={(e) => handleNestedChange('policies', 'privacy', e.target.value)}
                className="admin-form-input"
                rows={4}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Termos de Uso</label>
              <textarea
                value={formData.policies.terms}
                onChange={(e) => handleNestedChange('policies', 'terms', e.target.value)}
                className="admin-form-input"
                rows={4}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Política de Devoluções</label>
              <textarea
                value={formData.policies.returns}
                onChange={(e) => handleNestedChange('policies', 'returns', e.target.value)}
                className="admin-form-input"
                rows={4}
              />
            </div>
          </div>
        )}

        {/* Tab: Avançado */}
        {activeTab === 'avancado' && (
          <div className="admin-card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: 'var(--admin-spacing-md)' }}>Configurações Avançadas</h3>
            <div className="admin-grid admin-grid-3">
              <div className="admin-form-group">
                <label className="admin-form-label">Itens por Página</label>
                <input
                  type="number"
                  value={formData.settings.itemsPerPage}
                  onChange={(e) => handleNestedChange('settings', 'itemsPerPage', parseInt(e.target.value))}
                  className="admin-form-input"
                  min={1}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Upload Máx (MB)</label>
                <input
                  type="number"
                  value={formData.settings.maxUploadSize}
                  onChange={(e) => handleNestedChange('settings', 'maxUploadSize', parseInt(e.target.value))}
                  className="admin-form-input"
                  min={1}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Timeout Sessão (seg)</label>
                <input
                  type="number"
                  value={formData.settings.sessionTimeout}
                  onChange={(e) => handleNestedChange('settings', 'sessionTimeout', parseInt(e.target.value))}
                  className="admin-form-input"
                  min={60}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gap: '1rem', marginTop: 'var(--admin-spacing-md)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={formData.settings.enableCache}
                  onChange={(e) => handleNestedChange('settings', 'enableCache', e.target.checked)}
                />
                <span>Habilitar Cache</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={formData.settings.maintenanceMode}
                  onChange={(e) => handleNestedChange('settings', 'maintenanceMode', e.target.checked)}
                />
                <span>Modo Manutenção</span>
                {formData.settings.maintenanceMode && (
                  <span style={{ color: 'var(--admin-danger)', marginLeft: '0.5rem', fontSize: '0.875rem' }}>
                    ⚠️ Site bloqueado
                  </span>
                )}
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={formData.settings.allowGuestCheckout}
                  onChange={(e) => handleNestedChange('settings', 'allowGuestCheckout', e.target.checked)}
                />
                <span>Permitir Compra sem Cadastro</span>
              </label>
            </div>
            <hr style={{ margin: 'var(--admin-spacing-lg) 0', border: 'none', borderTop: '1px solid var(--admin-border)' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: 'var(--admin-spacing-md)' }}>Integrações</h4>
            <div className="admin-grid admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-form-label">Google Analytics ID</label>
                <input
                  type="text"
                  value={formData.integrations.googleAnalyticsId}
                  onChange={(e) => handleNestedChange('integrations', 'googleAnalyticsId', e.target.value)}
                  className="admin-form-input"
                  placeholder="UA-XXXXXXXX-X"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Facebook Pixel ID</label>
                <input
                  type="text"
                  value={formData.integrations.facebookPixelId}
                  onChange={(e) => handleNestedChange('integrations', 'facebookPixelId', e.target.value)}
                  className="admin-form-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* Ações */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: 'var(--admin-spacing-xl)' }}>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
          <button type="button" className="admin-btn admin-btn-outline" onClick={loadSettings}>
            Cancelar
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default SettingsPage;
