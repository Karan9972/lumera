const Order = require('../models/Order');
const Product = require('../models/Product');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay SDK
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

// @desc    Place a new order (handles Razorpay Order creation or COD direct)
// @route   POST /api/orders
// @access  Private
const placeOrder = async (req, res, next) => {
  const { items, shippingAddress, phone, paymentMethod } = req.body;
  try {
    let total = 0;
    const verifiedItems = [];

    // 1. Verify products, stock, and calculate prices
    for (const item of items) {
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct) return res.status(404).json({ error: `Product not found: ${item.product}` });
      if (dbProduct.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for: ${dbProduct.name}` });
      }

      // Calculate final price with discount
      const itemPrice = dbProduct.price * (1 - dbProduct.discount / 100);
      total += itemPrice * item.quantity;

      verifiedItems.push({
        product: dbProduct._id,
        quantity: item.quantity,
        price: itemPrice
      });
    }

    // 2. Process COD or generate Razorpay order
    if (paymentMethod === 'COD') {
      // Deduct stock immediately for COD
      for (const item of verifiedItems) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
      }

      const order = await Order.create({
        user: req.user._id,
        items: verifiedItems,
        shippingAddress,
        phone,
        totalAmount: total,
        paymentMethod,
        paymentStatus: 'PENDING',
        status: 'PENDING'
      });
      return res.status(201).json(order);
    } 
    
    if (paymentMethod === 'RAZORPAY') {
      if (!razorpay) {
        return res.status(500).json({ error: 'Razorpay payment gateway not configured' });
      }
      
      const options = {
        amount: Math.round(total * 100), // amount in paisa
        currency: 'INR',
        receipt: `receipt_${Date.now()}`
      };

      const razorpayOrder = await razorpay.orders.create(options);
      
      // Save order record as PENDING verification
      const order = await Order.create({
        user: req.user._id,
        items: verifiedItems,
        shippingAddress,
        phone,
        totalAmount: total,
        paymentMethod,
        paymentStatus: 'PENDING',
        razorpayOrderId: razorpayOrder.id,
        status: 'PENDING'
      });

      return res.status(201).json({
        order,
        razorpayOrderId: razorpayOrder.id,
        amount: options.amount,
        key: process.env.RAZORPAY_KEY_ID
      });
    }

    res.status(400).json({ error: 'Invalid payment method' });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/orders/verify
// @access  Private
const verifyPayment = async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  try {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (isSignatureValid) {
      const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
      if (!order) return res.status(404).json({ error: 'Order record not found' });

      order.paymentStatus = 'PAID';
      order.razorpayPaymentId = razorpay_payment_id;
      order.status = 'PENDING';
      
      // Deduct stock since payment succeeded
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
      }

      await order.save();
      res.json({ message: 'Payment verified successfully', order });
    } else {
      res.status(400).json({ error: 'Payment signature validation failed' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's order history
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res, next) => {
  try {
    const filter = req.user.role === 'ADMIN' ? {} : { user: req.user._id };
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = { placeOrder, verifyPayment, getOrders, updateOrderStatus };
