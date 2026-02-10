/**
 * Admin Routes - Centralized
 * Todas as rotas administrativas consolidadas
 */

const express = require('express');
const router = express.Router();

// Middleware
const { protect } = require('../../../middleware/authMiddleware');
const { requireAdmin, checkPermission } = require('../../../middleware/permissions');
const { auditLog } = require('../../../middleware/auditLog');

// Controllers
const dashboardController = require('../../controllers/admin/dashboard.controller');
const productsController = require('../../controllers/admin/products.controller');
const ordersController = require('../../controllers/admin/orders.controller');
const inventoryController = require('../../controllers/admin/inventory.controller');

// ====== DASHBOARD ======
router.get('/dashboard/kpis', 
  protect, 
  requireAdmin, 
  dashboardController.getKPIs
);

router.get('/dashboard/sales-chart', 
  protect, 
  requireAdmin, 
  dashboardController.getSalesChart
);

router.get('/dashboard/top-products', 
  protect, 
  requireAdmin, 
  dashboardController.getTopProducts
);

router.get('/dashboard/recent-orders', 
  protect, 
  requireAdmin, 
  dashboardController.getRecentOrders
);

router.get('/dashboard/low-stock', 
  protect, 
  requireAdmin, 
  dashboardController.getLowStock
);

// ====== PRODUCTS ======
router.get('/products', 
  protect, 
  requireAdmin, 
  productsController.getAll
);

router.patch('/products/:id/toggle-active', 
  protect, 
  requireAdmin, 
  auditLog('update', 'product'),
  productsController.toggleActive
);

router.patch('/products/:id/featured', 
  protect, 
  requireAdmin, 
  auditLog('update', 'product'),
  productsController.toggleFeatured
);

router.patch('/products/:id/sale', 
  protect, 
  requireAdmin, 
  auditLog('price_change', 'product'),
  productsController.setSale
);

router.patch('/products/:id/stock', 
  protect, 
  requireAdmin, 
  auditLog('stock_adjust', 'product'),
  productsController.adjustStock
);

router.delete('/products/:id', 
  protect, 
  requireAdmin, 
  auditLog('soft_delete', 'product'),
  productsController.softDelete
);

router.post('/products/:id/restore', 
  protect, 
  requireAdmin, 
  auditLog('update', 'product'),
  productsController.restore
);

router.patch('/products/bulk', 
  protect, 
  requireAdmin, 
  auditLog('update', 'product'),
  productsController.bulkAction
);

// ====== ORDERS ======
router.get('/orders', 
  protect, 
  requireAdmin, 
  ordersController.getAll
);

router.get('/orders/stats', 
  protect, 
  requireAdmin, 
  ordersController.getStats
);

router.get('/orders/:id', 
  protect, 
  requireAdmin, 
  ordersController.getById
);

router.patch('/orders/:id/status', 
  protect, 
  requireAdmin, 
  auditLog('update', 'order'),
  ordersController.updateStatus
);

router.post('/orders/:id/cancel', 
  protect, 
  requireAdmin, 
  auditLog('order_cancel', 'order'),
  ordersController.cancel
);

router.get('/orders/:id/tracking', 
  protect, 
  requireAdmin, 
  ordersController.getTracking
);

// ====== INVENTORY ======
router.get('/inventory/current', 
  protect, 
  requireAdmin, 
  inventoryController.getCurrentStock
);

router.get('/inventory/movements', 
  protect, 
  requireAdmin, 
  inventoryController.getMovements
);

router.get('/inventory/product/:productId/history', 
  protect, 
  requireAdmin, 
  inventoryController.getProductHistory
);

router.post('/inventory/adjust', 
  protect, 
  requireAdmin, 
  auditLog('stock_adjust', 'stock'),
  inventoryController.adjustStock
);

router.get('/inventory/alerts', 
  protect, 
  requireAdmin, 
  inventoryController.getLowStockAlerts
);

router.get('/inventory/stats', 
  protect, 
  requireAdmin, 
  inventoryController.getStats
);

module.exports = router;
