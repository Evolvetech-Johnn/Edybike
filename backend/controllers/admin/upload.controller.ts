import { Request, Response } from 'express';
import Product, { ProductDocument } from '../../models/Product';
import { v2 as cloudinary } from 'cloudinary';

// Upload de múltiplas imagens do produto
const uploadProductImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = (req as any).files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      res.status(400).json({ message: 'Nenhuma imagem enviada' });
      return;
    }

    const images = files.map((file, index) => ({
      url: file.path,
      publicId: file.filename,
      isMain: index === 0, // Primeira imagem é a principal por padrão
      order: index
    }));

    res.status(200).json(images);
  } catch (error: any) {
    console.error('Erro no upload:', error);
    res.status(500).json({ message: 'Erro ao fazer upload das imagens', error: error.message });
  }
};

// Deletar imagem
const deleteProductImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, publicId } = req.params;

    // Remover do Cloudinary
    // O publicId vem na URL, pode precisar decodificar ou tratar
    // Cloudinary espera o public_id sem extensão, mas geralmente o filename do storage já é o public_id
    
    // Configurar o nome da pasta corretamente se necessário
    // const fullPublicId = `edy-bike/products/${publicId}`; // Ajuste conforme seu setup
    // Mas se o publicId passado já for o completo
    
    await cloudinary.uploader.destroy(publicId as string);

    // Se tiver productId, remove do banco também (opcional, dependendo se a imagem já foi salva no produto)
    if (productId && productId !== 'undefined' && productId !== 'null') {
      await Product.findByIdAndUpdate(productId, {
        $pull: { images: { publicId: publicId } }
      });
    }

    res.status(200).json({ message: 'Imagem removida com sucesso' });
  } catch (error: any) {
    console.error('Erro ao deletar imagem:', error);
    res.status(500).json({ message: 'Erro ao deletar imagem', error: error.message });
  }
};

// Definir imagem principal
const setMainImage = async (req: Request, res: Response): Promise<void> => {
    // Implementação pendente ou simplificada de acordo com o JS original
    res.status(501).json({ message: 'Not implemented yet' });
};

// Reordenar imagens
const reorderImages = async (req: Request, res: Response): Promise<void> => {
    // Implementação pendente
    res.status(501).json({ message: 'Not implemented yet' });
};

export {
  uploadProductImages,
  deleteProductImage,
  setMainImage,
  reorderImages
};
