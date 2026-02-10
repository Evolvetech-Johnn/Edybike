/**
 * Dashboard Controller
 * KPIs e métricas gerais para página principal do admin
 */

const Order = require('../../../models/Order');
const Product = require('../../../models/Product');
const User = require('../../../models/User');

/**
 * GET /api/admin/dashboard/kpis
 * Retorna KPIs principais do dashboard
 */
exports.getKPIs = async (req, res) => {
  try {
    const { period = 'month' } = req.query; // day, week, month, year
    
    // Calcular data de início baseado no período
    const now = new Date();
    const startDate = getStartDate(period, now);
    
    // Queries paralelas para performance
    const [
      totalOrders,
      totalRevenue,
      previousRevenue,
      avgTicket,
      lowStockProducts,
      pendingOrders
    ] = await Promise.all([
      // Total de pedidos no período
      Order.countDocuments({
        createdAt: { $gte: startDate },
        status: { $ne: 'CANCELADO' }
      }),
      
      // Receita total do período
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            'pagamento.status': 'APROVADO'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total' }
          }
        }
      ]),
      
      // Receita período anterior (para comparação)
      Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: getPreviousStartDate(period, now),
              $lt: startDate
            },
            'pagamento.status': 'APROVADO'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total' }
          }
        }
      ]),
      
      // Ticket médio
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            'pagamento.status': 'APROVADO'
          }
        },
        {
          $group: {
            _id: null,
            avg: { $avg: '$total' }
          }
        }
      ]),
      
      // Produtos com estoque baixo
      Product.countDocuments({
        active: true,
        deletedAt: null,
        stock: { $lte: 5, $gt: 0 }
      }),
      
      // Pedidos pendentes
      Order.countDocuments({
        status: { $in: ['AGUARDANDO_PAGAMENTO', 'PAGAMENTO_APROVADO'] }
      })
    ]);
    
    const revenue = totalRevenue[0]?.total || 0;
    const prevRevenue = previousRevenue[0]?.total || 0;
    const revenueGrowth = prevRevenue > 0 
      ? ((revenue - prevRevenue) / prevRevenue * 100).toFixed(1)
      : 0;
    
    res.json({
      success: true,
      data: {
        revenue: {
          value: revenue,
          growth: parseFloat(revenueGrowth),
          period
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders
        },
        avgTicket: avgTicket[0]?.avg || 0,
        alerts: {
          lowStock: lowStockProducts
        }
      }
    });
    
  } catch (error) {
    console.error('[Dashboard KPIs] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar KPIs',
      error: error.message
    });
  }
};

/**
 * GET /api/admin/dashboard/sales-chart
 * Dados para gráfico de vendas
 */
exports.getSalesChart = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const startDate = getStartDate(period);
    
    const groupBy = period === 'year' ? '$month' : '$day';
    
    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          'pagamento.status': 'APROVADO'
        }
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: '$createdAt' },
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          totalSales: { $sum: '$total' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);
    
    res.json({
      success: true,
      data: salesData.map(item => ({
        date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
        sales: item.totalSales,
        orders: item.orderCount
      }))
    });
    
  } catch (error) {
    console.error('[Dashboard Chart] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar dados do gráfico'
    });
  }
};

/**
 * GET /api/admin/dashboard/top-products
 * Top produtos mais vendidos
 */
exports.getTopProducts = async (req, res) => {
  try {
    const { limit = 5, period = 'month' } = req.query;
    const startDate = getStartDate(period);
    
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          'pagamento.status': 'APROVADO'
        }
      },
      { $unwind: '$itens' },
      {
        $group: {
          _id: '$itens.produto',
          totalQuantity: { $sum: '$itens.quantidade' },
          totalRevenue: { $sum: { $multiply: ['$itens.quantidade', '$itens.preco'] } }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } }
    ]);
    
    res.json({
      success: true,
      data: topProducts.map(item => ({
        productId: item._id,
        name: item.productInfo?.name || 'Produto não encontrado',
        quantity: item.totalQuantity,
        revenue: item.totalRevenue,
        image: item.productInfo?.imageUrl || item.productInfo?.images?.[0]?.url
      }))
    });
    
  } catch (error) {
    console.error('[Top Products] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar top produtos'
    });
  }
};

/**
 * GET /api/admin/dashboard/recent-orders
 * Últimos pedidos
 */
exports.getRecentOrders = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('_id cliente total status pagamento.status createdAt')
      .lean();
    
    res.json({
      success: true,
      data: orders
    });
    
  } catch (error) {
    console.error('[Recent Orders] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar pedidos recentes'
    });
  }
};

/**
 * GET /api/admin/dashboard/low-stock
 * Produtos com estoque baixo
 */
exports.getLowStock = async (req, res) => {
  try {
    const { threshold = 5 } = req.query;
    
    const products = await Product.find({
      active: true,
      deletedAt: null,
      stock: { $lte: parseInt(threshold), $gt: 0 }
    })
    .select('name stock imageUrl category')
    .populate('category', 'name')
    .sort({ stock: 1 })
    .lean();
    
    res.json({
      success: true,
      data: products
    });
    
  } catch (error) {
    console.error('[Low Stock] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar produtos com estoque baixo'
    });
  }
};

// ===== Helper Functions =====

function getStartDate(period, now = new Date()) {
  const start = new Date(now);
  
  switch (period) {
    case 'day':
      start.setHours(0, 0, 0, 0);
      break;
    case 'week':
      start.setDate(start.getDate() - 7);
      break;
    case 'month':
      start.setMonth(start.getMonth() - 1);
      break;
    case 'year':
      start.setFullYear(start.getFullYear() - 1);
      break;
    default:
      start.setMonth(start.getMonth() - 1);
  }
  
  return start;
}

function getPreviousStartDate(period, now = new Date()) {
  const start = new Date(now);
  
  switch (period) {
    case 'day':
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      break;
    case 'week':
      start.setDate(start.getDate() - 14);
      break;
    case 'month':
      start.setMonth(start.getMonth() - 2);
      break;
    case 'year':
      start.setFullYear(start.getFullYear() - 2);
      break;
    default:
      start.setMonth(start.getMonth() - 2);
  }
  
  return start;
}
