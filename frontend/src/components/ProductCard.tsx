import { Link } from 'react-router-dom';
import { Product } from '../types';
import { getProductImage } from '../services/imagePlaceholder';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product as any, 1);
  };

  return (
    <Link to={`/product/${product._id}`} className="product-card-link">
      <div className="product-card">
        <div className="product-card-image">
          <img 
            src={imageUrl} 
            alt={product.name}
            loading="lazy"
          />
          {product.stock > 0 && (
            <span className="badge-stock-new">Em estoque</span>
          )}
        </div>
        
        <div className="product-card-content">
          <span className="product-category">{categoryName}</span>
          
          <h3 className="product-name">{product.name}</h3>
          
          <div className="product-pricing">
            <span className="product-price">
              R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="product-installment">
              {parcelas}x de R$ {valorParcela.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          
          <div className="product-actions">
            <button 
              onClick={handleAddToCart}
              className="btn-add-cart"
              disabled={product.stock === 0}
            >
              <FaShoppingCart />
              <span>Adicionar</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
