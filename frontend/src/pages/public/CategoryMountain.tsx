import { useState, FC } from 'react';
import { Link } from 'react-router-dom';
import { mountainBikes, formatPrice } from '../../data/categoryProducts';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types';
import { FaStar, FaShoppingCart, FaEye } from 'react-icons/fa';

const CategoryMountain: FC = () => {
  const [products] = useState<Product[]>(mountainBikes);
  const { addToCart } = useCart();

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
        padding: '4rem 0',
        color: 'white',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem' }}>
          Mountain Bikes
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
            Bikes para trilhas e aventuras off-road
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container" style={{ padding: '3rem 1rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {products.map((product) => (
            <div key={product.id} className="card fade-in">
              {/* Image */}
              <div className="card-img-container" style={{ height: '250px', position: 'relative' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
                {!product.inStock && (
                  <div className="tag tag-danger" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                    Esgotado
                  </div>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: '1.5rem' }}>
                {/* Brand/Model */}
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  {product.brand} • {product.model}
                </p>

                {/* Name */}
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: '700' }}>
                  {product.name}
                </h3>

                {/* Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', color: '#fbbf24' }}>
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} style={{ fontSize: '0.875rem', opacity: i < Math.floor(product.rating) ? 1 : 0.3 }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {product.rating} ({product.reviews} avaliações)
                  </span>
                </div>

                {/* Features */}
                <div style={{ marginBottom: '1rem' }}>
                  {product.features.slice(0, 3).map((feature, index) => (
                    <span key={index} className="tag tag-neutral" style={{ margin: '0.25rem' }}>
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Price */}
                <div style={{
                  fontSize: '1.75rem',
                  fontWeight: '800',
                  color: '#0066cc',
                  marginBottom: '1rem'
                }}>
                  {formatPrice(product.price)}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Link
                    to={`/product/${product.id}`}
                    className="btn btn-outline"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <FaEye /> Detalhes
                  </Link>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    disabled={!product.inStock}
                    onClick={() => addToCart(product, 1)}
                  >
                    <FaShoppingCart /> {product.inStock ? 'Comprar' : 'Indisponível'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryMountain;
