const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zip: String
  },
  phone: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true, default: 'COD' }, // COD, RAZORPAY
  paymentStatus: { type: String, required: true, default: 'PENDING' }, // PENDING, PAID, FAILED
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  status: { type: String, required: true, default: 'PENDING' } // PENDING, SHIPPED, DELIVERED, CANCELLED
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
