/**
 * Admin Inventory Controller
 * Controle de estoque e histórico de movimentações
 */

const Product = require('../../models/Product');
const StockMovement = require('../../models/StockMovement');

/**
 * GET /api/admin/inventory/current
 * Estoque atual de todos os produtos
 */
exports.getCurrentStock = async (req, res) => {
  try {
    const { 
      lowStockOnly,
      threshold = 5,
      category,
      search
    } = req.query;
    
    const query = {
      active: true,
      deletedAt: null
    };
    
    if (lowStockOnly === 'true') {
      query.stock = { $lte: parseInt(threshold), $gt: 0 };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    const products = await Product.find(query)
      .select('name stock category imageUrl sku')
      .populate('category', 'name')
      .sort({ stock: 1 })
      .lean();
    
    // Adicionar flag de alerta
    const productsWithAlert = products.map(p => ({
      ...p,
      alert: p.stock <= parseInt(threshold)
    }));
    
    res.json({
      success: true,
      data: productsWithAlert,
      total: products.length,
      lowStockCount: products.filter(p => p.stock <= parseInt(threshold)).length
    });
    
  } catch (error) {
    console.error('[Current Stock] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar estoque atual'
    });
  }
};

/**
 * GET /api/admin/inventory/movements
 * Histórico de movimentações de estoque
 */
exports.getMovements = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      productId,
      type,
      startDate,
      endDate,
      userId
    } = req.query;
    
    const query = {};
    
    if (productId) query.productId = productId;
    if (type) query.type = type;
    if (userId) query.userId = userId;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [movements, total] = await Promise.all([
      StockMovement.find(query)
        .populate('productId', 'name sku')
        .populate('userId', 'name email')
        .populate('orderId', '_id')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      StockMovement.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: movements,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error('[Stock Movements] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar movimentações'
    });
  }
};

/**
 * GET /api/admin/inventory/product/:productId/history
 * Histórico de movimentações de um produto específico
 */
exports.getProductHistory = async (req, res) => {
  try {
    const { productId } = req.params;
    const { limit = 20 } = req.query;
    
    const [product, movements] = await Promise.all([
      Product.findById(productId).select('name stock sku').lean(),
      StockMovement.find({ productId })
        .populate('userId', 'name email')
        .populate('orderId', '_id')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .lean()
    ]);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: {
        product,
        movements
      }
    });
    
  } catch (error) {
    console.error('[Product History] Error:', ERROR);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar histórico do produto'
    });
  }
};

/**
 * POST /api/admin/inventory/adjust
 * Ajustar estoque manualmente
 */
exports.adjustStock = async (req, res) => {
  try {
    const { productId, adjustment, reason } = req.body;
    
    if (!productId || !adjustment || !reason) {
      return res.status(400).json({
        success: false,
        message: 'ProductId, adjustment e reason são obrigatórios'
      });
    }
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }
    
    const previousStock = product.stock;
    const newStock = previousStock + parseInt(adjustment);
    
    if (newStock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Estoque não pode ficar negativo'
      });
    }
    
    product.stock = newStock;
    await product.save();
    
    // Registrar movimentação
    const movement = await StockMovement.create({
      productId: product._id,
      type: parseInt(adjustment) > 0 ? 'entrada' : 'ajuste',
      quantity: parseInt(adjustment),
      reason,
      userId: req.user._id,
      previousStock,
      newStock
    });
    
    res.json({
      success: true,
      message: 'Estoque ajustado com sucesso',
      data: {
        product: {
          id: product._id,
          name: product.name,
          previousStock,
          newStock
        },
        movement
      }
    });
    
  } catch (error) {
    console.error('[Adjust Stock] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao ajustar estoque'
    });
  }
};

/**
 * GET /api/admin/inventory/alerts
 * Produtos com estoque baixo (para alertas)
 */
exports.getLowStockAlerts = async (req, res) => {
  try {
    const { threshold = 5 } = req.query;
    
    const products = await Product.find({
      active: true,
      deletedAt: null,
      stock: { $lte: parseInt(threshold), $gt: 0 }
    })
    .select('name stock category sku imageUrl')
    .populate('category', 'name')
    .sort({ stock: 1 })
    .lean();
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
    
  } catch (error) {
    console.error('[Low Stock Alerts] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar alertas'
    });
  }
};

/** 
 * GET /api/admin/inventory/stats
 * Estatísticas gerais do estoque
 */
exports.getStats = async (req, res) => {
  try {
    const [
      totalProducts,
      activeProducts,
      lowStockProducts,
      outOfStockProducts,
      totalStockValue
    ] = await Promise.all([
      Product.countDocuments({ deletedAt: null }),
      Product.countDocuments({ active: true, deletedAt: null }),
      Product.countDocuments({ active: true, deletedAt: null, stock: { $lte: 5, $gt: 0 } }),
      Product.countDocuments({ active: true, deletedAt: null, stock: 0 }),
      Product.aggregate([
        { $match: { active: true, deletedAt: null } },
        { $group: { _id: null, total: { $sum: { $multiply: ['$stock', '$price'] } } } }
      ])
    ]);
    
    res.json({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        lowStockProducts,
        outOfStockProducts,
        totalStockValue: totalStockValue[0]?.total || 0
      }
    });
    
  } catch (error) {
    console.error('[Inventory Stats] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas'
    });
  }
};
