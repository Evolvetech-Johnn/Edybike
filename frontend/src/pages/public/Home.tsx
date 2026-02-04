import { useState, useEffect, FC } from 'react';
import api from '../../services/api';
import ProductCard from '../../components/ProductCard';
import HeroCarousel from '../../components/HeroCarousel';
// @ts-ignore - Assuming BenefitsBar exists or will be ignored if JS
import BenefitsBar from '../../components/BenefitsBar';
import { mockProducts, mockCategories } from '../../data/mockProducts';
import { Product, Category } from '../../types';

const Home: FC = () => {
  const [products, setProducts] = useState<any[]>([]); // Usando any por enquanto para compatibilidade com mockProducts antigo se diferir do novo type
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

  const getProductsByCategory = (catId: string) => {
      return products.filter(p => p.category?._id === catId || p.category?.name === catId).slice(0, 4);
  };

  const scrollToCategory = (catId: string) => {
      const element = document.getElementById(`category-${catId}`);
      if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
      }
  };

  return (
    <div style={{ backgroundColor: '#f3f4f6' }}>
      
      <HeroCarousel />
      <BenefitsBar />

      <div className="container" style={{ padding: '2rem 1rem' }}>
        
        {usingMock && (
            <div className="tag tag-neutral" style={{ marginBottom: '2rem' }}>
                Ambiente de Demonstração
            </div>
        )}

        {/* Categories Circle Links */}
        <section className="mb-12">
            <h3 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--primary-color)', paddingLeft: '1rem' }}>
                Navegue por Categorias
            </h3>
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {categories.map(cat => (
                    <div 
                        key={cat._id} 
                        onClick={() => scrollToCategory(cat._id)}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                        title={`Ir para ${cat.name}`}
                    >
                        <div style={{ 
                            width: '100px', 
                            height: '100px', 
                            borderRadius: '50%', 
                            backgroundColor: 'white', 
                            border: '2px solid var(--primary-color)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            overflow: 'hidden',
                            transition: 'transform 0.2s'
                        }}
                        className="hover-scale"
                        >
                            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                {cat.name.charAt(0)}
                            </span>
                        </div>
                        <span style={{ fontWeight: '600', color: '#374151' }}>{cat.name}</span>
                    </div>
                ))}
            </div>
        </section>

        {/* Highlight Shelf */}
        <section id="destaques" className="mb-12">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '1.5rem' }}>
                <h3 className="section-title" style={{ fontSize: '1.8rem', margin: 0 }}>
                    Destaques da Semana
                </h3>
             </div>
             
             <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                 {products.slice(0, 4).map(product => (
                     <ProductCard key={product._id} product={product} />
                 ))}
             </div>
        </section>

        {/* Banners */}
        <section className="mb-12" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div style={{ height: '200px', backgroundColor: '#1f2937', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <h3>Promoção de Peças</h3>
            </div>
            <div style={{ height: '200px', backgroundColor: 'var(--primary-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                 <h3>Novos Modelos</h3>
            </div>
        </section>

         {/* Category Shelves */}
         {categories.map(cat => {
             const catProducts = getProductsByCategory(cat._id);
             if (catProducts.length === 0) return null;

             return (
                <section id={`category-${cat._id}`} key={cat._id} className="mb-12">
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '1.5rem' }}>
                        <h3 className="section-title" style={{ fontSize: '1.8rem', margin: 0 }}>
                            {cat.name}
                        </h3>
                     </div>
                     
                     <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
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
