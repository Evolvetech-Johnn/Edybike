const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/admin/settings.controller');
const { protect, admin } = require('../middleware/authMiddleware');

// Middleware para verificar permissão
const checkPermission = (module, action) => (req, res, next) => {
  if (req.user.role === 'super_admin') return next();
  if (req.user.permissions?.[module]?.[action]) return next();
  return res.status(403).json({ message: 'Sem permissão para esta ação' });
};

// Public endpoint (sem autenticação)
router.get('/public', settingsController.getPublicSettings);

// Admin endpoints (protected)
router.use(protect);
router.use(admin);

router.get('/', checkPermission('settings', 'view'), settingsController.getSettings);
router.put('/', checkPermission('settings', 'edit'), settingsController.updateSettings);

module.exports = router;
