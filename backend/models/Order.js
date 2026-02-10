const mongoose = require('mongoose');

/**
 * Schema de Pedido (Order)
 * Ciclo de vida: AGUARDANDO_PAGAMENTO → PAGO → ENVIADO → ENTREGUE
 */
const OrderSchema = new mongoose.Schema({
  // Dados do Cliente
  cliente: {
    nome: { type: String, required: true },
    cpf: { type: String, required: true },
    email: { type: String, required: true },
    telefone: { type: String, required: true }
  },

  // Endereço de Entrega
  endereco: {
    rua: { type: String, required: true },
    numero: { type: String, required: true },
    complemento: String,
    bairro: { type: String, required: true },
    cidade: { type: String, required: true },
    uf: { type: String, required: true, maxlength: 2 },
    cep: { type: String, required: true }
  },

  // Itens do Pedido
  itens: [{
    produtoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    nome: { type: String, required: true },
    quantidade: { type: Number, required: true, min: 1 },
    peso: { type: Number, required: true }, // kg
    altura: Number, // cm
    largura: Number, // cm
    comprimento: Number, // cm
    valorUnitario: { type: Number, required: true },
    valorTotal: { type: Number, required: true }
  }],

  // Frete Escolhido
  frete: {
    transportadora: { type: String, required: true },
    tipo: String, // PAC, SEDEX, .Package, etc
    valor: { type: Number, required: true },
    prazo: String, // "2 a 4 dias úteis"
    modalidade: Number // Código da modalidade Jadlog
  },

  // Totais do Pedido
  valores: {
    subtotal: { type: Number, required: true },
    frete: { type: Number, required: true },
    total: { type: Number, required: true }
  },

  // Pagamento
  pagamento: {
    gateway: String, // 'MERCADOPAGO', 'PAGSEGURO', etc
    metodo: String, // 'PIX', 'CARTAO', 'BOLETO'
    status: {
      type: String,
      enum: ['PENDENTE', 'APROVADO', 'RECUSADO', 'CANCELADO'],
      default: 'PENDENTE'
    },
    transactionId: String,
    aprovadoEm: Date
  },

  // Integração Jadlog (após pagamento aprovado)
  jadlog: {
    codigo: String, // Código de rastreio
    shipmentId: String, // ID do embarque
    status: String, // Status da entrega
    ultimaAtualizacao: Date,
    eventos: [{
      data: Date,
      descricao: String,
      local: String
    }]
  },

  // Status Geral do Pedido
  status: {
    type: String,
    enum: [
      'AGUARDANDO_PAGAMENTO',
      'PAGAMENTO_APROVADO',
      'SEPARACAO',
      'ENVIADO',
      'EM_TRANSITO',
      'ENTREGUE',
      'CANCELADO'
    ],
    default: 'AGUARDANDO_PAGAMENTO'
  },

  // Observações
  observacoes: String,

}, {
  timestamps: true // createdAt, updatedAt
});

// Índices para busca rápida
OrderSchema.index({ 'cliente.email': 1 });
OrderSchema.index({ 'jadlog.codigo': 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

// Virtual para número do pedido (baseado no ID)
OrderSchema.virtual('numeroPedido').get(function() {
  return `#${this._id.toString().substring(18).toUpperCase()}`;
});

// Método para calcular totais
OrderSchema.methods.calcularTotais = function() {
  this.valores.subtotal = this.itens.reduce((acc, item) => acc + item.valorTotal, 0);
  this.valores.frete = this.frete.valor;
  this.valores.total = this.valores.subtotal + this.valores.frete;
};

module.exports = mongoose.model('Order', OrderSchema);
