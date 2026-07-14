import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, ShieldCheck, HelpCircle, RefreshCw, Truck } from 'lucide-react';

const Footer = () => {
  return (
    <footer class="bg-primary text-[#FFFFFF] font-poppins text-sm">
      {/* 1. BRAND VALUE STATEMENTS */}
      <div class="border-b border-gray-800 py-10 px-4 md:px-8">
        <div class="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
          <div class="flex flex-col md:flex-row items-center gap-4">
            <Truck class="text-accent w-8 h-8" />
            <div>
              <h4 class="font-semibold text-xs tracking-wider uppercase">Free Shipping</h4>
              <p class="text-xs text-gray-400 mt-1">On orders above ₹999</p>
            </div>
          </div>
          <div class="flex flex-col md:flex-row items-center gap-4">
            <RefreshCw class="text-accent w-8 h-8" />
            <div>
              <h4 class="font-semibold text-xs tracking-wider uppercase">Easy Returns</h4>
              <p class="text-xs text-gray-400 mt-1">7 days return policy</p>
            </div>
          </div>
          <div class="flex flex-col md:flex-row items-center gap-4">
            <ShieldCheck class="text-accent w-8 h-8" />
            <div>
              <h4 class="font-semibold text-xs tracking-wider uppercase">Premium Quality</h4>
              <p class="text-xs text-gray-400 mt-1">Finest craftsmanship</p>
            </div>
          </div>
          <div class="flex flex-col md:flex-row items-center gap-4">
            <HelpCircle class="text-accent w-8 h-8" />
            <div>
              <h4 class="font-semibold text-xs tracking-wider uppercase">Secure Payments</h4>
              <p class="text-xs text-gray-400 mt-1">100% secure checkout</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FOOTER MAIN CONTENT */}
      <div class="max-w-[1400px] mx-auto px-4 md:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Meta */}
        <div class="flex flex-col gap-6">
          <div class="text-2xl font-playfair font-semibold tracking-widest flex items-center gap-1">
            LUMERA
          </div>
          <p class="text-xs text-gray-400 leading-relaxed">
            Luméra brings you exquisite artificial jewellery that defines your style and celebrates your beauty. Crafted with luxury precision.
          </p>
          <div class="flex items-center gap-4 text-gray-400">
            <a href="#" class="hover:text-accent transition-colors"><Instagram size={18} /></a>
            <a href="#" class="hover:text-accent transition-colors"><Facebook size={18} /></a>
            <a href="#" class="hover:text-accent transition-colors"><Twitter size={18} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div class="flex flex-col gap-5">
          <h4 class="font-semibold text-xs tracking-wider uppercase text-accent">Quick Links</h4>
          <ul class="flex flex-col gap-3 text-xs text-gray-400">
            <li><Link to="/" class="hover:text-[#FFFFFF] transition-colors">Home</Link></li>
            <li><Link to="/shop" class="hover:text-[#FFFFFF] transition-colors">Shop</Link></li>
            <li><Link to="/shop?category=featured" class="hover:text-[#FFFFFF] transition-colors">Collections</Link></li>
            <li><Link to="/about" class="hover:text-[#FFFFFF] transition-colors">About Us</Link></li>
            <li><Link to="/contact" class="hover:text-[#FFFFFF] transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div class="flex flex-col gap-5">
          <h4 class="font-semibold text-xs tracking-wider uppercase text-accent">Customer Service</h4>
          <ul class="flex flex-col gap-3 text-xs text-gray-400">
            <li><Link to="/orders" class="hover:text-[#FFFFFF] transition-colors">Track Order</Link></li>
            <li><Link to="/returns" class="hover:text-[#FFFFFF] transition-colors">Returns & Exchanges</Link></li>
            <li><Link to="/shipping" class="hover:text-[#FFFFFF] transition-colors">Shipping Policy</Link></li>
            <li><Link to="/faq" class="hover:text-[#FFFFFF] transition-colors">FAQs</Link></li>
            <li><Link to="/terms" class="hover:text-[#FFFFFF] transition-colors">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div class="flex flex-col gap-5">
          <h4 class="font-semibold text-xs tracking-wider uppercase text-accent">Newsletter</h4>
          <p class="text-xs text-gray-400">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
          <div class="flex border-b border-gray-700 pb-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              class="bg-transparent outline-none text-xs w-full text-white placeholder-gray-500 font-light"
            />
            <button class="text-accent hover:text-[#FFFFFF] text-xs font-semibold uppercase tracking-wider pl-2">→</button>
          </div>
        </div>
      </div>

      {/* 3. FOOTER BOTTOM */}
      <div class="border-t border-gray-800 py-6 px-4 md:px-8">
        <div class="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div>&copy; 2026 Luméra Jewellery. All Rights Reserved.</div>
          <div class="flex items-center gap-4">
            <span class="px-2 py-1 bg-gray-900 rounded font-semibold text-[10px] tracking-wide text-gray-400">VISA</span>
            <span class="px-2 py-1 bg-gray-900 rounded font-semibold text-[10px] tracking-wide text-gray-400">MC</span>
            <span class="px-2 py-1 bg-gray-900 rounded font-semibold text-[10px] tracking-wide text-gray-400">UPI</span>
            <span class="px-2 py-1 bg-gray-900 rounded font-semibold text-[10px] tracking-wide text-gray-400">PAYTM</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
