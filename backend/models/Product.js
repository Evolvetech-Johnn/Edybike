const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  imageUrl: {
    type: String,
    required: false
  },
  // Múltiplas imagens (novo sistema de upload)
  images: [{
    url: String,
    publicId: String,  // Para deletar do Cloudinary
    isMain: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  }],
  active: {
    type: Boolean,
    default: true
  },
  
  // === NOVOS CAMPOS (Opcionais - Não quebram compatibilidade) ===
  
  // Promoções
  isOnSale: {
    type: Boolean,
    default: false
  },
  salePrice: {
    type: Number,
    min: 0,
    default: null
  },
  saleStartDate: {
    type: Date,
    default: null
  },
  saleEndDate: {
    type: Date,
    default: null
  },
  
  // Destaque
  isFeatured: {
    type: Boolean,
    default: false
  },
  featuredOrder: {
    type: Number,
    default: 0
  },
  
  // Logística (Frete)
  weight: {
    type: Number, // kg
    default: 0.5
  },
  dimensions: {
    height: { type: Number, default: 10 }, // cm
    width: { type: Number, default: 15 }, // cm
    length: { type: Number, default: 20 } // cm
  },
  
  // Imagens múltiplas
  images: [{
    url: String,
    isMain: Boolean,
    order: Number
  }],
  
  // Soft Delete
  deletedAt: {
    type: Date,
    default: null
  },
  
  // Informações adicionais
  brand: String,
  model: String,
  sku: String,
  
  // Metadata para analytics
  viewCount: {
    type: Number,
    default: 0
  },
  salesCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Índices para performance
productSchema.index({ active: 1, deletedAt: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isOnSale: 1 });
productSchema.index({ category: 1 });

// Método para soft delete
productSchema.methods.softDelete = function() {
  this.deletedAt = new Date();
  this.active = false;
  return this.save();
};

// Método para calcular preço final
productSchema.methods.getFinalPrice = function() {
  if (this.isOnSale && this.salePrice && this.salePrice < this.price) {
    // Verificar se promoção está ativa
    const now = new Date();
    const isActive = (!this.saleStartDate || now >= this.saleStartDate) &&
                     (!this.saleEndDate || now <= this.saleEndDate);
    return isActive ? this.salePrice : this.price;
  }
  return this.price;
};

// Query helper: ignorar produtos deletados por padrão
productSchema.pre('find', function() {
  if (!this.getOptions().includeDeleted) {
    this.where({ deletedAt: null });
  }
});

productSchema.pre('findOne', function() {
  if (!this.getOptions().includeDeleted) {
    this.where({ deletedAt: null });
  }
});

module.exports = mongoose.model('Product', productSchema);
