import { useState, useEffect, FC, FormEvent } from 'react';
import api from '../../services/api';
import { FaTrash } from 'react-icons/fa';

const CategoriesTab: FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      await api.post('/categories', { name: newCategory });
      setNewCategory('');
      fetchCategories();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error creating category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta categoria?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (error) {
      alert('Erro ao excluir (pode haver produtos vinculados)');
    }
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Nova Categoria</h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Nome da categoria"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)} 
          />
          <button type="submit" className="btn btn-primary">Adicionar</button>
        </form>
      </div>

      <div className="grid grid-cols-3">
        {categories.map(cat => (
          <div key={cat._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>{cat.name}</span>
            <button onClick={() => handleDelete(cat._id)} className="btn btn-danger" style={{ padding: '0.5rem' }}>
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesTab;
