import { FC, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import ImageUpload from '../../components/admin/ImageUpload';
import ImagePreview from '../../components/admin/ImagePreview';
import { FaSave, FaTimes } from 'react-icons/fa';
import api from '../../services/api';
import '../../styles/admin.css';

interface Category {
  _id: string;
  name: string;
}

interface ProductImage {
  url: string;
  publicId: string;
  isMain: boolean;
  order: number;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  sku: string;
  active: boolean;
  isFeatured: boolean;
  featuredOrder: number;
  isOnSale: boolean;
  salePrice: number | null;
  saleStartDate: string;
  saleEndDate: string;
  weight: number;
  height: number;
  width: number;
  length: number;
}

const ProductForm: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    imageUrl: '',
    sku: '',
    active: true,
    isFeatured: false,
    featuredOrder: 0,
    isOnSale: false,
    salePrice: null,
    saleStartDate: '',
    saleEndDate: '',
    weight: 0,
    height: 0,
    width: 0,
    length: 0
  });

  useEffect(() => {
    loadCategories();
    if (isEditMode) {
      loadProduct();
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

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      const product = response.data;
      
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        stock: product.stock || 0,
        category: product.category?._id || '',
        imageUrl: product.imageUrl || '',
        sku: product.sku || '',
        active: product.active ?? true,
        isFeatured: product.isFeatured || false,
        featuredOrder: product.featuredOrder || 0,
        isOnSale: product.isOnSale || false,
        salePrice: product.salePrice || null,
        saleStartDate: product.saleStartDate ? new Date(product.saleStartDate).toISOString().split('T')[0] : '',
        saleEndDate: product.saleEndDate ? new Date(product.saleEndDate).toISOString().split('T')[0] : '',
        weight: product.weight || 0,
        height: product.height || 0,
        width: product.width || 0,
        length: product.length || 0
      });
      
      // Carregar imagens do produto
      if (product.images && product.images.length > 0) {
        setProductImages(product.images);
      }
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
      alert('Erro ao carregar produto');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.name || !formData.price || !formData.category) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (formData.isOnSale && (!formData.salePrice || formData.salePrice >= formData.price)) {
      alert('Preço promocional deve ser menor que o preço normal');
      return;
    }

    try {
      setLoading(true);
      
      if (isEditMode) {
        await api.put(`/products/${id}`, formData);
      } else {
        await api.post('/products', formData);
      }
      
      alert(isEditMode ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!');
      navigate('/admin/products');
    } catch (error: any) {
      console.error('Erro ao salvar produto:', error);
      alert(error.response?.data?.message || 'Erro ao salvar produto');
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

  if (loading && isEditMode) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          Carregando produto...
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
            {isEditMode ? 'Editar Produto' : 'Novo Produto'}
          </h1>
          <p style={{ color: 'var(--admin-text-secondary)' }}>
            {isEditMode ? 'Atualize as informações do produto' : 'Preencha os dados do novo produto'}
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
                    rows={4}
                    style={{ width: '100%' }}
                  />
                </div>

                <div className="admin-grid admin-grid-2">
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                      SKU
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      className="admin-filter-input"
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                      Categoria *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
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
                </div>
              </div>
            </div>

            {/* Card: Imagens do Produto */}
            <div className="admin-table-container" style={{ gridColumn: '1 / -1', padding: 'var(--admin-spacing-lg)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: 'var(--admin-spacing-lg)' }}>
                Imagens do Produto
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-spacing-md)' }}>
                {/* Upload Zone */}
                <ImageUpload
                  images={productImages}
                  productId={id}
                  onUploadComplete={(newImages) => setProductImages(newImages)}
                  maxImages={5}
                />

                {/* Gallery */}
                {productImages.length > 0 && (
                  <div className="admin-image-gallery">
                    {productImages.map((image) => (
                      <ImagePreview
                        key={image.publicId}
                        image={image}
                        productId={id!}
                        onDelete={(publicId) => {
                          setProductImages(prev => prev.filter(img => img.publicId !== publicId));
                        }}
                        onSetMain={(publicId) => {
                          setProductImages(prev => prev.map(img => ({
                            ...img,
                            isMain: img.publicId === publicId
                          })));
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Fallback: URL manual (compatibilidade) */}
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--admin-text-muted)' }}>
                    OU URL da Imagem (legacy)
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="admin-filter-input"
                    style={{ width: '100%' }}
                    placeholder="https://... (apenas para compatibilidade)"
                  />
                  <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: '0.25rem' }}>
                    💡 Use o upload acima para adicionar múltiplas imagens. Este campo é mantido para compatibilidade.
                  </p>
                </div>
              </div>
            </div>

            {/* Card: Preço e Estoque */}
            <div className="admin-table-container" style={{ padding: 'var(--admin-spacing-lg)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: 'var(--admin-spacing-lg)' }}>
                Preço e Estoque
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-spacing-md)' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="admin-filter-input"
                    min="0"
                    step="0.01"
                    required
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Estoque *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="admin-filter-input"
                    min="0"
                    required
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                    id="active"
                  />
                  <label htmlFor="active" style={{ fontWeight: '600', cursor: 'pointer' }}>
                    Produto Ativo
                  </label>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    id="isFeatured"
                  />
                  <label htmlFor="isFeatured" style={{ fontWeight: '600', cursor: 'pointer' }}>
                    Produto em Destaque
                  </label>
                </div>
              </div>
            </div>

            {/* Card: Promoção */}
            <div className="admin-table-container" style={{ padding: 'var(--admin-spacing-lg)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: 'var(--admin-spacing-lg)' }}>
                Promoção
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-spacing-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    name="isOnSale"
                    checked={formData.isOnSale}
                    onChange={handleChange}
                    id="isOnSale"
                  />
                  <label htmlFor="isOnSale" style={{ fontWeight: '600', cursor: 'pointer' }}>
                    Produto em Promoção
                  </label>
                </div>

                {formData.isOnSale && (
                  <>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                        Preço Promocional (R$)
                      </label>
                      <input
                        type="number"
                        name="salePrice"
                        value={formData.salePrice || ''}
                        onChange={handleChange}
                        className="admin-filter-input"
                        min="0"
                        step="0.01"
                        style={{ width: '100%' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                        Início da Promoção
                      </label>
                      <input
                        type="date"
                        name="saleStartDate"
                        value={formData.saleStartDate}
                        onChange={handleChange}
                        className="admin-filter-input"
                        style={{ width: '100%' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                        Fim da Promoção
                      </label>
                      <input
                        type="date"
                        name="saleEndDate"
                        value={formData.saleEndDate}
                        onChange={handleChange}
                        className="admin-filter-input"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Card: Dimensões (Frete) */}
            <div className="admin-table-container" style={{ gridColumn: '1 / -1', padding: 'var(--admin-spacing-lg)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: 'var(--admin-spacing-lg)' }}>
                Dimensões e Peso (para cálculo de frete)
              </h3>

              <div className="admin-grid admin-grid-4">
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="admin-filter-input"
                    min="0"
                    step="0.01"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className="admin-filter-input"
                    min="0"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Largura (cm)
                  </label>
                  <input
                    type="number"
                    name="width"
                    value={formData.width}
                    onChange={handleChange}
                    className="admin-filter-input"
                    min="0"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Comprimento (cm)
                  </label>
                  <input
                    type="number"
                    name="length"
                    value={formData.length}
                    onChange={handleChange}
                    className="admin-filter-input"
                    min="0"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 'var(--admin-spacing-md)', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="admin-btn admin-btn-outline"
              onClick={() => navigate('/admin/products')}
            >
              <FaTimes /> Cancelar
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={loading}
            >
              <FaSave /> {loading ? 'Salvando...' : 'Salvar Produto'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ProductForm;
