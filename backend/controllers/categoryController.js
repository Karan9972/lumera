const Category = require('../models/Category');

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  const { name, imageUrl } = req.body;
  try {
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ error: 'Category name already exists' });
    }
    const category = await Category.create({ name, imageUrl });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const { name, imageUrl } = req.body;
  try {
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    category.name = name || category.name;
    category.imageUrl = imageUrl || category.imageUrl;
    
    await category.save();
    res.json(category);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    await category.deleteOne();
    res.status(204).json({});
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
