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

      <div className="container">
        
        {usingMock && (
            <div className="tag tag-neutral" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
                Ambiente de Demonstração
            </div>
        )}

        {/* =========================================
            SHELF 1: DESTAQUES / LANÇAMENTOS
            ========================================= */}
        <section className="mb-12" style={{ marginTop: '3rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
                <h3 className="section-title" style={{ fontSize: '1.75rem', margin: 0, color: 'var(--accent)' }}>
                    Destaques da Semana
                </h3>
             </div>
             
             <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
                 {products.slice(0, 4).map(product => (
                     <ProductCard key={product._id} product={product} />
                 ))}
             </div>
        </section>

        {/* =========================================
            BANNERS PROMOCIONAIS 1
            ========================================= */}
        <section className="mb-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="hover-lift" style={{ 
                height: '250px', 
                background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1549487922-446759c258d4?auto=format&fit=crop&q=80&w=800)', 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '8px', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'white',
                padding: '2rem',
                textAlign: 'center'
            }}>
                <h3 style={{ color: 'white', marginBottom: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Linha Infantil</h3>
                <p style={{ marginBottom: '1.5rem', opacity: 0.9 }}>Diversão garantida para os pequenos</p>
                <button className="btn btn-primary" onClick={() => navigate('/')}>Conferir Ofertas</button>
            </div>
            
            <div className="hover-lift" style={{ 
                height: '250px', 
                background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1563214227-814a6012059c?auto=format&fit=crop&q=80&w=800)', 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                borderRadius: '8px', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'white',
                padding: '2rem',
                textAlign: 'center'
            }}>
                 <h3 style={{ color: 'white', marginBottom: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Peças de Reposição</h3>
                 <p style={{ marginBottom: '1.5rem', opacity: 0.9 }}>Mantenha sua bike sempre nova</p>
                 <button className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }} onClick={() => navigate('/')}>Ver Catálogo</button>
            </div>
        </section>

         {/* =========================================
             SHELF 2: CATEGORIA ESPECÍFICA (Ex: Mountain Bike)
             ========================================= */}
         {categories.length > 0 && (
            <section className="mb-12">
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
                    <h3 className="section-title" style={{ fontSize: '1.75rem', margin: 0, color: 'var(--accent)' }}>
                        {categories[0].name}
                    </h3>
                    <button 
                        className="btn btn-outline" 
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                        onClick={() => navigateToCategory(categories[0]._id)}
                    >
                        Ver Todos
                    </button>
                 </div>
                 
                 <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
                     {getProductsByCategory(categories[0]._id).map(product => (
                         <ProductCard key={product._id} product={product} />
                     ))}
                 </div>
            </section>
         )}

        {/* =========================================
            FULL WIDTH BANNER
            ========================================= */}
        <section className="mb-12 hover-glow">
            <div style={{ 
                borderRadius: '12px', 
                overflow: 'hidden', 
                position: 'relative',
                height: '300px',
            }}>
                <img 
                    src="https://images.unsplash.com/photo-1558507306-4b13d2a01344?auto=format&fit=crop&q=80&w=1200" 
                    alt="Promoção Especial" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ 
                    position: 'absolute', 
                    top: 0, left: 0, width: '100%', height: '100%',
                    background: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '3rem'
                }}>
                    <h2 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1rem', maxWidth: '600px' }}>
                        Equipamentos Profissionais
                    </h2>
                    <p style={{ color: '#d1d5db', fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '500px' }}>
                        Eleve seu desempenho com nossa linha de acessórios premium.
                    </p>
                    <div>
                        <button className="btn btn-primary" onClick={() => navigate('/')}>Comprar Agora</button>
                    </div>
                </div>
            </div>
        </section>

         {/* =========================================
             SHELF 3: OUTRAS CATEGORIAS
             ========================================= */}
         {categories.slice(1, 3).map(cat => {
             const catProducts = getProductsByCategory(cat._id);
             if (catProducts.length === 0) return null;

             return (
                <section key={cat._id} className="mb-12">
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
                        <h3 className="section-title" style={{ fontSize: '1.75rem', margin: 0, color: 'var(--accent)' }}>
                            {cat.name}
                        </h3>
                        <button 
                            className="btn btn-outline" 
                            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                            onClick={() => navigateToCategory(cat._id)}
                        >
                            Ver Todos
                        </button>
                     </div>
                     
                     <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
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
