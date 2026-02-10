import { FC, useState, DragEvent } from 'react';
import { FaCloudUploadAlt, FaImage } from 'react-icons/fa';

interface ProductImage {
  url: string;
  publicId: string;
  isMain: boolean;
  order: number;
}

interface ImageUploadProps {
  images: ProductImage[];
  productId?: string;
  onUploadComplete: (newImages: ProductImage[]) => void;
  maxImages?: number;
}

const ImageUpload: FC<ImageUploadProps> = ({
  images,
  productId,
  onUploadComplete,
  maxImages = 5
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const canUploadMore = images.length < maxImages;

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0 || !productId) return;

    const filesArray = Array.from(files);
    const remainingSlots = maxImages - images.length;

    if (filesArray.length > remainingSlots) {
      alert(`Você pode adicionar no máximo ${remainingSlots} imagem(ns) adicionais.`);
      return;
    }

    // Validar arquivos
    for (const file of filesArray) {
      if (!file.type.startsWith('image/')) {
        alert(`O arquivo "${file.name}" não é uma imagem válida.`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`O arquivo "${file.name}" excede o tamanho máximo de 5MB.`);
        return;
      }
    }

    await uploadFiles(filesArray);
  };

  const uploadFiles = async (files: File[]) => {
    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('productId', productId!);
    
    files.forEach(file => {
      formData.append('images', file);
    });

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/admin/upload/product-images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao fazer upload');
      }

      const data = await response.json();
      setUploadProgress(100);
      
      setTimeout(() => {
        onUploadComplete(data.images);
        setUploadProgress(0);
        setUploading(false);
      }, 500);

    } catch (error: any) {
      console.error('Erro no upload:', error);
      alert(error.message || 'Erro ao fazer upload das imagens');
      setUploadProgress(0);
      setUploading(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  if (!productId) {
    return (
      <div style={{
        padding: '2rem',
        border: '2px dashed var(--admin-border)',
        borderRadius: 'var(--admin-radius)',
        textAlign: 'center',
        color: 'var(--admin-text-secondary)'
      }}>
        <FaImage size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
        <p>Salve o produto antes de adicionar imagens</p>
      </div>
    );
  }

  if (!canUploadMore) {
    return (
      <div style={{
        padding: '2rem',
        border: '2px solid var(--admin-success)',
        borderRadius: 'var(--admin-radius)',
        textAlign: 'center',
        backgroundColor: 'rgba(16, 185, 129, 0.05)'
      }}>
        <p style={{ color: 'var(--admin-success)', fontWeight: '600' }}>
          ✓ Limite de {maxImages} imagens atingido
        </p>
      </div>
    );
  }

  return (
    <div>
      <div
        className={`admin-image-upload ${dragOver ? 'dragover' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => {
          if (!uploading) {
            document.getElementById('file-input')?.click();
          }
        }}
        style={{
          position: 'relative',
          opacity: uploading ? 0.6 : 1,
          pointerEvents: uploading ? 'none' : 'auto'
        }}
      >
        <input
          id="file-input"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          style={{ display: 'none' }}
        />

        <FaCloudUploadAlt 
          size={48} 
          style={{ 
            color: dragOver ? 'var(--admin-primary)' : 'var(--admin-text-muted)',
            marginBottom: '1rem'
          }} 
        />
        
        <h3 style={{ 
          fontSize: '1.125rem', 
          fontWeight: '600', 
          marginBottom: '0.5rem',
          color: dragOver ? 'var(--admin-primary)' : 'inherit'
        }}>
          {dragOver ? 'Solte as imagens aqui' : 'Arraste imagens ou clique para selecionar'}
        </h3>
        
        <p style={{ color: 'var(--admin-text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
          Máximo {maxImages} imagens • PNG, JPG, WEBP • Até 5MB cada
        </p>
        
        <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem' }}>
          {images.length}/{maxImages} imagens adicionadas
        </p>

        {uploading && (
          <div style={{ marginTop: '1rem' }}>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'var(--admin-bg)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${uploadProgress}%`,
                height: '100%',
                backgroundColor: 'var(--admin-primary)',
                transition: 'width 0.3s'
              }} />
            </div>
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--admin-primary)' }}>
              Fazendo upload... {uploadProgress}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
