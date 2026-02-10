import express from 'express';
import { upload } from '../config/uploadConfig'; // Agora importando do .ts
import * as uploadController from '../controllers/admin/upload.controller'; // .ts
import { protect, admin } from '../middleware/authMiddleware'; // .ts

const router = express.Router();

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

export default router;
