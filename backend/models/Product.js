const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  stock: { type: Number, required: true, default: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  imageUrls: [{ type: String }],
  material: { type: String }, // e.g. Gold Plated, Silver, Brass
  color: { type: String }, // e.g. Rose Gold, Yellow Gold, Silver
  featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
