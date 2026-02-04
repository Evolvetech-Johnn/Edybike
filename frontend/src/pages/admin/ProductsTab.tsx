import { useState, useEffect, FC, FormEvent } from 'react';
import api from '../../services/api';
import { FaEdit, FaTrash } from 'react-icons/fa';
// @ts-ignore - Tipos podem não estar 100% alinhados com o backend ainda, usando any parciais
import { Product, Category } from '../../types';

interface ProductFormData {
    name: string;
    description: string;
    price: string | number;
    category: string;
    stock: string | number;
    imageUrl: string;
    active: boolean;
}

const ProductsTab: FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    imageUrl: '',
    active: true
  });

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products/admin'); // Use admin route to see all
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (error) {
       console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
        if (isEditing && currentProduct) {
            await api.put(`/products/${currentProduct._id}`, formData);
        } else {
            await api.post('/products', formData);
        }
        setIsEditing(false);
        setCurrentProduct(null);
        setFormData({ name: '', description: '', price: '', category: '', stock: '', imageUrl: '', active: true });
        fetchProducts();
    } catch (error: any) {
        alert(error.response?.data?.message || 'Error saving product');
    }
  };

  const handleEdit = (product: any) => {
      setIsEditing(true);
      setCurrentProduct(product);
      setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category?._id || product.category, // Handle populated vs id
          stock: product.stock,
          imageUrl: product.imageUrl || '',
          active: product.active
      });
      // Scroll to form
      window.scrollTo(0, 0);
  };

  const handleDelete = async (id: string) => {
      if(!window.confirm('Delete this product?')) return;
      try {
          await api.delete(`/products/${id}`);
          fetchProducts();
      } catch (error) {
          alert('Error deleting product');
      }
  };

  const handleCancel = () => {
      setIsEditing(false);
      setCurrentProduct(null);
      setFormData({ name: '', description: '', price: '', category: '', stock: '', imageUrl: '', active: true });
  }

  return (
    <div>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>{isEditing ? 'Editar Produto' : 'Novo Produto'}</h3>
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Nome</label>
                <input required className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            
            <div className="form-group">
                <label className="form-label">Preço</label>
                <input required type="number" step="0.01" className="form-control" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>

            <div className="form-group">
                <label className="form-label">Estoque</label>
                <input required type="number" className="form-control" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
            </div>

            <div className="form-group">
                <label className="form-label">Categoria</label>
                <select required className="form-control" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="">Selecione...</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
            </div>

            <div className="form-group">
                <label className="form-label">URL da Imagem</label>
                <input className="form-control" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Descrição</label>
                <textarea required className="form-control" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
            </div>

             <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                   <input type="checkbox" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} />
                   Ativo no Catálogo
                </label>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary">{isEditing ? 'Salvar Alterações' : 'Criar Produto'}</button>
                {isEditing && <button type="button" onClick={handleCancel} className="btn btn-outline">Cancelar</button>}
            </div>
        </form>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
          {products.map(product => (
              <div key={product._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ 
                          width: '50px', 
                          height: '50px', 
                          borderRadius: '4px', 
                          background: '#334155',
                          backgroundImage: `url(${product.imageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                      }}></div>
                      <div>
                          <h4 style={{ margin: 0 }}>{product.name}</h4>
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                              Estoque: {product.stock} | Preço: R${product.price} | {product.active ? 'Ativo' : 'Inativo'}
                          </span>
                      </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEdit(product)} className="btn btn-outline" style={{ padding: '0.5rem' }}><FaEdit /></button>
                      <button onClick={() => handleDelete(product._id)} className="btn btn-danger" style={{ padding: '0.5rem' }}><FaTrash /></button>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};

export default ProductsTab;
