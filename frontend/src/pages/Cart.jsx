import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { cart, removeFromCart, changeQuantity, getSubtotal } = useContext(CartContext);
  const navigate = useNavigate();
  const subtotal = getSubtotal();
  const shipping = subtotal > 999 ? 0 : 99;

  if (cart.length === 0) {
    return (
      <div class="min-h-[70vh] flex flex-col items-center justify-center gap-6 py-20 bg-ivory">
        <ShoppingBag size={60} class="text-accent opacity-40" />
        <h2 class="font-playfair text-3xl text-primary">Your Bag is Empty</h2>
        <p class="text-xs text-graysoft font-light font-poppins">Explore the catalogue and select your favourite pieces.</p>
        <button onClick={() => navigate('/shop')} class="bg-primary text-[#FFFFFF] hover:bg-accent px-8 py-4 rounded-[4px] text-xs font-semibold uppercase tracking-widest transition-colors">
          Discover Collection
        </button>
      </div>
    );
  }

  return (
    <div class="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
      <h1 class="font-playfair text-3xl md:text-4xl text-primary uppercase mb-12 text-center">Shopping Bag</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items List */}
        <div class="lg:col-span-2 flex flex-col gap-6">
          {cart.map(({ product, quantity }) => {
            const itemPrice = product.price * (1 - product.discount / 100);
            return (
              <div key={product._id} class="bg-[#FFFFFF] border border-border rounded-[16px] p-5 flex gap-5 items-center shadow-sm">
                <img
                  src={product.imageUrls?.[0] || 'https://placehold.co/100x100/F8F5F2/111111?text=—'}
                  alt={product.name}
                  class="w-24 h-28 rounded-[10px] object-cover bg-ivory flex-shrink-0"
                />
                <div class="flex-1 flex flex-col gap-2">
                  <div class="flex justify-between items-start gap-2">
                    <div>
                      <h3 class="font-playfair text-base font-medium text-primary">{product.name}</h3>
                      <span class="text-[10px] text-graysoft font-poppins">
                        {product.category?.name}
                        {product.material ? ` · ${product.material}` : ''}
                      </span>
                    </div>
                    <button onClick={() => removeFromCart(product._id)} class="text-gray-400 hover:text-danger p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div class="flex justify-between items-center mt-2">
                    <div class="flex items-center gap-3 border border-border rounded-full px-3 py-1.5">
                      <button onClick={() => changeQuantity(product._id, quantity - 1)} class="text-primary hover:text-accent transition-colors">
                        <Minus size={13} />
                      </button>
                      <span class="text-sm font-semibold font-poppins w-6 text-center">{quantity}</span>
                      <button onClick={() => changeQuantity(product._id, quantity + 1)} class="text-primary hover:text-accent transition-colors">
                        <Plus size={13} />
                      </button>
                    </div>
                    <span class="font-poppins font-semibold text-primary text-sm">
                      ₹{Math.round(itemPrice * quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Sidebar */}
        <div class="bg-[#FFFFFF] border border-border rounded-[16px] p-6 h-fit shadow-sm flex flex-col gap-5">
          <h2 class="font-playfair text-xl text-primary border-b border-border pb-4">Order Summary</h2>
          
          <div class="flex flex-col gap-3 text-xs font-poppins text-graysoft">
            <div class="flex justify-between">
              <span>Subtotal ({cart.length} items)</span>
              <span class="text-primary font-medium">₹{Math.round(subtotal).toLocaleString('en-IN')}</span>
            </div>
            <div class="flex justify-between">
              <span>Shipping</span>
              <span class={shipping === 0 ? 'text-green-600 font-medium' : 'text-primary font-medium'}>
                {shipping === 0 ? 'FREE' : `₹${shipping}`}
              </span>
            </div>
            {shipping > 0 && (
              <div class="text-[10px] text-graysoft italic bg-ivory p-2 rounded-lg">
                Add ₹{Math.round(999 - subtotal)} more for free shipping
              </div>
            )}
          </div>

          <div class="border-t border-border pt-4">
            <div class="flex justify-between font-poppins font-semibold text-primary text-sm">
              <span>Total</span>
              <span class="text-accent">₹{Math.round(subtotal + shipping).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            class="w-full bg-primary text-[#FFFFFF] hover:bg-accent py-4 rounded-[4px] text-xs font-semibold uppercase tracking-widest transition-colors mt-2"
          >
            Proceed to Checkout
          </button>

          <Link to="/shop" class="text-center text-xs text-graysoft hover:text-accent transition-colors font-poppins">
            Continue Shopping →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
