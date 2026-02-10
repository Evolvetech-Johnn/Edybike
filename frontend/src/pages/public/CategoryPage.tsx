import { FC, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  images?: string[];
  stock: number;
}

interface Category {
  _id: string;
  name: string;
}

const CategoryPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch category details
        const categoryRes = await api.get(`/categories/${id}`);
        setCategory(categoryRes.data);
        
        // Fetch products by category
        const productsRes = await api.get(`/products?category=${id}`);
        setProducts(productsRes.data);
        
        setError('');
      } catch (err: any) {
        console.error('Erro ao carregar categoria:', err);
        console.error('Detalhes do erro:', err.response?.data || err.message);
        setError('Erro ao carregar produtos desta categoria. Verifique o console para mais detalhes.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Carregando produtos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        <p>{error}</p>
        <Link to="/">Voltar para a página inicial</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        {category?.name || 'Categoria'}
      </h1>
      
      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Nenhum produto encontrado nesta categoria.</p>
          <Link to="/">Voltar para a página inicial</Link>
        </div>
      ) : (
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginTop: '2rem'
          }}
        >
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                border: '1px solid #ddd',
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ position: 'relative', paddingTop: '100%', background: '#f5f5f5' }}>
                {/* Safe image rendering check */}
                {(product.imageUrl || (product.images && product.images.length > 0)) ? (
                  <img
                    src={product.imageUrl || (product.images ? product.images[0] : '')}
                    alt={product.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Sem+Imagem';
                    }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: '#999',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column'
                    }}
                  >
                    <span>🖼️</span>
                    <span style={{ fontSize: '0.8rem' }}>Sem imagem</span>
                  </div>
                )}
              </div>
              <div style={{ padding: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                  {product.name}
                </h3>
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: '#666', 
                  marginBottom: '0.75rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {product.description}
                </p>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginTop: '1rem'
                }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#e63946' }}>
                    {formatPrice(product.price)}
                  </span>
                  {product.stock > 0 ? (
                    <span style={{ fontSize: '0.85rem', color: '#28a745' }}>
                      Em estoque
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: '#dc3545' }}>
                      Esgotado
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
