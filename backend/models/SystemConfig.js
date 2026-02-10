const mongoose = require('mongoose');

/**
 * Model para configurações do sistema
 * Armazena configurações globais editáveis pelo admin
 */
const SystemConfigSchema = new mongoose.Schema({
  // Chave única da configuração
  key: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Valor (suporta qualquer tipo)
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  
  // Categoria da configuração
  category: {
    type: String,
    enum: ['shipping', 'payment', 'store', 'system', 'notifications', 'analytics'],
    required: true
  },
  
  // Descrição
  description: String,
  
  // Tipo do valor (para validação no frontend)
  valueType: {
    type: String,
    enum: ['string', 'number', 'boolean', 'object', 'array'],
    required: true
  },
  
  // Se é editável pelo admin
  isEditable: {
    type: Boolean,
    default: true
  },
  
  // Última modificação
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
  
}, { timestamps: true });

// Índices
SystemConfigSchema.index({ category: 1 });

// Método estático para obter configuração
SystemConfigSchema.statics.get = async function(key, defaultValue = null) {
  const config = await this.findOne({ key });
  return config ? config.value : defaultValue;
};

// Método estático para definir configuração
SystemConfigSchema.statics.set = async function(key, value, userId, category = 'system') {
  // Inferir tipo
  let valueType = typeof value;
  if (Array.isArray(value)) valueType = 'array';
  if (valueType === 'object' && value !== null) valueType = 'object';
  
  return await this.findOneAndUpdate(
    { key },
    { 
      value, 
      category,
      valueType,
      lastModifiedBy: userId 
    },
    { upsert: true, new: true }
  );
};

// Configurações padrão
SystemConfigSchema.statics.defaults = {
  // Frete
  'shipping.origin_cep': { value: '01001000', category: 'shipping', valueType: 'string', description: 'CEP de origem para cálculo de frete' },
  'shipping.margin_percentage': { value: 0, category: 'shipping', valueType: 'number', description: 'Margem adicional sobre frete (%)' },
  
  // Loja
  'store.name': { value: 'Edy Bike', category: 'store', valueType: 'string', description: 'Nome da loja' },
  'store.cnpj': { value: '', category: 'store', valueType: 'string', description: 'CNPJ da empresa' },
  'store.email': { value: 'contato@edybike.com', category: 'store', valueType: 'string', description: 'Email de contato' },
  'store.phone': { value: '', category: 'store', valueType: 'string', description: 'Telefone' },
  
  // Sistema
  'system.upload_max_size_mb': { value: 5, category: 'system', valueType: 'number', description: 'Tamanho máximo de upload (MB)' },
  'system.low_stock_threshold': { value: 5, category: 'system', valueType: 'number', description: 'Alerta de estoque baixo (unidades)' },
  'system.items_per_page': { value: 20, category: 'system', valueType: 'number', description: 'Itens por página (admin)' },
  
  // Notificações
  'notifications.email_new_order': { value: true, category: 'notifications', valueType: 'boolean', description: 'Email em novo pedido' },
  'notifications.email_low_stock': { value: true, category: 'notifications', valueType: 'boolean', description: 'Email em estoque baixo' }
};

module.exports = mongoose.model('SystemConfig', SystemConfigSchema);
