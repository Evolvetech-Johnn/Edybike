import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="card flex flex-col h-full">
      <div className="card-img-container">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="product-image"
          />
        ) : (
          <div className="h-60 bg-slate-100 flex items-center justify-center text-slate-400">
            Sem Imagem
          </div>
        )}
        
        <div className="absolute top-4 right-4">
          {product.stock > 0 ? (
            <span className="tag tag-success">Em Estoque</span>
          ) : (
            <span className="tag tag-danger">Esgotado</span>
          )}
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-2">
          <span className="text-sm text-gray-600 font-medium">
            {product.category?.name || 'Geral'}
          </span>
        </div>

        <h3 className="text-lg mb-2 text-gray-800">
          {product.name}
        </h3>
        
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-2xl font-extrabold text-primary">
            R$ {product.price.toFixed(2)}
          </span>
          <Link to={`/product/${product._id}`} className="btn btn-outline py-2 px-4 text-sm">
            Detalhes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
