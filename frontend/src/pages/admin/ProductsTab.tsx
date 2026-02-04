import { useState, useEffect, FormEvent } from 'react';
import api from '../../services/api';
import { FaEdit, FaTrash } from 'react-icons/fa';
import type { Product, Category } from '../../types';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  imageUrl: string;
  active: boolean;
}

const ProductsTab = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
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
      const { data } = await api.get<Product[]>('/products');
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get<Category[]>('/categories');
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
      alert(error.response?.data?.message || 'Erro ao salvar produto');
    }
  };

  const handleEdit = (product: Product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      category: typeof product.category === 'object' ? product.category._id : product.category || '',
      stock: String(product.stock),
      imageUrl: product.imageUrl || '',
      active: true
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm('Deletar este produto?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      alert('Erro ao deletar produto');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentProduct(null);
    setFormData({ name: '', description: '', price: '', category: '', stock: '', imageUrl: '', active: true });
  };

  return (
    <div>
      <div className="card mb-8 p-6">
        <h3 className="text-xl font-bold mb-4">{isEditing ? 'Editar Produto' : 'Novo Produto'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="form-label">Nome</label>
            <input required className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          
          <div>
            <label className="form-label">Preço</label>
            <input required type="number" step="0.01" className="form-control" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
          </div>

          <div>
            <label className="form-label">Estoque</label>
            <input required type="number" className="form-control" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
          </div>

          <div>
            <label className="form-label">Categoria</label>
            <select required className="form-control" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="">Selecione...</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="form-label">URL da Imagem</label>
            <input className="form-control" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
          </div>

          <div className="col-span-2">
            <label className="form-label">Descrição</label>
            <textarea required className="form-control" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
          </div>

          <div className="col-span-2 flex gap-4">
            <button type="submit" className="btn btn-primary">{isEditing ? 'Salvar Alterações' : 'Criar Produto'}</button>
            {isEditing && <button type="button" onClick={handleCancel} className="btn btn-outline">Cancelar</button>}
          </div>
        </form>
      </div>

      <div className="grid gap-4">
        {products.map(product => (
          <div key={product._id} className="card p-4 flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded bg-gray-600" style={{ backgroundImage: `url(${product.imageUrl})`, backgroundSize: 'cover' }}></div>
              <div>
                <h4 className="m-0 font-bold">{product.name}</h4>
                <span className="text-sm text-gray-500">
                  Estoque: {product.stock} | Preço: R${product.price}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(product)} className="btn btn-outline p-2"><FaEdit /></button>
              <button onClick={() => handleDelete(product._id)} className="btn btn-danger p-2"><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsTab;
