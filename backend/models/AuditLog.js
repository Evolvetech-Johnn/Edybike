const mongoose = require('mongoose');

/**
 * Model para Audit Log
 * Registra todas as ações administrativas para auditoria
 */
const AuditLogSchema = new mongoose.Schema({
  // Usuário que executou a ação
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Ação executada
  action: {
    type: String,
    required: true,
    enum: [
      'create', 'update', 'delete', 'soft_delete',
      'login', 'logout',
      'price_change', 'stock_adjust',
      'order_cancel', 'order_refund',
      'promotion_create', 'promotion_end',
      'settings_change',
      'user_create', 'user_delete'
    ]
  },
  
  // Entidade afetada
  entity: {
    type: String,
    required: true,
    enum: ['product', 'order', 'category', 'user', 'promotion', 'settings', 'stock']
  },
  
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  
  // Mudanças (guarda valores antigos e novos)
  changes: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Informações da requisição
  ip: String,
  userAgent: String,
  
  // Descrição legível
  description: String,
  
  // Metadata adicional
  metadata: mongoose.Schema.Types.Mixed
  
}, { timestamps: true });

// Índices para busca eficiente
AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1 });
AuditLogSchema.index({ entity: 1, entityId: 1 });
AuditLogSchema.index({ createdAt: -1 });

// Método estático para criar log de forma simples
AuditLogSchema.statics.log = async function(data) {
  try {
    return await this.create(data);
  } catch (error) {
    console.error('Error creating audit log:', error);
    // Não falha se log não for criado
    return null;
  }
};

module.exports = mongoose.model('AuditLog', AuditLogSchema);
