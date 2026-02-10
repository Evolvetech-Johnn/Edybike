const express = require('express');
const router = express.Router();
const freteController = require('../controllers/frete.controller');

/**
 * @route   POST /api/calcular-frete
 * @desc    Calcula opções de frete para checkout
 * @access  Public
 * @body    { cepDestino, peso, valor, dimensoes? }
 */
router.post('/calcular-frete', freteController.simularFrete);

/**
 * @route   GET /api/frete/limpar-cache
 * @desc    Limpa cache de cálculos (admin)
 * @access  Private (Admin)
 */
router.get('/frete/limpar-cache', freteController.limparCache);

module.exports = router;
