import { Request, Response } from 'express';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    let query: any = { active: true }; // Only show active products to public by default

    if (category) {
      query.category = category;
    }
    
    // Convertendo _id para string ou usando populate corretamente
    const products = await Product.find({ ...query, active: true }).populate('category', 'name');
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all products (Admin)
// @route   GET /api/products/admin
// @access  Private/Admin
const getAdminProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find({}).populate('category', 'name');
        res.json(products);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req: AuthRequest, res: Response) => {
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
      user: req.user?._id, // Assumindo que users podem criar produtos e queremos trackear quem criou
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
