import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Search, Heart, ShoppingBag, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = user?.wishlist?.length || 0;

  return (
    <header class="w-full bg-[#FFFFFF] border-b border-border sticky top-0 z-50">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div class="bg-[#111111] text-[#FFFFFF] text-[11px] py-2 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-1 md:gap-0 font-poppins font-light tracking-wider">
        <div class="flex items-center gap-2">
          <span>🚚 Free Shipping on Orders Above ₹999</span>
        </div>
        <div class="text-center font-normal text-accent">
          Get 10% Off on your first order | Use Code: <span class="font-semibold underline">WELCOME10</span>
        </div>
        <div class="flex items-center gap-4 text-gray-400">
          <Link to="/orders" class="hover:text-[#FFFFFF] transition-colors">Track Order</Link>
          <span>|</span>
          <Link to="/faq" class="hover:text-[#FFFFFF] transition-colors">Help</Link>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION HEADER */}
      <div class="max-w-[1400px] mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
        {/* Mobile Toggle */}
        <button class="md:hidden text-primary" onClick={() => setMobileMenuOpen(prev => !prev)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand Logo (Left/Center) */}
        <Link to="/" class="flex flex-col items-center select-none group">
          <div class="text-2xl md:text-3xl font-playfair font-semibold tracking-[0.25em] text-[#111111] flex items-center gap-[2px]">
            LUM<span>E</span><span class="text-accent text-xl relative -top-[1px]">✦</span>RA
          </div>
          <div class="text-[9px] md:text-[10px] font-poppins tracking-[0.4em] text-graysoft font-light uppercase mt-1">
            Artificial Jewellery
          </div>
        </Link>

        {/* Desktop Links */}
        <nav class="hidden md:flex items-center gap-10 font-poppins text-xs font-normal tracking-[0.15em] uppercase text-graysoft">
          <Link to="/" class="hover:text-primary transition-colors border-b-2 border-transparent hover:border-accent pb-1">Home</Link>
          <Link to="/shop" class="hover:text-primary transition-colors border-b-2 border-transparent hover:border-accent pb-1">Shop</Link>
          <Link to="/shop?category=featured" class="hover:text-primary transition-colors border-b-2 border-transparent hover:border-accent pb-1">Collections</Link>
          <Link to="/about" class="hover:text-primary transition-colors border-b-2 border-transparent hover:border-accent pb-1">About Us</Link>
          <Link to="/contact" class="hover:text-primary transition-colors border-b-2 border-transparent hover:border-accent pb-1">Contact Us</Link>
        </nav>

        {/* Action Controls */}
        <div class="flex items-center gap-5 text-[#111111]">
          {/* Search Trigger */}
          <button class="hover:text-accent transition-colors" onClick={() => setSearchOpen(prev => !prev)}>
            <Search size={21} />
          </button>
          
          {/* Wishlist Icon */}
          <Link to="/wishlist" class="relative hover:text-accent transition-colors">
            <Heart size={21} />
            {wishlistCount > 0 && (
              <span class="absolute -top-2 -right-2 bg-accent text-[#FFFFFF] text-[9px] font-semibold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" class="relative hover:text-accent transition-colors">
            <ShoppingBag size={21} />
            {cartCount > 0 && (
              <span class="absolute -top-2 -right-2 bg-accent text-[#FFFFFF] text-[9px] font-semibold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Account Profile Trigger */}
          <div class="relative group">
            <button class="hover:text-accent transition-colors flex items-center">
              <User size={21} />
            </button>
            <div class="absolute right-0 top-full mt-2 bg-[#FFFFFF] border border-border shadow-xl rounded-lg py-2 w-48 hidden group-hover:block z-50 animate-fadeIn">
              {user ? (
                <>
                  <div class="px-4 py-2 border-b border-border">
                    <p class="text-xs font-semibold text-primary truncate">{user.name}</p>
                    <p class="text-[10px] text-graysoft truncate">{user.email}</p>
                  </div>
                  {user.role === 'ADMIN' && (
                    <Link to="/admin" class="flex items-center gap-2 px-4 py-2 text-xs text-primary hover:bg-ivory hover:text-accent transition-colors">
                      <LayoutDashboard size={14} /> Admin Panel
                    </Link>
                  )}
                  <Link to="/profile" class="flex items-center gap-2 px-4 py-2 text-xs text-primary hover:bg-ivory hover:text-accent transition-colors">
                    <User size={14} /> My Profile
                  </Link>
                  <button onClick={logout} class="w-full flex items-center gap-2 px-4 py-2 text-xs text-danger hover:bg-ivory transition-colors">
                    <LogOut size={14} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" class="block px-4 py-2 text-xs text-primary hover:bg-ivory hover:text-accent transition-colors">
                    Sign In
                  </Link>
                  <Link to="/login?register=true" class="block px-4 py-2 text-xs text-primary hover:bg-ivory hover:text-accent transition-colors">
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. DROP DOWN SEARCH FIELD */}
      {searchOpen && (
        <div class="bg-ivory border-t border-border py-4 px-4 shadow-inner animate-slideDown">
          <form onSubmit={handleSearchSubmit} class="max-w-[800px] mx-auto flex items-center gap-4">
            <input
              type="text"
              placeholder="Search premium jewellery collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              class="flex-1 bg-[#FFFFFF] border border-border px-5 py-3 rounded-full text-sm outline-none focus:border-accent font-light"
            />
            <button type="submit" class="bg-primary text-[#FFFFFF] hover:bg-accent px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider">
              Search
            </button>
          </form>
        </div>
      )}

      {/* 4. MOBILE HAMBURGER MENU */}
      {mobileMenuOpen && (
        <div class="md:hidden bg-[#FFFFFF] border-t border-border py-4 px-6 flex flex-col gap-4 font-poppins text-sm uppercase tracking-wider text-graysoft">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} class="hover:text-accent">Home</Link>
          <Link to="/shop" onClick={() => setMobileMenuOpen(false)} class="hover:text-accent">Shop</Link>
          <Link to="/shop?category=featured" onClick={() => setMobileMenuOpen(false)} class="hover:text-accent">Collections</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} class="hover:text-accent">About Us</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} class="hover:text-accent">Contact Us</Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
