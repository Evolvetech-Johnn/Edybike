/**
 * Admin Products Controller
 * CRUD avançado e ações administrativas em produtos
 */

const Product = require('../../models/Product');
const StockMovement = require('../../models/StockMovement');

/**
 * GET /api/admin/products
 * Lista todos os produtos (incluindo inativos e deletados com flag)
 */
exports.getAll = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      status, // 'active', 'inactive', 'deleted', 'all'
      featured,
      onSale
    } = req.query;
    
    const query = {};
    
    // Filtro de status
    if (status === 'deleted') {
      query.deletedAt = { $ne: null };
    } else if (status === 'active') {
      query.active = true;
      query.deletedAt = null;
    } else if (status === 'inactive') {
      query.active = false;
      query.deletedAt = null;
    } else if (status !== 'all') {
      // Por padrão, não mostrar deletados
      query.deletedAt = null;
    }
    
    // Outros filtros
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    if (onSale === 'true') query.isOnSale = true;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [products, total] = await Promise.all([
      Product.find(query, null, { includeDeleted: true })
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Product.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error('[Admin Products] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar produtos'
    });
  }
};

/**
 * PATCH /api/admin/products/:id/toggle-active
 * Ativa/desativa produto
 */
exports.toggleActive = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado' });
    }
    
    product.active = !product.active;
    await product.save();
    
    res.json({
      success: true,
      message: `Produto ${product.active ? 'ativado' : 'desativado'}`,
      data: product
    });
    
  } catch (error) {
    console.error('[Toggle Active] Error:', error);
    res.status(500).json({ success: false, message: 'Erro ao alterar status' });
  }
};

/**
 * PATCH /api/admin/products/:id/featured
 * Marca/desmarca produto como destaque
 */
exports.toggleFeatured = async (req, res) => {
  try {
    const { featured, order = 0 } = req.body;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado' });
    }
    
    product.isFeatured = featured;
    product.featuredOrder = featured ? order : 0;
    await product.save();
    
    res.json({
      success: true,
      message: `Produto ${featured ? 'marcado' : 'removido'} como destaque`,
      data: product
    });
    
  } catch (error) {
    console.error('[Toggle Featured] Error:', error);
    res.status(500).json({ success: false, message: 'Erro ao alterar destaque' });
  }
};

/**
 * PATCH /api/admin/products/:id/sale
 * Coloca/remove produto em promoção
 */
exports.setSale = async (req, res) => {
  try {
    const { isOnSale, salePrice, startDate, endDate } = req.body;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado' });
    }
    
    if (isOnSale && (!salePrice || salePrice >= product.price)) {
      return res.status(400).json({
        success: false,
        message: 'Preço promocional deve ser menor que o preço normal'
      });
    }
    
    product.isOnSale = isOnSale;
    product.salePrice = isOnSale ? salePrice : null;
    product.saleStartDate = isOnSale && startDate ? new Date(startDate) : null;
    product.saleEndDate = isOnSale && endDate ? new Date(endDate) : null;
    
    await product.save();
    
    res.json({
      success: true,
      message: isOnSale ? 'Promoção ativada' : 'Promoção removida',
      data: product
    });
    
  } catch (error) {
    console.error('[Set Sale] Error:', error);
    res.status(500).json({ success: false, message: 'Erro ao configurar promoção' });
  }
};

/**
 * DELETE /api/admin/products/:id
 * Soft delete do produto
 */
exports.softDelete = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado' });
    }
    
    await product.softDelete();
    
    res.json({
      success: true,
      message: 'Produto removido (soft delete)',
      data: product
    });
    
  } catch (error) {
    console.error('[Soft Delete] Error:', error);
    res.status(500).json({ success: false, message: 'Erro ao remover produto' });
  }
};

/**
 * POST /api/admin/products/:id/restore
 * Restaura produto deletado
 */
exports.restore = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado' });
    }
    
    product.deletedAt = null;
    product.active = true;
    await product.save();
    
    res.json({
      success: true,
      message: 'Produto restaurado',
      data: product
    });
    
  } catch (error) {
    console.error('[Restore] Error:', error);
    res.status(500).json({ success: false, message: 'Erro ao restaurar produto' });
  }
};

/**
 * PATCH /api/admin/products/:id/stock
 * Ajusta estoque com registro de movimentação
 */
exports.adjustStock = async (req, res) => {
  try {
    const { adjustment, reason } = req.body; // adjustment pode ser positivo ou negativo
    
    if (!adjustment || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Ajuste e motivo são obrigatórios'
      });
    }
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado' });
    }
    
    const previousStock = product.stock;
    product.stock += parseInt(adjustment);
    
    if (product.stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Estoque não pode ficar negativo'
      });
    }
    
    await product.save();
    
    // Registrar movimentação
    await StockMovement.create({
      productId: product._id,
      type: adjustment > 0 ? 'entrada' : 'saida',
      quantity: parseInt(adjustment),
      reason,
      userId: req.user._id,
      previousStock,
      newStock: product.stock
    });
    
    res.json({
      success: true,
      message: 'Estoque ajustado com sucesso',
      data: {
        product,
        previousStock,
        newStock: product.stock
      }
    });
    
  } catch (error) {
    console.error('[Adjust Stock] Error:', error);
    res.status(500).json({ success: false, message: 'Erro ao ajustar estoque' });
  }
};

/**
 * PATCH /api/admin/products/bulk
 * Ações em lote
 */
exports.bulkAction = async (req, res) => {
  try {
    const { productIds, action, data } = req.body;
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'IDs de produtos inválidos'
      });
    }
    
    let updateData = {};
    let message = '';
    
    switch (action) {
      case 'activate':
        updateData = { active: true };
        message = 'Produtos ativados';
        break;
      case 'deactivate':
        updateData = { active: false };
        message = 'Produtos desativados';
        break;
      case 'delete':
        updateData = { deletedAt: new Date(), active: false };
        message = 'Produtos removidos';
        break;
      case 'change_category':
        if (!data?.categoryId) {
          return res.status(400).json({ success: false, message: 'CategoriaID obrigatório' });
        }
        updateData = { category: data.categoryId };
        message = 'Categoria alterada';
        break;
      default:
        return res.status(400).json({ success: false, message: 'Ação inválida' });
    }
    
    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: updateData }
    );
    
    res.json({
      success: true,
      message,
      modifiedCount: result.modifiedCount
    });
    
  } catch (error) {
    console.error('[Bulk Action] Error:', error);
    res.status(500).json({ success: false, message: 'Erro na ação em lote' });
  }
};
