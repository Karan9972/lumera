const Product = require('../models/Product');

// @desc    Get all products with filters, search, pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  const { category, search, minPrice, maxPrice, sort, material, color } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (material) filter.material = material;
  if (color) filter.color = color;
  
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  let sortQuery = {};
  if (sort) {
    if (sort === 'price-asc') sortQuery.price = 1;
    else if (sort === 'price-desc') sortQuery.price = -1;
    else if (sort === 'newest') sortQuery.createdAt = -1;
  } else {
    sortQuery.createdAt = -1;
  }

  try {
    const products = await Product.find(filter).populate('category').sort(sortQuery);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Get product details
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  const { name, description, price, discount, stock, category, imageUrls, material, color, featured } = req.body;
  try {
    const product = await Product.create({
      name, description, price, discount, stock, category, imageUrls, material, color, featured
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const { name, description, price, discount, stock, category, imageUrls, material, color, featured } = req.body;
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.discount = discount !== undefined ? discount : product.discount;
    product.stock = stock !== undefined ? stock : product.stock;
    product.category = category || product.category;
    product.imageUrls = imageUrls || product.imageUrls;
    product.material = material || product.material;
    product.color = color || product.color;
    product.featured = featured !== undefined ? featured : product.featured;

    await product.save();
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await product.deleteOne();
    res.status(204).json({});
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
