const { cloudinary } = require('../../config/uploadConfig');
const Product = require('../../models/Product');

// Upload de múltiplas imagens para um produto
const uploadProductImages = async (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ message: 'Product ID é obrigatório' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Nenhuma imagem foi enviada' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      // Deletar imagens enviadas se produto não existir
      for (const file of req.files) {
        await cloudinary.uploader.destroy(file.filename);
      }
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    // Verificar limite de 5 imagens
    const currentImageCount = product.images?.length || 0;
    const newImageCount = req.files.length;
    
    if (currentImageCount + newImageCount > 5) {
      // Deletar imagens enviadas
      for (const file of req.files) {
        await cloudinary.uploader.destroy(file.filename);
      }
      return res.status(400).json({ 
        message: `Limite de 5 imagens por produto. Você já tem ${currentImageCount} imagem(ns).`
      });
    }

    // Preparar novos objetos de imagem
    const newImages = req.files.map((file, index) => ({
      url: file.path,
      publicId: file.filename,
      isMain: currentImageCount === 0 && index === 0, // Primeira imagem é principal se não houver outras
      order: currentImageCount + index
    }));

    // Adicionar imagens ao produto
    if (!product.images) {
      product.images = [];
    }
    product.images.push(...newImages);

    await product.save();

    res.json({
      message: 'Imagens enviadas com sucesso',
      images: product.images
    });

  } catch (error) {
    console.error('Erro no upload de imagens:', error);
    
    // Tentar deletar imagens enviadas em caso de erro
    if (req.files) {
      for (const file of req.files) {
        try {
          await cloudinary.uploader.destroy(file.filename);
        } catch (delError) {
          console.error('Erro ao deletar imagem:', delError);
        }
      }
    }
    
    res.status(500).json({ message: 'Erro ao fazer upload das imagens' });
  }
};

// Deletar uma imagem específica
const deleteProductImage = async (req, res) => {
  try {
    const { productId, publicId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    // Encontrar índice da imagem
    const imageIndex = product.images.findIndex(img => img.publicId === publicId);
    
    if (imageIndex === -1) {
      return res.status(404).json({ message: 'Imagem não encontrada' });
    }

    const wasMain = product.images[imageIndex].isMain;

    // Deletar do Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Remover do array
    product.images.splice(imageIndex, 1);

    // Se era a principal e ainda há imagens, definir a primeira como principal
    if (wasMain && product.images.length > 0) {
      product.images[0].isMain = true;
    }

    // Reordenar
    product.images.forEach((img, idx) => {
      img.order = idx;
    });

    await product.save();

    res.json({
      message: 'Imagem deletada com sucesso',
      images: product.images
    });

  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    res.status(500).json({ message: 'Erro ao deletar imagem' });
  }
};

// Definir imagem principal
const setMainImage = async (req, res) => {
  try {
    const { productId, publicId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    // Remover isMain de todas as imagens
    product.images.forEach(img => {
      img.isMain = img.publicId === publicId;
    });

    await product.save();

    res.json({
      message: 'Imagem principal definida',
      images: product.images
    });

  } catch (error) {
    console.error('Erro ao definir imagem principal:', error);
    res.status(500).json({ message: 'Erro ao definir imagem principal' });
  }
};

// Reordenar imagens
const reorderImages = async (req, res) => {
  try {
    const { productId, imageOrder } = req.body;
    // imageOrder deve ser array de publicIds na nova ordem

    if (!Array.isArray(imageOrder)) {
      return res.status(400).json({ message: 'imageOrder deve ser um array' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    // Criar mapa de publicId para imagem
    const imageMap = new Map();
    product.images.forEach(img => {
      imageMap.set(img.publicId, img);
    });

    // Reordenar baseado no array recebido
    const reorderedImages = [];
    imageOrder.forEach((publicId, index) => {
      const img = imageMap.get(publicId);
      if (img) {
        img.order = index;
        reorderedImages.push(img);
      }
    });

    product.images = reorderedImages;
    await product.save();

    res.json({
      message: 'Imagens reordenadas com sucesso',
      images: product.images
    });

  } catch (error) {
    console.error('Erro ao reordenar imagens:', error);
    res.status(500).json({ message: 'Erro ao reordenar imagens' });
  }
};

module.exports = {
  uploadProductImages,
  deleteProductImage,
  setMainImage,
  reorderImages
};
