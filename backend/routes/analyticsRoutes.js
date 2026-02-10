const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/admin/analytics.controller');
const { protect, admin } = require('../middleware/authMiddleware');

// Todas as rotas requerem autenticação e admin
router.use(protect);
router.use(admin);

// Analytics endpoints
router.get('/summary', analyticsController.getSummary);
router.get('/revenue', analyticsController.getRevenue);
router.get('/orders-trend', analyticsController.getOrdersTrend);
router.get('/top-products', analyticsController.getTopProducts);
router.get('/conversion-rate', analyticsController.getConversionRate);
router.get('/inventory-status', analyticsController.getInventoryStatus);

module.exports = router;
