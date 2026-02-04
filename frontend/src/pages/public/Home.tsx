import { useState, useEffect } from 'react';
import api from '../../services/api';
import ProductCard from '../../components/ProductCard.tsx';
import HeroBanner from '../../components/HeroBanner.tsx';
import BenefitsBar from '../../components/BenefitsBar.tsx';
import { mockProducts, mockCategories } from '../../data/mockProducts';
import type { Product, Category } from '../../types';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get<Product[]>('/products'),
          api.get<Category[]>('/categories')
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
    <div className="bg-gray-100">
      
      <HeroBanner />
      <BenefitsBar />

      <div className="container py-8 px-4">
        
        {usingMock && (
          <div className="tag tag-neutral mb-8">
            Ambiente de Demonstração
          </div>
        )}

        {/* Categories Circle Links */}
        <section className="mb-12">
          <h3 className="text-2xl mb-6 border-l-4 border-primary pl-4">
            Navegue por Categorias
          </h3>
          <div className="flex gap-8 justify-center flex-wrap">
            {categories.map(cat => (
              <div 
                key={cat._id} 
                onClick={() => scrollToCategory(cat._id)}
                className="flex flex-col items-center gap-2 cursor-pointer"
                title={`Ir para ${cat.name}`}
              >
                <div className="w-[100px] h-[100px] rounded-full bg-white border-2 border-primary flex items-center justify-center overflow-hidden transition-transform hover:scale-110">
                  <span className="text-4xl font-bold text-primary">
                    {cat.name.charAt(0)}
                  </span>
                </div>
                <span className="font-semibold text-gray-700">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Highlight Shelf */}
        <section id="destaques" className="mb-12">
          <div className="flex justify-between items-end mb-6">
            <h3 className="section-title text-3xl m-0">
              Destaques da Semana
            </h3>
          </div>
          
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
            {products.slice(0, 4).map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>

        {/* Banners */}
        <section className="mb-12 grid grid-cols-2 gap-8">
          <div className="h-[200px] bg-gray-800 rounded-lg flex items-center justify-center text-white">
            <h3>Promoção de Peças</h3>
          </div>
          <div className="h-[200px] bg-primary rounded-lg flex items-center justify-center text-white">
            <h3>Novos Modelos</h3>
          </div>
        </section>

        {/* Category Shelves */}
        {categories.map(cat => {
          const catProducts = getProductsByCategory(cat._id);
          if (catProducts.length === 0) return null;

          return (
            <section id={`category-${cat._id}`} key={cat._id} className="mb-12">
              <div className="flex justify-between items-end mb-6">
                <h3 className="section-title text-3xl m-0">
                  {cat.name}
                </h3>
              </div>
              
              <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
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
