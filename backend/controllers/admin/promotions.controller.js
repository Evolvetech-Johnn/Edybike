const Product = require('../../models/Product');
const Promotion = require('../../models/Promotion');

// Listar promoções com filtros
const getPromotions = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    // Filtro por busca
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filtro por status
    const now = new Date();
    if (status === 'active') {
      query.isActive = true;
      query.startDate = { $lte: now };
      query.endDate = { $gte: now };
    } else if (status === 'inactive') {
      query.isActive = false;
    } else if (status === 'scheduled') {
      query.isActive = true;
      query.startDate = { $gt: now };
    } else if (status === 'expired') {
      query.endDate = { $lt: now };
    }

    const promotions = await Promotion.find(query)
      .populate('categories', 'name')
      .populate('products', 'name imageUrl')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    // Adicionar status computado
    const promotionsWithStatus = promotions.map(promo => {
      const promoObj = promo.toObject();
      promoObj.computedStatus = getPromotionStatus(promo);
      return promoObj;
    });

    res.json(promotionsWithStatus);
  } catch (error) {
    console.error('Erro ao buscar promoções:', error);
    res.status(500).json({ message: 'Erro ao buscar promoções' });
  }
};

// Estatísticas de promoções
const getPromotionsStats = async (req, res) => {
  try {
    const now = new Date();

    const total = await Promotion.countDocuments();
    
    const active = await Promotion.countDocuments({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    });

    const scheduled = await Promotion.countDocuments({
      isActive: true,
      startDate: { $gt: now }
    });

    const totalUsage = await Promotion.aggregate([
      { $group: { _id: null, total: { $sum: '$usageCount' } } }
    ]);

    res.json({
      total,
      active,
      scheduled,
      totalUsage: totalUsage[0]?.total || 0
    });
  } catch (error) {
    console.error('Erro ao buscar stats:', error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas' });
  }
};

// Buscar promoção por ID
const getPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id)
      .populate('categories', 'name')
      .populate('products', 'name imageUrl price')
      .populate('createdBy', 'name email');

    if (!promotion) {
      return res.status(404).json({ message: 'Promoção não encontrada' });
    }

    const promoObj = promotion.toObject();
    promoObj.computedStatus = getPromotionStatus(promotion);

    res.json(promoObj);
  } catch (error) {
    console.error('Erro ao buscar promoção:', error);
    res.status(500).json({ message: 'Erro ao buscar promoção' });
  }
};

// Criar promoção
const createPromotion = async (req, res) => {
  try {
    const {
      name,
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
      isActive,
      applyTo,
      categoryId,
      productIds,
      minPurchaseAmount,
      maxUsagesPerCustomer,
      totalUsageLimit
    } = req.body;

    // Validações
    if (!name || !discountType || !discountValue || !startDate || !endDate) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando' });
    }

    if (discountType === 'percentage' && (discountValue <= 0 || discountValue > 100)) {
      return res.status(400).json({ message: 'Percentual deve estar entre 0 e 100' });
    }

    if (discountType === 'fixed' && discountValue <= 0) {
      return res.status(400).json({ message: 'Valor fixo deve ser maior que 0' });
    }

    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({ message: 'Data final deve ser posterior à data inicial' });
    }

    // Determinar products e categories baseado em applyTo
    let products = [];
    let categories = [];

    if (applyTo === 'category' && categoryId) {
      categories = [categoryId];
    } else if (applyTo === 'products' && productIds && productIds.length > 0) {
      products = productIds;
    }

    const promotion = new Promotion({
      name,
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
      isActive: isActive !== undefined ? isActive : true,
      products,
      categories,
      conditions: {
        minPurchaseAmount: minPurchaseAmount || undefined,
        maxUsagesPerCustomer: maxUsagesPerCustomer || undefined,
        totalUsageLimit: totalUsageLimit || undefined
      },
      usageCount: 0,
      createdBy: req.user._id
    });

    await promotion.save();

    res.status(201).json({
      message: 'Promoção criada com sucesso',
      promotion
    });
  } catch (error) {
    console.error('Erro ao criar promoção:', error);
    res.status(500).json({ message: 'Erro ao criar promoção' });
  }
};


// Atualizar promoção
const updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);

    if (!promotion) {
      return res.status(404).json({ message:'Promoção não encontrada' });
    }

    const {
      name,
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
      isActive,
      applyTo,
      categoryId,
      productIds,
      minPurchaseAmount,
      maxUsagesPerCustomer,
      totalUsageLimit
    } = req.body;

    // Validações
    if (discountType && discountType === 'percentage' && (discountValue <= 0 || discountValue > 100)) {
      return res.status(400).json({ message: 'Percentual deve estar entre 0 e 100' });
    }

    if (endDate && startDate && new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({ message: 'Data final deve ser posterior à data inicial' });
    }

    // Atualizar campos
    if (name) promotion.name = name;
    if (description !== undefined) promotion.description = description;
    if (discountType) promotion.discountType = discountType;
    if (discountValue) promotion.discountValue = discountValue;
    if (startDate) promotion.startDate = startDate;
    if (endDate) promotion.endDate = endDate;
    if (isActive !== undefined) promotion.isActive = isActive;

    // Atualizar aplicação
    if (applyTo === 'category' && categoryId) {
      promotion.categories = [categoryId];
      promotion.products = [];
    } else if (applyTo === 'products' && productIds) {
      promotion.products = productIds;
      promotion.categories = [];
    } else if (applyTo === 'all') {
      promotion.products = [];
      promotion.categories = [];
    }

    // Atualizar condições
    if (minPurchaseAmount !== undefined || maxUsagesPerCustomer !== undefined || totalUsageLimit !== undefined) {
      promotion.conditions = {
        minPurchaseAmount: minPurchaseAmount || promotion.conditions?.minPurchaseAmount,
        maxUsagesPerCustomer: maxUsagesPerCustomer || promotion.conditions?.maxUsagesPerCustomer,
        totalUsageLimit: totalUsageLimit || promotion.conditions?.totalUsageLimit
      };
    }

    await promotion.save();

    res.json({
      message: 'Promoção atualizada com sucesso',
      promotion
    });
  } catch (error) {
    console.error('Erro ao atualizar promoção:', error);
    res.status(500).json({ message: 'Erro ao atualizar promoção' });
  }
};

// Toggle ativo/inativo
const toggleActive = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);

    if (!promotion) {
      return res.status(404).json({ message: 'Promoção não encontrada' });
    }

    promotion.isActive = !promotion.isActive;
    await promotion.save();

    res.json({
      message: `Promoção ${promotion.isActive ? 'ativada' : 'desativada'} com sucesso`,
      promotion
    });
  } catch (error) {
    console.error('Erro ao alternar status:', error);
    res.status(500).json({ message: 'Erro ao alternar status' });
  }
};

// Deletar promoção
const deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);

    if (!promotion) {
      return res.status(404).json({ message: 'Promoção não encontrada' });
    }

    res.json({ message: 'Promoção deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar promoção:', error);
    res.status(500).json({ message: 'Erro ao deletar promoção' });
  }
};

// Aplicar promoção em produtos
const applyPromotionToProducts = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);

    if (!promotion) {
      return res.status(404).json({ message: 'Promoção não encontrada' });
    }

    let productsToUpdate = [];

    // Buscar produtos baseado em products/categories
    if (promotion.products && promotion.products.length > 0) {
      productsToUpdate = await Product.find({ _id: { $in: promotion.products }, active: true });
    } else if (promotion.categories && promotion.categories.length > 0) {
      productsToUpdate = await Product.find({ category: { $in: promotion.categories }, active: true });
    } else {
      // Aplicar em todos os produtos
      productsToUpdate = await Product.find({ active: true });
    }

    let updatedCount = 0;

    for (const product of productsToUpdate) {
      // Calcular salePrice
      let salePrice;
      if (promotion.discountType === 'percentage') {
        salePrice = product.price * (1 - promotion.discountValue / 100);
      } else {
        salePrice = product.price - promotion.discountValue;
      }

      // Validar que salePrice < price
      if (salePrice >= product.price || salePrice <= 0) {
        continue; // Pula produtos com desconto inválido
      }

      // Atualizar produto
      product.isOnSale = true;
      product.salePrice = salePrice;
      product.saleStartDate = promotion.startDate;
      product.saleEndDate = promotion.endDate;

      await product.save();
      updatedCount++;
    }

    res.json({
      message: `Promoção aplicada a ${updatedCount} produto(s)`,
      updatedCount,
      totalProducts: productsToUpdate.length
    });
  } catch (error) {
    console.error('Erro ao aplicar promoção:', error);
    res.status(500).json({ message: 'Erro ao aplicar promoção' });
  }
};

// Helper: Calcular status da promoção
function getPromotionStatus(promotion) {
  const now = new Date();
  const start = new Date(promotion.startDate);
  const end = new Date(promotion.endDate);

  if (!promotion.isActive) {
    return { label: 'Inativa', variant: 'secondary' };
  }
  if (now < start) {
    return { label: 'Agendada', variant: 'info' };
  }
  if (now > end) {
    return { label: 'Expirada', variant: 'danger' };
  }
  return { label: 'Ativa', variant: 'success' };
}

module.exports = {
  getPromotions,
  getPromotionsStats,
  getPromotionById,
  createPromotion,
  updatePromotion,
  toggleActive,
  deletePromotion,
  applyPromotionToProducts
};
