import { Link } from 'react-router-dom';
import { Product } from '../types';
import { getProductImage } from '../services/imagePlaceholder';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { showSuccessToast } from '../components/ToastProvider';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const categoryName = typeof product.category === 'string' 
    ? product.category 
    : product.category?.name || 'Geral';
  const imageUrl = getProductImage(product.imageUrl, categoryName, product.name);
  const parcelas = 12;
  const valorParcela = product.price / parcelas;
  const pixPrice = product.price * 0.95; // 5% de desconto

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product as any, 1);
    showSuccessToast(`${product.name} adicionado ao carrinho!`);
  };

  return (
    <Link to={`/product/${product._id}`} className="product-card-link" style={{ textDecoration: 'none' }}>
      <div className="product-card">
        <div className="product-card-image" style={{ marginBottom: '1rem', position: 'relative' }}>
          <img 
            src={imageUrl} 
            alt={product.name}
            loading="lazy"
            style={{ width: '100%', height: '200px', objectFit: 'contain' }}
          />
          {product.stock > 0 && product.price < 500 && (
             <span className="tag tag-danger" style={{ position: 'absolute', top: 0, left: 0, fontSize: '0.7rem' }}>Promoção</span>
          )}
        </div>
        
        <div className="product-card-content" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 className="product-name" style={{ fontSize: '0.95rem', color: '#4b5563', marginBottom: '0.5rem', fontWeight: 400, height: '40px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {product.name}
          </h3>
          
          <div className="product-pricing" style={{ marginTop: 'auto' }}>
            <span className="product-price">
              R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="product-installment">
              ou 10x de R$ {valorParcela.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className="pix-price-tag">
                <span className="pix-highlight">R$ {pixPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> no Pix
            </div>
          </div>
          
          <div className="product-actions" style={{ marginTop: '1rem' }}>
            <button 
              onClick={handleAddToCart}
              className="btn btn-success"
              disabled={product.stock === 0}
            >
              ADICIONAR AO CARRINHO
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
