import { FC, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { FaSave, FaTimes } from 'react-icons/fa';
import api from '../../services/api';
import '../../styles/admin.css';

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
}

interface PromotionFormData {
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applyTo: 'all' | 'category' | 'products';
  categoryId: string;
  productIds: string[];
  minPurchaseAmount: number;
  maxUsagesPerCustomer: number;
  totalUsageLimit: number;
}

const PromotionForm: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PromotionFormData>({
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    startDate: '',
    endDate: '',
    isActive: true,
    applyTo: 'all',
    categoryId: '',
    productIds: [],
    minPurchaseAmount: 0,
    maxUsagesPerCustomer: 0,
    totalUsageLimit: 0
  });

  useEffect(() => {
    loadCategories();
    loadProducts();
    if (isEditMode) {
      loadPromotion();
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const loadPromotion = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/promotions/${id}`);
      const promo = response.data;

      setFormData({
        name: promo.name || '',
        description: promo.description || '',
        discountType: promo.discountType || 'percentage',
        discountValue: promo.discountValue || 0,
        startDate: promo.startDate ? new Date(promo.startDate).toISOString().split('T')[0] : '',
        endDate: promo.endDate ? new Date(promo.endDate).toISOString().split('T')[0] : '',
        isActive: promo.isActive ?? true,
        applyTo: promo.products?.length > 0 ? 'products' : promo.categories?.length > 0 ? 'category' : 'all',
        categoryId: promo.categories?.[0]?._id || '',
        productIds: promo.products?.map((p: any) => p._id) || [],
        minPurchaseAmount: promo.conditions?.minPurchaseAmount || 0,
        maxUsagesPerCustomer: promo.conditions?.maxUsagesPerCustomer || 0,
        totalUsageLimit: promo.conditions?.totalUsageLimit || 0
      });
    } catch (error) {
      console.error('Erro ao carregar promoção:', error);
      alert('Erro ao carregar promoção');
      navigate('/admin/promotions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!formData.name || !formData.discountValue || !formData.startDate || !formData.endDate) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (formData.discountType === 'percentage' && (formData.discountValue <= 0 || formData.discountValue > 100)) {
      alert('Percentual deve estar entre 0 e 100');
      return;
    }

    if (formData.discountType === 'fixed' && formData.discountValue <= 0) {
      alert('Valor fixo deve ser maior que 0');
      return;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      alert('Data final deve ser posterior à data inicial');
      return;
    }

    if (formData.applyTo === 'category' && !formData.categoryId) {
      alert('Selecione uma categoria');
      return;
    }

    if (formData.applyTo === 'products' && formData.productIds.length === 0) {
      alert('Selecione pelo menos um produto');
      return;
    }

    try {
      setLoading(true);

      if (isEditMode) {
        await api.put(`/admin/promotions/${id}`, formData);
        alert('Promoção atualizada com sucesso!');
      } else {
        await api.post('/admin/promotions', formData);
        alert('Promoção criada com sucesso!');
      }

      navigate('/admin/promotions');
    } catch (error: any) {
      console.error('Erro ao salvar promoção:', error);
      alert(error.response?.data?.message || 'Erro ao salvar promoção');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleProductSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions);
    const values = options.map(opt => opt.value);
    setFormData(prev => ({ ...prev, productIds: values }));
  };

  if (loading && isEditMode) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          Carregando promoção...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ maxWidth: '900px' }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--admin-spacing-xl)' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            {isEditMode ? 'Editar Promoção' : 'Nova Promoção'}
          </h1>
          <p style={{ color: 'var(--admin-text-secondary)' }}>
            {isEditMode ? 'Atualize as informações da promoção' : 'Preencha os dados da nova promoção'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-grid admin-grid-2" style={{ marginBottom: 'var(--admin-spacing-xl)' }}>
            {/* Card: Informações Básicas */}
            <div className="admin-table-container" style={{ gridColumn: '1 / -1', padding: 'var(--admin-spacing-lg)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: 'var(--admin-spacing-lg)' }}>
                Informações Básicas
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-spacing-md)' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Nome *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="admin-filter-input"
                    required
                    style={{ width: '100%' }}
                    placeholder="Ex: Black Friday 2024"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Descrição
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="admin-filter-input"
                    rows={3}
                    style={{ width: '100%' }}
                    placeholder="Descrição detalhada da promoção"
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    id="isActive"
                  />
                  <label htmlFor="isActive" style={{ fontWeight: '600', cursor: 'pointer' }}>
                    Promoção Ativa
                  </label>
                </div>
              </div>
            </div>

            {/* Card: Desconto */}
            <div className="admin-table-container" style={{ padding: 'var(--admin-spacing-lg)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: 'var(--admin-spacing-lg)' }}>
                Desconto
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-spacing-md)' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Tipo *
                  </label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="discountType"
                        value="percentage"
                        checked={formData.discountType === 'percentage'}
                        onChange={handleChange}
                      />
                      Percentual (%)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="discountType"
                        value="fixed"
                        checked={formData.discountType === 'fixed'}
                        onChange={handleChange}
                      />
                      Valor Fixo (R$)
                    </label>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Valor *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      name="discountValue"
                      value={formData.discountValue}
                      onChange={handleChange}
                      className="admin-filter-input"
                      min="0"
                      max={formData.discountType === 'percentage' ? 100 : undefined}
                      step="0.01"
                      required
                      style={{ width: '100%' }}
                    />
                    <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }}>
                      {formData.discountType === 'percentage' ? '%' : 'R$'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card: Período */}
            <div className="admin-table-container" style={{ padding: 'var(--admin-spacing-lg)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: 'var(--admin-spacing-lg)' }}>
                Período
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-spacing-md)' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Data Início *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="admin-filter-input"
                    required
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Data Fim *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="admin-filter-input"
                    required
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>

            {/* Card: Aplicação */}
            <div className="admin-table-container" style={{ gridColumn: '1 / -1', padding: 'var(--admin-spacing-lg)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: 'var(--admin-spacing-lg)' }}>
                Aplicação
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-spacing-md)' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Aplicar em *
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="applyTo"
                        value="all"
                        checked={formData.applyTo === 'all'}
                        onChange={handleChange}
                      />
                      Todos os produtos
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="applyTo"
                        value="category"
                        checked={formData.applyTo === 'category'}
                        onChange={handleChange}
                      />
                      Categoria específica
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="applyTo"
                        value="products"
                        checked={formData.applyTo === 'products'}
                        onChange={handleChange}
                      />
                      Produtos específicos
                    </label>
                  </div>
                </div>

                {formData.applyTo === 'category' && (
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                      Categoria *
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="admin-filter-input"
                      required
                      style={{ width: '100%' }}
                    >
                      <option value="">Selecione...</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {formData.applyTo === 'products' && (
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                      Produtos * (Ctrl+Click para múltiplos)
                    </label>
                    <select
                      multiple
                      value={formData.productIds}
                      onChange={handleProductSelection}
                      className="admin-filter-input"
                      style={{ width: '100%', minHeight: '150px' }}
                    >
                      {products.map(prod => (
                        <option key={prod._id} value={prod._id}>
                          {prod.name} - R$ {prod.price.toFixed(2)}
                        </option>
                      ))}
                    </select>
                    <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: '0.5rem' }}>
                      {formData.productIds.length} produto(s) selecionado(s)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 'var(--admin-spacing-md)', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="admin-btn admin-btn-outline"
              onClick={() => navigate('/admin/promotions')}
            >
              <FaTimes /> Cancelar
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={loading}
            >
              <FaSave /> {loading ? 'Salvando...' : 'Salvar Promoção'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default PromotionForm;
