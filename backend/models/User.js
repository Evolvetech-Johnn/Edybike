const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false // Opcional para não quebrar users existentes
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
  
  // === NOVOS CAMPOS (Opcionais) ===
  
  // Permissões granulares (apenas para admins)
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
  
  // Metadata admin
  lastLogin: Date,
  status: {
    type: String,
    enum: ['ativo', 'bloqueado', 'pendente'],
    default: 'ativo'
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Alias para compatibilidade
userSchema.methods.comparePassword = async function(candidatePassword) {
  return this.matchPassword(candidatePassword);
};

// Verificar se é admin
userSchema.methods.isAdmin = function() {
  return ['admin', 'super_admin', 'operador', 'gestor'].includes(this.role);
};

// Verificar permissão específica
userSchema.methods.hasPermission = function(entity, action) {
  if (this.role === 'super_admin') return true;
  if (!this.permissions || !this.permissions[entity]) return false;
  return this.permissions[entity][action] === true;
};

module.exports = mongoose.model('User', userSchema);
