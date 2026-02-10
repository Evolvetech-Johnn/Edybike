import { FC, useState } from 'react';
import { FaStar, FaTrash, FaRegStar } from 'react-icons/fa';

interface ProductImage {
  url: string;
  publicId: string;
  isMain: boolean;
  order: number;
}

interface ImagePreviewProps {
  image: ProductImage;
  productId: string;
  onDelete: (publicId: string) => void;
  onSetMain: (publicId: string) => void;
}

const ImagePreview: FC<ImagePreviewProps> = ({
  image,
  productId,
  onDelete,
  onSetMain
}) => {
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja remover esta imagem?')) {
      return;
    }

    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `http://localhost:5000/api/admin/upload/product-images/${productId}/${image.publicId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao deletar imagem');
      }

      onDelete(image.publicId);

    } catch (error: any) {
      console.error('Erro ao deletar imagem:', error);
      alert(error.message || 'Erro ao deletar imagem');
    } finally {
      setDeleting(false);
    }
  };

  const handleSetMain = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        'http://localhost:5000/api/admin/upload/product-images/set-main',
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            productId,
            publicId: image.publicId
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao definir imagem principal');
      }

      onSetMain(image.publicId);

    } catch (error: any) {
      console.error('Erro ao definir imagem principal:', error);
      alert(error.message || 'Erro ao definir imagem principal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className={`admin-image-preview ${image.isMain ? 'main' : ''}`}
      style={{
        position: 'relative',
        opacity: deleting || loading ? 0.5 : 1,
        pointerEvents: deleting || loading ? 'none' : 'auto'
      }}
    >
      <img 
        src={image.url} 
        alt="Product"
        style={{
          width: '100%',
          aspectRatio: '1',
          objectFit: 'cover'
        }}
      />
      
      {image.isMain && (
        <div style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          backgroundColor: 'var(--admin-primary)',
          color: 'white',
          padding: '0.25rem 0.5rem',
          borderRadius: 'var(--admin-radius-sm)',
          fontSize: '0.75rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          <FaStar size={12} /> Principal
        </div>
      )}

      <div className="admin-image-actions">
        <button
          className="admin-btn admin-btn-sm"
          onClick={handleSetMain}
          disabled={image.isMain || loading}
          style={{
            backgroundColor: image.isMain ? 'var(--admin-success)' : 'white',
            color: image.isMain ? 'white' : 'var(--admin-text)',
            flex: 1
          }}
          title={image.isMain ? 'Imagem principal' : 'Definir como principal'}
        >
          {image.isMain ? <FaStar size={14} /> : <FaRegStar size={14} />}
        </button>
        
        <button
          className="admin-btn admin-btn-sm"
          onClick={handleDelete}
          disabled={deleting}
          style={{
            backgroundColor: 'var(--admin-danger)',
            color: 'white'
          }}
          title="Remover imagem"
        >
          <FaTrash size={14} />
        </button>
      </div>
    </div>
  );
};

export default ImagePreview;
