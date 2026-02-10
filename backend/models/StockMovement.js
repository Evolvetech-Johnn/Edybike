const mongoose = require('mongoose');

/**
 * Model para rastrear movimentações de estoque
 * Histórico completo de entradas, saídas e ajustes
 */
const StockMovementSchema = new mongoose.Schema({
  // Produto relacionado
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  
  // Tipo de movimentação
  type: {
    type: String,
    enum: ['entrada', 'saida', 'ajuste', 'venda', 'devolucao'],
    required: true
  },
  
  // Quantidade (positivo = entrada, negativo = saída)
  quantity: {
    type: Number,
    required: true
  },
  
  // Motivo/Descrição
  reason: {
    type: String,
    required: true
  },
  
  // Referências
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  },
  
  // Usuário responsável
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Estoque antes e depois
  previousStock: {
    type: Number,
    required: true
  },
  newStock: {
    type: Number,
    required: true
  },
  
  // Metadata
  notes: String,
  
}, { timestamps: true });

// Índices para performance
StockMovementSchema.index({ productId: 1, createdAt: -1 });
StockMovementSchema.index({ type: 1 });
StockMovementSchema.index({ userId: 1 });

module.exports = mongoose.model('StockMovement', StockMovementSchema);
