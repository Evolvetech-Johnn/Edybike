import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { FaArrowLeft, FaWhatsapp } from 'react-icons/fa';
import { mockProducts } from '../../data/mockProducts';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        const mock = mockProducts.find(p => p._id === id);
        if (mock) setProduct(mock);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>Carregando...</div>;
  if (!product) return <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>Produto não encontrado.</div>;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
        <FaArrowLeft /> Voltar para o catálogo
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
        {/* Left Column: Image */}
        <div style={{ 
            backgroundColor: 'white', 
            borderRadius: 'var(--radius-lg)', 
            padding: '2rem', 
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            justifyContent: 'center'
        }}>
           <img 
             src={product.imageUrl} 
             alt={product.name} 
             style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
           />
        </div>

        {/* Right Column: Info */}
        <div>
           <div style={{ marginBottom: '1.5rem' }}>
             <span className="tag tag-neutral" style={{ marginBottom: '1rem' }}>
                {product.category?.name || 'Geral'}
             </span>
             <h1 style={{ fontSize: '2.5rem', lineHeight: 1.1, marginBottom: '0.5rem', color: 'var(--accent-color)' }}>
                {product.name}
             </h1>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                 {product.stock > 0 ? (
                    <span className="tag tag-success">Disponível em Estoque</span>
                 ) : (
                    <span className="tag tag-danger">Produto Indisponível</span>
                 )}
                 <span style={{ color: 'var(--text-light)' }}>|</span>
                 <span style={{ color: 'var(--text-secondary)' }}>Cód: {product._id.substring(0,6)}</span>
             </div>
           </div>

           <div style={{ marginBottom: '2rem' }}>
             <p style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary-color)' }}>
               R$ {product.price.toFixed(2)}
             </p>
             <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                À vista ou em até 12x no cartão
             </p>
           </div>

           <div style={{ marginBottom: '2.5rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
             <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>Sobre o produto</h3>
             <p style={{ whiteSpace: 'pre-line' }}>{product.description}</p>
           </div>
           
           {product.stock > 0 && (
             <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', width: '100%' }}>
               <FaWhatsapp size={20} />
               Tenho Interesse / Comprar
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
