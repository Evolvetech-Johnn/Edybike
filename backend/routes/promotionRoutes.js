const express = require('express');
const router = express.Router();
const promotionsController = require('../controllers/admin/promotions.controller');
const { protect, admin } = require('../middleware/authMiddleware');

// Todas as rotas requerem autenticação e admin
router.use(protect);
router.use(admin);

// Estatísticas
router.get('/stats', promotionsController.getPromotionsStats);

// CRUD
router.get('/', promotionsController.getPromotions);
router.get('/:id', promotionsController.getPromotionById);
router.post('/', promotionsController.createPromotion);
router.put('/:id', promotionsController.updatePromotion);
router.delete('/:id', promotionsController.deletePromotion);

// Ações
router.patch('/:id/toggle-active', promotionsController.toggleActive);
router.post('/:id/apply-to-products', promotionsController.applyPromotionToProducts);

module.exports = router;
