const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedido.controller');

/**
 * @route   POST /api/pedidos
 * @desc    Cria novo pedido (antes do pagamento)
 * @access  Public
 */
router.post('/pedidos', pedidoController.criar);

/**
 * @route   GET /api/pedidos/:id
 * @desc    Busca pedido por ID
 * @access  Public (adicionar auth em produção)
 */
router.get('/pedidos/:id', pedidoController.buscarPorId);

/**
 * @route   GET /api/pedidos/cliente/:email
 * @desc    Lista pedidos de um cliente
 * @access  Public (adicionar auth em produção)
 */
router.get('/pedidos/cliente/:email', pedidoController.listarPorCliente);

/**
 * @route   POST /api/webhooks/pagamento
 * @desc    Webhook de aprovação de pagamento
 * @access  Public (validar token secreto em produção)
 */
router.post('/webhooks/pagamento', pedidoController.webhookPagamento);

/**
 * @route   GET /api/pedidos/:id/rastreio
 * @desc    Consulta rastreamento de um pedido
 * @access  Public
 */
router.get('/pedidos/:id/rastreio', pedidoController.rastrear);

module.exports = router;
