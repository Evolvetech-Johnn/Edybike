import { useState, useEffect, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import ProductCard from '../../components/ProductCard';
import HeroCarousel from '../../components/HeroCarousel';
import BenefitsBar from '../../components/BenefitsBar';
import { mockProducts, mockCategories } from '../../data/mockProducts';
import { Product, Category } from '../../types';

const Home: FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);
        
        if (productsRes.data && productsRes.data.length > 0) {
            setProducts(productsRes.data);
            setCategories(categoriesRes.data);
        } else {
            throw new Error('No data');
        }
        setLoading(false);
      } catch (error) {
        setProducts(mockProducts);
        setCategories(mockCategories);
        setUsingMock(true);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProductsByCategory = (catNameOrId: string) => {
      // Tenta encontrar por ID ou Nome (case insensitive)
      return products.filter(p => 
          p.category?._id === catNameOrId || 
          p.category?.name?.toLowerCase() === catNameOrId.toLowerCase() ||
          p.category === catNameOrId
      ).slice(0, 4);
  };

  const navigateToCategory = (categoryId: string) => {
    navigate(`/categoria/${categoryId}`);
  };

  return (
    <div style={{ backgroundColor: '#f9fafb', paddingBottom: '4rem' }}>
      
      <HeroCarousel />
      <BenefitsBar />

      <div className="container" style={{ marginTop: '2rem' }}>
        
        {usingMock && (
            <div className="tag tag-neutral" style={{ marginBottom: '2rem' }}>
                Ambiente de Demonstração
            </div>
        )}

        {/* =========================================
            CATEGORIES ROW (Restored & Styled)
            ========================================= */}
        <section className="mb-12">
            <div className="category-row">
                {categories.map(cat => (
                    <div 
                        key={cat._id} 
                        className="category-item"
                        onClick={() => navigateToCategory(cat._id)}
                        title={`Ver ${cat.name}`}
                    >
                        <div className="category-icon-box">
                             {/* Placeholder icons based on name - In production use real icons/images */}
                             <span style={{ fontSize: '2rem', color: '#1f2937' }}>
                                {['Bicicletas', 'Mountain Bike'].includes(cat.name) ? '🚲' : 
                                 ['Capacetes', 'Acessórios'].includes(cat.name) ? '⛑️' : 
                                 ['Peças', 'Componentes'].includes(cat.name) ? '⚙️' : 
                                 ['Vestuário'].includes(cat.name) ? '👕' : '📦'}
                             </span>
                        </div>
                        <span className="category-label">{cat.name}</span>
                    </div>
                ))}
                 {/* Hardcoded extras to fill row like reference */}
                 <div className="category-item" onClick={() => navigate('/')}>
                    <div className="category-icon-box"><span>🔧</span></div>
                    <span className="category-label">Oficina</span>
                 </div>
                 <div className="category-item" onClick={() => navigate('/')}>
                    <div className="category-icon-box"><span>🛡️</span></div>
                    <span className="category-label">Seguros</span>
                 </div>
            </div>
        </section>


        {/* =========================================
            SHELF 1: DESTAQUES / LANÇAMENTOS
            ========================================= */}
        <section className="mb-12">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
                <h3 className="section-title" style={{ fontSize: '1.75rem', margin: 0, color: 'var(--accent)' }}>
                    Bicicletas Oggi
                </h3>
                <button className="btn btn-outline" style={{ border: 'none', color: '#6b7280', fontSize: '0.9rem' }} onClick={() => navigate('/')}>
                    ver mais &gt;
                </button>
             </div>
             
             <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                 {products.slice(0, 4).map(product => (
                     <ProductCard key={product._id} product={product} />
                 ))}
             </div>
        </section>

        {/* =========================================
            BANNERS GRID 2 (Reference Image 3)
            ========================================= */}
        <section className="mb-12 banner-grid-2">
            <div className="promo-banner" style={{ background: '#111827', display: 'flex', alignItems: 'center', padding: '2rem' }}>
                <div style={{ flex: 1 }}>
                     <h3 style={{ color: 'white', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Pedivela GTA</h3>
                     <p style={{ color: '#00C853', fontSize: '1.5rem', fontWeight: 800 }}>R$ 249,00</p>
                     <button className="btn btn-success" style={{ width: 'auto', marginTop: '1rem', padding: '0.5rem 1.5rem' }}>Compre já!</button>
                </div>
                 <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <img src="https://images.unsplash.com/photo-1549487922-446759c258d4?auto=format&fit=crop&q=80&w=300" alt="Pedivela" style={{ width: '150px', height: '150px', objectFit: 'contain', borderRadius: '50%', border: '4px solid #374151' }} />
                </div>
            </div>
            
             <div className="promo-banner" style={{ background: '#111827', display: 'flex', alignItems: 'center', padding: '2rem' }}>
                <div style={{ flex: 1 }}>
                     <h3 style={{ color: 'white', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Selim Brutus</h3>
                     <p style={{ color: '#00C853', fontSize: '1.5rem', fontWeight: 800 }}>R$ 89,00</p>
                     <button className="btn btn-success" style={{ width: 'auto', marginTop: '1rem', padding: '0.5rem 1.5rem' }}>Compre já!</button>
                </div>
                 <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <img src="https://images.unsplash.com/photo-1598517596541-60292b322a49?auto=format&fit=crop&q=80&w=300" alt="Selim" style={{ width: '150px', height: '150px', objectFit: 'contain', borderRadius: '50%', border: '4px solid #374151' }} />
                </div>
            </div>
        </section>

         {/* =========================================
             SHELF 2: CAPACETES ABSOLUTE (Reference Image 4)
             ========================================= */}
         {categories.length > 0 && (
            <section className="mb-12">
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
                    <h3 className="section-title" style={{ fontSize: '1.75rem', margin: 0, color: 'var(--accent)' }}>
                        Capacetes Absolute
                    </h3>
                    <button className="btn btn-outline" style={{ border: 'none', color: '#6b7280', fontSize: '0.9rem' }} onClick={() => navigateToCategory(categories[0]._id)}>
                         ver mais &gt;
                    </button>
                 </div>
                 
                 <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                     {getProductsByCategory(categories[0]._id).map(product => (
                         <ProductCard key={product._id} product={product} />
                     ))}
                 </div>
            </section>
         )}

        {/* =========================================
            BANNERS GRID 3 (Mosaic - Reference Image 5)
            ========================================= */}
        <section className="mb-12 banner-grid-3">
             {/* Big Left Banner */}
            <div className="promo-banner big-banner hover-lift" style={{ 
                minHeight: '400px',
                backgroundImage: 'url(https://images.unsplash.com/photo-1628198758804-03102434526d?auto=format&fit=crop&q=80&w=800)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex', alignItems: 'flex-end', padding: '2rem'
            }}>
                <div style={{ background: 'rgba(255,165,0,0.9)', padding: '1rem 2rem', borderRadius: '4px' }}>
                     <h3 style={{ color: 'white', margin: 0, fontSize: '1.5rem' }}>Bikes Infantis</h3>
                </div>
            </div>

            {/* Top Right */}
             <div className="promo-banner hover-lift" style={{ 
                minHeight: '200px',
                backgroundImage: 'url(https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?auto=format&fit=crop&q=80&w=600)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex', alignItems: 'flex-end', padding: '2rem'
            }}>
                <div style={{ background: 'rgba(255,165,0,0.9)', padding: '0.5rem 1.5rem', borderRadius: '4px' }}>
                     <h3 style={{ color: 'white', margin: 0, fontSize: '1.2rem' }}>Freeride</h3>
                </div>
            </div>

            {/* Bottom Right */}
            <div className="promo-banner hover-lift" style={{ 
                minHeight: '200px',
                backgroundImage: 'url(https://images.unsplash.com/photo-1576435728678-be95f39e8ab8?auto=format&fit=crop&q=80&w=600)',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 display: 'flex', alignItems: 'flex-end', padding: '2rem'
            }}>
                 <div style={{ background: 'rgba(255,165,0,0.9)', padding: '0.5rem 1.5rem', borderRadius: '4px' }}>
                     <h3 style={{ color: 'white', margin: 0, fontSize: '1.2rem' }}>Mountain Bike</h3>
                </div>
            </div>
        </section>

         {/* =========================================
             SHELF 3: OUTRAS CATEGORIAS
             ========================================= */}
         {categories.slice(1, 4).map(cat => {
             const catProducts = getProductsByCategory(cat._id);
             if (catProducts.length === 0) return null;

             return (
                <section key={cat._id} className="mb-12">
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
                        <h3 className="section-title" style={{ fontSize: '1.75rem', margin: 0, color: 'var(--accent)' }}>
                            {cat.name}
                        </h3>
                         <button className="btn btn-outline" style={{ border: 'none', color: '#6b7280', fontSize: '0.9rem' }} onClick={() => navigateToCategory(cat._id)}>
                             ver mais &gt;
                        </button>
                     </div>
                     
                     <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                         {catProducts.map(product => (
                             <ProductCard key={product._id} product={product} />
                         ))}
                     </div>
                </section>
             );
         })}

      </div>
    </div>
  );
};

export default Home;
