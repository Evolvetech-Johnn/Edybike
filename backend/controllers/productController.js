const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let query = { active: true }; // Only show active products to public by default logic, but admin might want to see all? 
    // Actually prompt says "Ativar ou desativar produtos no catálogo público". 
    // So public route should only return active products. 
    // Admin dashboard might need a separate route or a param. 
    // For MVP simplicity, let's just return all and let frontend filter if needed, OR we stick to the prompt "Catálogo de produtos é público".
    // Let's refine: Public view shows only active. Admin view shows all.
    // Ideally we split endpoints or use query param like ?isAdmin=true (secured).
    // Let's keep it simple: Public GET defaults to active only.
    
    // But wait, admin needs to see inactive ones too.
    // Let's just return all if no filter, or filter by active.
    // Prompt says: "Visualizar: Lista de produtos".
    
    if (category) {
      query.category = category;
    }
    
    // If not admin, we might want to force active=true. 
    // But since I don't want to overcomplicate the "Get" with auth just yet for public list, 
    // I will allow fetching all but maybe frontend filters inactive for public. 
    // Better: GET /api/products returns only active products by default. 
    // GET /api/products/admin returns everything (protected).
    // Or just query param ?active=false allowed only for admin.
    
    // Simplest: GET /api/products returns everything. Frontend helps. 
    // Security-wise, if "inactive" product is secret, this is bad. 
    // But for a bike shop, it's just "out of catalog".
    
    // Let's do:
    // If req.query.showAll === 'true', return all (check specific logic later or leave open for MVP).
    // Actually, let's filter active=true by default for simplicity, unless specifically requested otherwise?
    // Let's just return match on active=true.
    
    const products = await Product.find({ ...query, active: true }).populate('category', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all products (Admin)
// @route   GET /api/products/admin
// @access  Private/Admin
const getAdminProducts = async (req, res) => {
    try {
        const products = await Product.find({}).populate('category', 'name');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, imageUrl } = req.body;

    // Validação básica
    if (!name || !description || !category) {
      return res.status(400).json({ 
        message: 'Name, description and category are required' 
      });
    }

    if (price === undefined || price < 0) {
      return res.status(400).json({ 
        message: 'Price must be a non-negative number' 
      });
    }

    if (stock === undefined || stock < 0) {
      return res.status(400).json({ 
        message: 'Stock must be a non-negative number' 
      });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      imageUrl,
      user: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const { name, description, price, category, stock, imageUrl, active } = req.body;

  try {
    // Validação de valores negativos se fornecidos
    if (price !== undefined && price < 0) {
      return res.status(400).json({ 
        message: 'Price cannot be negative' 
      });
    }

    if (stock !== undefined && stock < 0) {
      return res.status(400).json({ 
        message: 'Stock cannot be negative' 
      });
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price !== undefined ? price : product.price;
      product.category = category || product.category;
      product.stock = stock !== undefined ? stock : product.stock;
      product.imageUrl = imageUrl || product.imageUrl;
      product.active = active !== undefined ? active : product.active;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
