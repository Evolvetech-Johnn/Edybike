import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { FaArrowLeft, FaWhatsapp } from 'react-icons/fa';
import { mockProducts } from '../../data/mockProducts';
import type { Product } from '../../types';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get<Product>(`/products/${id}`);
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

  if (loading) return <div className="container pt-16 text-center">Carregando...</div>;
  if (!product) return <div className="container pt-16 text-center">Produto não encontrado.</div>;

  return (
    <div className="container py-8 px-6">
      <Link to="/" className="inline-flex items-center gap-2 mb-8 text-gray-600 font-semibold hover:text-primary">
        <FaArrowLeft /> Voltar para o catálogo
      </Link>

      <div className="grid grid-cols-2 gap-16 items-start">
        {/* Left Column: Image */}
        <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-md flex justify-center">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="max-w-full max-h-[500px] object-contain"
          />
        </div>

        {/* Right Column: Info */}
        <div>
          <div className="mb-6">
            <span className="tag tag-neutral mb-4">
              {product.category?.name || 'Geral'}
            </span>
            <h1 className="text-4xl leading-tight mb-2 text-accent">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mt-4">
              {product.stock > 0 ? (
                <span className="tag tag-success">Disponível em Estoque</span>
              ) : (
                <span className="tag tag-danger">Produto Indisponível</span>
              )}
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">Cód: {product._id.substring(0,6)}</span>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-5xl font-extrabold text-primary">
              R$ {product.price.toFixed(2)}
            </p>
            <p className="text-gray-400 text-sm">
              À vista ou em até 12x no cartão
            </p>
          </div>

          <div className="mb-10 leading-relaxed text-gray-600">
            <h3 className="text-lg text-gray-800 mb-3">Sobre o produto</h3>
            <p className="whitespace-pre-line">{product.description}</p>
          </div>
          
          {product.stock > 0 && (
            <button className="btn btn-primary py-4 px-8 text-lg w-full">
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
