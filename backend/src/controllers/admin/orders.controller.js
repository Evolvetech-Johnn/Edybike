/**
 * Admin Orders Controller
 * Gerenciamento de pedidos (lista, filtros, ações administrativas)
 */

const Order = require('../../../models/Order');
const Product = require('../../../models/Product');
const StockMovement = require('../../../models/StockMovement');

/**
 * GET /api/admin/orders
 * Lista pedidos com filtros avançados
 */
exports.getAll = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      startDate,
      endDate,
      minValue,
      maxValue,
      search // busca por email ou nome do cliente
    } = req.query;
    
    const query = {};
    
    // Filtro de status
    if (status) {
      query.status = status;
    }
    
    // Filtro de data
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    // Filtro de valor
    if (minValue || maxValue) {
      query.total = {};
      if (minValue) query.total.$gte = parseFloat(minValue);
      if (maxValue) query.total.$lte = parseFloat(maxValue);
    }
    
    // Busca por cliente
    if (search) {
      query.$or = [
        { 'cliente.nome': { $regex: search, $options: 'i' } },
        { 'cliente.email': { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Order.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error('[Admin Orders] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar pedidos'
    });
  }
};

/**
 * GET /api/admin/orders/:id
 * Detalhes completos do pedido
 */
exports.getById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
    
  } catch (error) {
    console.error('[Get Order] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar pedido'
    });
  }
};

/**
 * PATCH /api/admin/orders/:id/status
 * Alterar status do pedido
 */
exports.updateStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const validStatuses = [
      'AGUARDANDO_PAGAMENTO',
      'PAGAMENTO_APROVADO',
      'SEPARACAO',
      'ENVIADO',
      'EM_TRANSITO',
      'ENTREGUE',
      'CANCELADO'
    ];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status inválido'
      });
    }
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }
    
    order.status = status;
    if (notes) {
      order.observacoes = (order.observacoes || '') + `\n[${new Date().toISOString()}] ${notes}`;
    }
    
    await order.save();
    
    res.json({
      success: true,
      message: 'Status atualizado',
      data: order
    });
    
  } catch (error) {
    console.error('[Update Status] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar status'
    });
  }
};

/**
 * POST /api/admin/orders/:id/cancel
 * Cancelar pedido (retorna estoque)
 */
exports.cancel = async (req, res) => {
  try {
    const { reason } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }
    
    if (order.status === 'CANCELADO') {
      return res.status(400).json({
        success: false,
        message: 'Pedido já está cancelado'
      });
    }
    
    if (['ENVIADO', 'EM_TRANSITO', 'ENTREGUE'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Pedido já foi enviado, não pode ser cancelado automaticamente'
      });
    }
    
    // Retornar estoque
    for (const item of order.itens) {
      const product = await Product.findById(item.produto);
      if (product) {
        const previousStock = product.stock;
        product.stock += item.quantidade;
        await product.save();
        
        // Registrar movimentação de estoque
        await StockMovement.create({
          productId: product._id,
          type: 'devolucao',
          quantity: item.quantidade,
          reason: `Cancelamento pedido #${order._id}${reason ? ' - ' + reason : ''}`,
          userId: req.user._id,
          orderId: order._id,
          previousStock,
          newStock: product.stock
        });
      }
    }
    
    order.status = 'CANCELADO';
    order.observacoes = (order.observacoes || '') + `\n[${new Date().toISOString()}] Cancelado por admin. Motivo: ${reason || 'Não informado'}`;
    
    await order.save();
    
    res.json({
      success: true,
      message: 'Pedido cancelado e estoque retornado',
      data: order
    });
    
  } catch (error) {
    console.error('[Cancel Order] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao cancelar pedido'
    });
  }
};

/**
 * GET /api/admin/orders/:id/tracking
 * Rastreamento Jadlog (proxy)
 */
exports.getTracking = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }
    
    if (!order.jadlog || !order.jadlog.codigo) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não possui código de rastreamento'
      });
    }
    
    res.json({
      success: true,
      data: {
        trackingCode: order.jadlog.codigo,
        shipmentId: order.jadlog.shipmentId,
        status: order.jadlog.status,
        lastUpdate: order.jadlog.ultimaAtualizacao,
        events: order.jadlog.eventos || []
      }
    });
    
  } catch (error) {
    console.error('[Order Tracking] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar rastreamento'
    });
  }
};

/**
 * GET /api/admin/orders/stats
 * Estatísticas gerais de pedidos
 */
exports.getStats = async (req, res) => {
  try {
    const [
      totalOrders,
      pendingPayment,
      inProgress,
      delivered,
      cancelled
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'AGUARDANDO_PAGAMENTO' }),
      Order.countDocuments({ status: { $in: ['PAGAMENTO_APROVADO', 'SEPARACAO', 'ENVIADO', 'EM_TRANSITO'] } }),
      Order.countDocuments({ status: 'ENTREGUE' }),
      Order.countDocuments({ status: 'CANCELADO' })
    ]);
    
    res.json({
      success: true,
      data: {
        total: totalOrders,
        pendingPayment,
        inProgress,
        delivered,
        cancelled
      }
    });
    
  } catch (error) {
    console.error('[Orders Stats] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas'
    });
  }
};
