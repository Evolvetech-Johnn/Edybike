const Order = require('../../models/Order');
const Product = require('../../models/Product');

// GET /api/admin/analytics/summary
// Dashboard principal com KPIs gerais
const getSummary = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Revenue atual e anterior
    const currentRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          status: { $in: ['processing', 'shipped', 'delivered'] }
        }
      },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const lastMonthRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfLastMonth, $lt: startOfMonth },
          status: { $in: ['processing', 'shipped', 'delivered'] }
        }
      },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    // Pedidos
    const currentOrders = await Order.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    const lastMonthOrders = await Order.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lt: startOfMonth }
    });

    // Produtos ativos
    const productsCount = await Product.countDocuments({ active: true });

    // Taxa de conversão (pedidos delivered / total pedidos)
    const totalOrders = await Order.countDocuments({ createdAt: { $gte: startOfMonth } });
    const deliveredOrders = await Order.countDocuments({
      createdAt: { $gte: startOfMonth },
      status: 'delivered'
    });

    const revenueCurrent = currentRevenue[0]?.total || 0;
    const revenueLast = lastMonthRevenue[0]?.total || 0;
    const revenueChange = revenueLast > 0 ? ((revenueCurrent - revenueLast) / revenueLast) * 100 : 0;

    const ordersChange = lastMonthOrders > 0 ? ((currentOrders - lastMonthOrders) / lastMonthOrders) * 100 : 0;
    const conversionRate = totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0;

    res.json({
      revenue: {
        current: revenueCurrent,
        previous: revenueLast,
        change: revenueChange
      },
      orders: {
        current: currentOrders,
        previous: lastMonthOrders,
        change: ordersChange
      },
      products: productsCount,
      conversionRate: conversionRate
    });
  } catch (error) {
    console.error('Erro ao buscar summary:', error);
    res.status(500).json({ message: 'Erro ao buscar resumo' });
  }
};

// GET /api/admin/analytics/revenue?period=month
// Receita ao longo do tempo
const getRevenue = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let startDate = new Date();
    let groupBy = {};

    switch (period) {
      case 'day':
        startDate.setDate(startDate.getDate() - 30);
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 84); // 12 semanas
        groupBy = {
          year: { $year: '$createdAt' },
          week: { $week: '$createdAt' }
        };
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 3);
        groupBy = {
          year: { $year: '$createdAt' }
        };
        break;
      default: // month
        startDate.setMonth(startDate.getMonth() - 12);
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
    }

    const data = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: ['processing', 'shipped', 'delivered'] }
        }
      },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1, '_id.day': 1 } }
    ]);

    // Formatar labels
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const formatted = data.map(item => {
      let label = '';
      if (period === 'day') {
        label = `${item._id.day}/${item._id.month}`;
      } else if (period === 'week') {
        label = `S${item._id.week}/${item._id.year}`;
      } else if (period === 'year') {
        label = `${item._id.year}`;
      } else {
        label = `${months[item._id.month - 1]}/${item._id.year}`;
      }
      return {
        label,
        revenue: item.revenue,
        count: item.count
      };
    });

    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

    res.json({
      data: formatted,
      total: totalRevenue,
      period
    });
  } catch (error) {
    console.error('Erro ao buscar revenue:', error);
    res.status(500).json({ message: 'Erro ao buscar receita' });
  }
};

// GET /api/admin/analytics/orders-trend?period=month
// Pedidos por status ao longo do tempo
const getOrdersTrend = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let startDate = new Date();
    let groupBy = {};

    if (period === 'day') {
      startDate.setDate(startDate.getDate() - 30);
      groupBy = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' }
      };
    } else {
      startDate.setMonth(startDate.getMonth() - 12);
      groupBy = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' }
      };
    }

    const data = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { date: groupBy, status: '$status' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date.year': 1, '_id.date.month': 1, '_id.date.day': 1 } }
    ]);

    // Organizar por status
    const byStatus = {};
    const labels = new Set();

    data.forEach(item => {
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      let label = '';
      if (period === 'day') {
        label = `${item._id.date.day}/${item._id.date.month}`;
      } else {
        label = `${months[item._id.date.month - 1]}/${item._id.date.year}`;
      }
      
      labels.add(label);
      
      if (!byStatus[item._id.status]) {
        byStatus[item._id.status] = {};
      }
      byStatus[item._id.status][label] = item.count;
    });

    const labelsArray = Array.from(labels).sort();

    res.json({
      labels: labelsArray,
      data: byStatus,
      period
    });
  } catch (error) {
    console.error('Erro ao buscar orders trend:', error);
    res.status(500).json({ message: 'Erro ao buscar tendência de pedidos' });
  }
};

// GET /api/admin/analytics/top-products?limit=10&period=month
// Produtos mais vendidos
const getTopProducts = async (req, res) => {
  try {
    const { limit = 10, period = 'month' } = req.query;
    
    let startDate = new Date();
    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else {
      startDate = new Date(0); // all time
    }

    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: ['processing', 'shipped', 'delivered'] }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          quantity: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { quantity: -1 } },
      { $limit: parseInt(limit) }
    ]);

    // Popular com dados do produto
    const productIds = topProducts.map(p => p._id);
    const products = await Product.find({ _id: { $in: productIds } }).select('name imageUrl price');

    const result = topProducts.map(item => {
      const product = products.find(p => p._id.toString() === item._id.toString());
      return {
        productId: item._id,
        name: product?.name || 'Produto não encontrado',
        imageUrl: product?.imageUrl,
        quantity: item.quantity,
        revenue: item.revenue
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Erro ao buscar top products:', error);
    res.status(500).json({ message: 'Erro ao buscar produtos mais vendidos' });
  }
};

// GET /api/admin/analytics/conversion-rate
// Taxa de conversão
const getConversionRate = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);

    const totalOrders = await Order.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    const deliveredOrders = await Order.countDocuments({
      createdAt: { $gte: startOfMonth },
      status: 'delivered'
    });

    const rate = totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0;

    res.json({
      rate: parseFloat(rate.toFixed(2)),
      total: totalOrders,
      converted: deliveredOrders
    });
  } catch (error) {
    console.error('Erro ao buscar conversion rate:', error);
    res.status(500).json({ message: 'Erro ao buscar taxa de conversão' });
  }
};

// GET /api/admin/analytics/inventory-status
// Status de inventário
const getInventoryStatus = async (req, res) => {
  try {
    const products = await Product.find({ active: true }).select('stock');

    const status = {
      inStock: 0,      // > 10
      lowStock: 0,     // 1-10
      outOfStock: 0    // 0
    };

    products.forEach(product => {
      if (product.stock === 0) {
        status.outOfStock++;
      } else if (product.stock <= 10) {
        status.lowStock++;
      } else {
        status.inStock++;
      }
    });

    res.json(status);
  } catch (error) {
    console.error('Erro ao buscar inventory status:', error);
    res.status(500).json({ message: 'Erro ao buscar status de inventário' });
  }
};

module.exports = {
  getSummary,
  getRevenue,
  getOrdersTrend,
  getTopProducts,
  getConversionRate,
  getInventoryStatus
};
