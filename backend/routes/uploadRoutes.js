const express = require('express');
const router = express.Router();
const { upload } = require('../config/uploadConfig');
const uploadController = require('../controllers/admin/upload.controller');
const { protect, admin } = require('../middleware/authMiddleware');

// Todas as rotas requerem autenticação e admin
router.use(protect);
router.use(admin);

// Upload de múltiplas imagens (máximo 5)
router.post(
  '/product-images',
  upload.array('images', 5),
  uploadController.uploadProductImages
);

// Deletar uma imagem específica
router.delete(
  '/product-images/:productId/:publicId',
  uploadController.deleteProductImage
);

// Definir imagem principal
router.patch(
  '/product-images/set-main',
  uploadController.setMainImage
);

// Reordenar imagens
router.patch(
  '/product-images/reorder',
  uploadController.reorderImages
);

module.exports = router;
