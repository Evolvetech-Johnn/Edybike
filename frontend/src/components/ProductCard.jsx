import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="card-img-container">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="product-image"
          />
          {!product.imageUrl && (
            <div style={{ height: '240px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                Sem Imagem
            </div>
          )}
          
          <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
             {product.stock > 0 ? (
                 <span className="tag tag-success">Em Estoque</span>
             ) : (
                 <span className="tag tag-danger">Esgotado</span>
             )}
          </div>
      </div>
      
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="mb-2">
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {product.category?.name || 'Geral'}
            </span>
        </div>

        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
            {product.name}
        </h3>
        
        <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-color)' }}>
                R$ {product.price.toFixed(2)}
            </span>
            <Link to={`/product/${product._id}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                Detalhes
            </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
