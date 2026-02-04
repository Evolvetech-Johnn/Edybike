import { useState, useEffect, FormEvent } from 'react';
import api from '../../services/api';
import { FaEdit, FaTrash } from 'react-icons/fa';
import type { Category } from '../../types';

interface CategoryFormData {
  name: string;
  description: string;
}

const CategoriesTab = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: ''
  });

  const fetchCategories = async () => {
    try {
      const { data } = await api.get<Category[]>('/categories');
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isEditing && currentCategory) {
        await api.put(`/categories/${currentCategory._id}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      setIsEditing(false);
      setCurrentCategory(null);
      setFormData({ name: '', description: '' });
      fetchCategories();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao salvar categoria');
    }
  };

  const handleEdit = (category: Category) => {
    setIsEditing(true);
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm('Deletar esta categoria?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (error) {
      alert('Erro ao deletar categoria');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentCategory(null);
    setFormData({ name: '', description: '' });
  };

  return (
    <div>
      <div className="card mb-8 p-6">
        <h3 className="text-xl font-bold mb-4">{isEditing ? 'Editar Categoria' : 'Nova Categoria'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Nome</label>
            <input required className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          
          <div>
            <label className="form-label">Descrição</label>
            <textarea className="form-control" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
          </div>

          <div className="flex gap-4">
            <button type="submit" className="btn btn-primary">{isEditing ? 'Salvar Alterações' : 'Criar Categoria'}</button>
            {isEditing && <button type="button" onClick={handleCancel} className="btn btn-outline">Cancelar</button>}
          </div>
        </form>
      </div>

      <div className="grid gap-4">
        {categories.map(category => (
          <div key={category._id} className="card p-4 flex justify-between items-center">
            <div>
              <h4 className="m-0 font-bold">{category.name}</h4>
              <p className="text-sm text-gray-500 m-0">{category.description}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(category)} className="btn btn-outline p-2"><FaEdit /></button>
              <button onClick={() => handleDelete(category._id)} className="btn btn-danger p-2"><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesTab;
