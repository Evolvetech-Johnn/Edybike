const express = require('express');
const router = express.Router();
const usersController = require('../controllers/admin/users.controller');
const { protect, admin } = require('../middleware/authMiddleware');

// Middleware para verificar permissão específica
const checkPermission = (module, action) => (req, res, next) => {
  if (req.user.role === 'super_admin') return next();
  if (req.user.permissions?.[module]?.[action]) return next();
  return res.status(403).json({ message: 'Sem permissão para esta ação' });
};

// Todas as rotas requerem autenticação e admin
router.use(protect);
router.use(admin);

// Users endpoints
router.get('/stats', checkPermission('users', 'view'), usersController.getUsersStats);
router.get('/', checkPermission('users', 'view'), usersController.getUsers);
router.get('/:id', checkPermission('users', 'view'), usersController.getUserById);
router.post('/', checkPermission('users', 'create'), usersController.createUser);
router.put('/:id', checkPermission('users', 'edit'), usersController.updateUser);
router.patch('/:id/toggle-status', checkPermission('users', 'edit'), usersController.toggleStatus);
router.delete('/:id', checkPermission('users', 'delete'), usersController.deleteUser);
router.get('/:id/activity-log', checkPermission('users', 'view'), usersController.getActivityLog);

module.exports = router;
