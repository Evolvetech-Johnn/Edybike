import { FC, useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';
import ProductCard from '../../components/ProductCard';
import { Product, Category } from '../../types';

const ProductsPage: FC = () => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Construct the query URL
        let url = '/products';
        if (categoryId) {
            url += `?category=${categoryId}`;
            
            // Also fetch category details if limiting by category
            try {
                const catRes = await api.get(`/categories/${categoryId}`);
                setCategory(catRes.data);
            } catch (err) {
                console.warn('Could not fetch category details', err);
            }
        } else {
            setCategory(null);
        }

        console.log('Fetching products from:', url);
        const response = await api.get(url);
        setProducts(response.data);
        
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError(err.response?.data?.message || 'Erro ao carregar produtos. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="skeleton" style={{ height: '400px', width: '100%' }}></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Carregando catálogo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div style={{ color: 'var(--secondary)', marginBottom: '1rem', fontSize: '1.2rem' }}>
          ⚠️ {error}
        </div>
        <Link to="/" className="btn btn-primary">Voltar para Início</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem 4rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
            <h1 className="section-title" style={{ margin: 0 }}>
                {category ? category.name : 'Todos os Produtos'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                {products.length} {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
            </p>
        </div>
        
        {!categoryId && (
            <div className="tag tag-neutral">Catálogo Completo</div>
        )}
      </div>
      
      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🔍</span>
          <h3 style={{ marginBottom: '0.5rem' }}>Nenhum produto encontrado</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {categoryId ? 'Não há produtos nesta categoria no momento.' : 'Estamos atualizando nosso estoque.'}
          </p>
          <Link to="/" className="btn btn-primary">Voltar para Início</Link>
        </div>
      ) : (
        <div className="grid grid-cols-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
