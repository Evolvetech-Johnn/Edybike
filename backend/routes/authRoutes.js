const express = require('express');
const router = express.Router();
const { loginUser, registerUser } = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

// Rate limit específico para autenticação (mais restritivo)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas
  message: 'Too many login attempts, please try again later.'
});

router.post('/login', authLimiter, loginUser);
router.post('/register', authLimiter, registerUser);

module.exports = router;
