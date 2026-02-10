const mongoose = require('mongoose');

/**
 * Model para gerenciar promoções
 * Suporta descontos percentuais ou fixos com agendamento
 */
const PromotionSchema = new mongoose.Schema({
  // Identificação
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  description: {
    type: String,
    required: false
  },
  
  // Tipo de desconto
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
    default: 'percentage'
  },
  
  // Valor do desconto
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Período de validade
  startDate: {
    type: Date,
    required: true
  },
  
  endDate: {
    type: Date,
    required: true
  },
  
  // Produtos incluídos
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  
  // Categorias incluídas (aplica a todos produtos da categoria)
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Condições (opcional)
  conditions: {
    minPurchaseAmount: Number, // Valor mínimo de compra
    maxUsagesPerCustomer: Number, // Máximo de usos por cliente
    totalUsageLimit: Number // Limite total de usos
  },
  
  // Estatísticas
  usageCount: {
    type: Number,
    default: 0
  },
  
  // Criador
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
  
}, { timestamps: true });

// Índices
PromotionSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
PromotionSchema.index({ products: 1 });
PromotionSchema.index({ categories: 1 });

// Método para verificar se promoção está ativa
PromotionSchema.methods.isCurrentlyActive = function() {
  const now = new Date();
  return this.isActive && 
         now >= this.startDate && 
         now <= this.endDate &&
         (!this.conditions?.totalUsageLimit || this.usageCount < this.conditions.totalUsageLimit);
};

module.exports = mongoose.model('Promotion', PromotionSchema);
