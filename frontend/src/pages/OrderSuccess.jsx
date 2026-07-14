import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Package } from 'lucide-react';

const OrderSuccess = () => {
  const navigate = useNavigate();
  return (
    <div class="min-h-[70vh] flex flex-col items-center justify-center gap-8 py-20 bg-ivory text-center px-4">
      <CheckCircle size={80} class="text-accent" />
      <div>
        <h1 class="font-playfair text-4xl text-primary mb-4">Order Confirmed!</h1>
        <p class="font-poppins text-sm text-graysoft font-light max-w-md mx-auto leading-relaxed">
          Thank you for your LUMERA order. Your exquisite piece is being carefully prepared and will be dispatched soon.
        </p>
      </div>
      <div class="flex gap-4 flex-wrap justify-center">
        <button onClick={() => navigate('/profile')} class="bg-primary text-[#FFFFFF] hover:bg-accent px-8 py-4 rounded-[4px] text-xs font-semibold uppercase tracking-widest font-poppins flex items-center gap-2 transition-colors">
          <Package size={14} /> Track My Order
        </button>
        <button onClick={() => navigate('/shop')} class="border border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-[4px] text-xs font-semibold uppercase tracking-widest font-poppins transition-colors">
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
