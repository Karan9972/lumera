import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Checkout = () => {
  const { cart, getSubtotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    paymentMethod: 'COD'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subtotal = getSubtotal();
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const buildOrderPayload = () => ({
    items: cart.map(({ product, quantity }) => ({
      product: product._id,
      quantity
    })),
    shippingAddress: {
      street: form.street,
      city: form.city,
      state: form.state,
      zip: form.zip
    },
    phone: form.phone,
    paymentMethod: form.paymentMethod
  });

  const handleRazorpay = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(
        'http://localhost:5000/api/orders',
        buildOrderPayload(),
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const { razorpayOrderId, amount, key } = res.data;

      const options = {
        key,
        amount,
        currency: 'INR',
        name: 'LUMERA Jewellery',
        description: 'Luxury Jewellery Order',
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            await axios.post(
              'http://localhost:5000/api/orders/verify',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              },
              { headers: { Authorization: `Bearer ${user.token}` } }
            );
            clearCart();
            navigate('/order-success');
          } catch (err) {
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: '#D4AF37' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create payment order');
    } finally {
      setLoading(false);
    }
  };

  const handleCOD = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.post(
        'http://localhost:5000/api/orders',
        buildOrderPayload(),
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      clearCart();
      navigate('/order-success');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }
    if (form.paymentMethod === 'RAZORPAY') {
      handleRazorpay();
    } else {
      handleCOD();
    }
  };

  return (
    <div class="max-w-[1200px] mx-auto px-4 md:px-8 py-12">
      <h1 class="font-playfair text-3xl md:text-4xl text-primary uppercase mb-12 text-center">Secure Checkout</h1>

      <form onSubmit={handleSubmit} class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Shipping + Payment */}
        <div class="lg:col-span-2 flex flex-col gap-8">
          {/* Contact Info */}
          <div class="bg-[#FFFFFF] border border-border rounded-[16px] p-6 flex flex-col gap-5 shadow-sm">
            <h2 class="font-playfair text-xl text-primary border-b border-border pb-3">Contact Information</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="text-[11px] font-semibold uppercase tracking-wider text-graysoft font-poppins">Full Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required
                  class="w-full mt-1.5 border border-border p-3 rounded-lg text-sm font-poppins outline-none focus:border-accent transition-colors" />
              </div>
              <div>
                <label class="text-[11px] font-semibold uppercase tracking-wider text-graysoft font-poppins">Phone Number</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} required
                  class="w-full mt-1.5 border border-border p-3 rounded-lg text-sm font-poppins outline-none focus:border-accent transition-colors" />
              </div>
              <div class="sm:col-span-2">
                <label class="text-[11px] font-semibold uppercase tracking-wider text-graysoft font-poppins">Email Address</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required
                  class="w-full mt-1.5 border border-border p-3 rounded-lg text-sm font-poppins outline-none focus:border-accent transition-colors" />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div class="bg-[#FFFFFF] border border-border rounded-[16px] p-6 flex flex-col gap-5 shadow-sm">
            <h2 class="font-playfair text-xl text-primary border-b border-border pb-3">Shipping Address</h2>
            <div class="flex flex-col gap-4">
              <div>
                <label class="text-[11px] font-semibold uppercase tracking-wider text-graysoft font-poppins">Street Address</label>
                <input type="text" name="street" value={form.street} onChange={handleChange} required placeholder="House No, Building, Street"
                  class="w-full mt-1.5 border border-border p-3 rounded-lg text-sm font-poppins outline-none focus:border-accent transition-colors" />
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="text-[11px] font-semibold uppercase tracking-wider text-graysoft font-poppins">City</label>
                  <input type="text" name="city" value={form.city} onChange={handleChange} required
                    class="w-full mt-1.5 border border-border p-3 rounded-lg text-sm font-poppins outline-none focus:border-accent transition-colors" />
                </div>
                <div>
                  <label class="text-[11px] font-semibold uppercase tracking-wider text-graysoft font-poppins">State</label>
                  <input type="text" name="state" value={form.state} onChange={handleChange} required
                    class="w-full mt-1.5 border border-border p-3 rounded-lg text-sm font-poppins outline-none focus:border-accent transition-colors" />
                </div>
                <div>
                  <label class="text-[11px] font-semibold uppercase tracking-wider text-graysoft font-poppins">PIN Code</label>
                  <input type="text" name="zip" value={form.zip} onChange={handleChange} required
                    class="w-full mt-1.5 border border-border p-3 rounded-lg text-sm font-poppins outline-none focus:border-accent transition-colors" />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div class="bg-[#FFFFFF] border border-border rounded-[16px] p-6 flex flex-col gap-5 shadow-sm">
            <h2 class="font-playfair text-xl text-primary border-b border-border pb-3">Payment Method</h2>
            <div class="flex flex-col gap-3">
              <label class={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${form.paymentMethod === 'COD' ? 'border-accent bg-amber-50' : 'border-border'}`}>
                <input type="radio" name="paymentMethod" value="COD" checked={form.paymentMethod === 'COD'} onChange={handleChange} class="accent-accent" />
                <div>
                  <div class="font-poppins text-sm font-semibold text-primary">Cash on Delivery</div>
                  <div class="font-poppins text-xs text-graysoft font-light">Pay when your order arrives.</div>
                </div>
              </label>
              <label class={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${form.paymentMethod === 'RAZORPAY' ? 'border-accent bg-amber-50' : 'border-border'}`}>
                <input type="radio" name="paymentMethod" value="RAZORPAY" checked={form.paymentMethod === 'RAZORPAY'} onChange={handleChange} class="accent-accent" />
                <div>
                  <div class="font-poppins text-sm font-semibold text-primary">Pay Online — Razorpay</div>
                  <div class="font-poppins text-xs text-graysoft font-light">UPI, Cards, Netbanking — 100% Secure.</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div class="bg-[#FFFFFF] border border-border rounded-[16px] p-6 h-fit flex flex-col gap-5 shadow-sm">
          <h2 class="font-playfair text-xl text-primary border-b border-border pb-4">Your Order</h2>
          
          <div class="flex flex-col gap-3 max-h-64 overflow-y-auto">
            {cart.map(({ product, quantity }) => {
              const itemPrice = product.price * (1 - product.discount / 100);
              return (
                <div key={product._id} class="flex gap-3 items-center">
                  <img src={product.imageUrls?.[0] || 'https://placehold.co/50x60?text=—'} alt={product.name} class="w-12 h-14 rounded-lg object-cover" />
                  <div class="flex-1 text-xs font-poppins">
                    <div class="font-medium text-primary line-clamp-1">{product.name}</div>
                    <div class="text-graysoft font-light">Qty: {quantity}</div>
                  </div>
                  <span class="text-xs font-semibold text-primary font-poppins">₹{Math.round(itemPrice * quantity).toLocaleString('en-IN')}</span>
                </div>
              );
            })}
          </div>

          <div class="border-t border-border pt-4 flex flex-col gap-2 font-poppins text-xs text-graysoft">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span class="text-primary font-medium">₹{Math.round(subtotal).toLocaleString('en-IN')}</span>
            </div>
            <div class="flex justify-between">
              <span>Shipping</span>
              <span class={shipping === 0 ? 'text-green-600 font-medium' : 'text-primary font-medium'}>
                {shipping === 0 ? 'FREE' : `₹${shipping}`}
              </span>
            </div>
          </div>

          <div class="border-t border-border pt-4 flex justify-between font-semibold text-sm font-poppins text-primary">
            <span>Grand Total</span>
            <span class="text-accent">₹{Math.round(total).toLocaleString('en-IN')}</span>
          </div>

          {error && (
            <div class="bg-red-50 border border-red-100 text-danger text-xs p-3 rounded-lg font-poppins">
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            class="w-full bg-primary text-[#FFFFFF] hover:bg-accent disabled:bg-gray-400 py-4 rounded-[4px] text-xs font-semibold uppercase tracking-widest transition-colors mt-2 font-poppins"
          >
            {loading ? 'Processing...' : `Place Order — ₹${Math.round(total).toLocaleString('en-IN')}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
