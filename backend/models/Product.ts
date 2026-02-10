import mongoose, { Document as MongooseDocument, Schema, Model } from 'mongoose';

// Interfaces para Sub-documentos
interface IProductImage {
  url: string;
  publicId?: string;
  isMain: boolean;
  order: number;
}

interface IProductDimensions {
  height: number;
  width: number;
  length: number;
}

// Interface Principal do Produto
// Interface Principal do Produto (Sem extender Document para evitar conflitos com DOM)
export interface IProduct {
  name: string;
  description: string;
  price: number;
  category: mongoose.Types.ObjectId;
  stock: number;
  imageUrl?: string;
  images: IProductImage[];
  active: boolean;
  
  // Promoções
  isOnSale: boolean;
  salePrice?: number;
  saleStartDate?: Date;
  saleEndDate?: Date;
  
  // Destaque
  isFeatured: boolean;
  featuredOrder: number;
  
  // Logística
  weight: number;
  dimensions: IProductDimensions;
  
  // Metadata
  brand?: string;
  model?: string;
  sku?: string;
  deletedAt?: Date | null;
  viewCount: number;
  salesCount: number;
  
  // Métodos de Instância
  softDelete(): Promise<ProductDocument>;
  getFinalPrice(): number;
  
  createdAt: Date;
  updatedAt: Date;
}

export type ProductDocument = IProduct & MongooseDocument;

// Interface para o Model (se tiver métodos estáticos, adicione aqui)
interface IProductModel extends Model<ProductDocument> {
  // métodos estáticos...
}

const productSchema = new Schema({
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
    type: Schema.Types.ObjectId,
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
  images: [{
    url: String,
    publicId: String,
    isMain: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  }],
  active: {
    type: Boolean,
    default: true
  },
  
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
  
  // Logística
  weight: {
    type: Number,
    default: 0.5
  },
  dimensions: {
    height: { type: Number, default: 10 },
    width: { type: Number, default: 15 },
    length: { type: Number, default: 20 }
  },
  
  // Soft Delete
  deletedAt: {
    type: Date,
    default: null
  },
  
  // Informações adicionais
  brand: String,
  model: String,
  sku: String,
  
  // Metadata
  viewCount: {
    type: Number,
    default: 0
  },
  salesCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Índices
productSchema.index({ active: 1, deletedAt: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isOnSale: 1 });
productSchema.index({ category: 1 });

// Método para soft delete
productSchema.methods.softDelete = function(this: ProductDocument) {
  this.deletedAt = new Date();
  this.active = false;
  return this.save();
};

// Método para calcular preço final
productSchema.methods.getFinalPrice = function(this: ProductDocument) {
  if (this.isOnSale && this.salePrice && this.salePrice < this.price) {
    const now = new Date();
    const isActive = (!this.saleStartDate || now >= this.saleStartDate) &&
                     (!this.saleEndDate || now <= this.saleEndDate);
    if (isActive) return this.salePrice;
  }
  return this.price;
};

// Query middleware para ignorar deletados
productSchema.pre(/^find/, function(this: mongoose.Query<any, ProductDocument>) {
  // @ts-ignore
  if (!this.getOptions().includeDeleted) {
    this.where({ deletedAt: null });
  }
});

export default mongoose.model<ProductDocument, IProductModel>('Product', productSchema);
