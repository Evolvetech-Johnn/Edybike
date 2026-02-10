import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface de Permissões
interface IPermissions {
  products?: {
    view?: boolean;
    create?: boolean;
    edit?: boolean;
    delete?: boolean;
  };
  orders?: {
    view?: boolean;
    cancel?: boolean;
    refund?: boolean;
  };
  users?: {
    view?: boolean;
    manage?: boolean;
  };
  settings?: {
    view?: boolean;
    edit?: boolean;
  };
  analytics?: {
    view?: boolean;
  };
  [key: string]: any; // Index signature para flexibilidade
}

// Interface do Usuário
export interface IUser extends Document {
  name?: string;
  email: string;
  password?: string;
  role: 'admin' | 'customer' | 'super_admin' | 'operador' | 'gestor';
  permissions?: IPermissions;
  lastLogin?: Date;
  status: 'ativo' | 'bloqueado' | 'pendente';
  createdAt: Date;
  updatedAt: Date;
  
  // Métodos de Instância
  matchPassword(enteredPassword: string): Promise<boolean>;
  comparePassword(candidatePassword: string): Promise<boolean>; // Alias
  isAdmin(): boolean;
  hasPermission(entity: string, action: string): boolean;
}

// Interface para o Model (se tiver métodos estáticos)
interface IUserModel extends Model<IUser> {
  // métodos estáticos...
}

const userSchema = new Schema({
  name: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'customer',
    enum: ['admin', 'customer', 'super_admin', 'operador', 'gestor']
  },
  
  // Permissões
  permissions: {
    products: {
      view: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      edit: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    },
    orders: {
      view: { type: Boolean, default: false },
      cancel: { type: Boolean, default: false },
      refund: { type: Boolean, default: false }
    },
    users: {
      view: { type: Boolean, default: false },
      manage: { type: Boolean, default: false }
    },
    settings: {
      view: { type: Boolean, default: false },
      edit: { type: Boolean, default: false }
    },
    analytics: {
      view: { type: Boolean, default: false }
    }
  },
  
  lastLogin: Date,
  status: {
    type: String,
    enum: ['ativo', 'bloqueado', 'pendente'],
    default: 'ativo'
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save' as any, async function(this: IUser, next: (err?: any) => void) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(this: IUser, enteredPassword: string): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Alias para compatibilidade
userSchema.methods.comparePassword = async function(this: IUser, candidatePassword: string): Promise<boolean> {
  return this.matchPassword(candidatePassword);
};

// Verificar se é admin
userSchema.methods.isAdmin = function(this: IUser): boolean {
  return ['admin', 'super_admin', 'operador', 'gestor'].includes(this.role);
};

// Verificar permissão específica
userSchema.methods.hasPermission = function(this: IUser, entity: string, action: string): boolean {
  if (this.role === 'super_admin') return true;
  if (!this.permissions || !(this.permissions as any)[entity]) return false;
  return (this.permissions as any)[entity][action] === true;
};

export default mongoose.model<IUser, IUserModel>('User', userSchema);
