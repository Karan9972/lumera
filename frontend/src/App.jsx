import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import LoginRegister from './pages/LoginRegister';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import OrderSuccess from './pages/OrderSuccess';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div class="flex flex-col min-h-screen">
            <Navbar />
            <main class="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<LoginRegister />} />
                
                <Route path="/checkout" element={
                  <ProtectedRoute><Checkout /></ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute><Profile /></ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute><Profile /></ProtectedRoute>
                } />
                <Route path="/wishlist" element={
                  <ProtectedRoute><Profile /></ProtectedRoute>
                } />
                <Route path="/order-success" element={
                  <ProtectedRoute><OrderSuccess /></ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <AdminRoute><AdminDashboard /></AdminRoute>
                } />
                
                {/* 404 Not Found */}
                <Route path="*" element={
                  <div class="min-h-[60vh] flex flex-col items-center justify-center text-center gap-6 py-20 bg-ivory px-4">
                    <h1 class="font-playfair text-6xl text-primary">404</h1>
                    <p class="font-poppins text-sm text-graysoft">This page doesn't exist in our collection.</p>
                    <a href="/" class="bg-primary text-[#FFFFFF] hover:bg-accent px-8 py-3.5 rounded-[4px] text-xs font-semibold uppercase tracking-widest font-poppins transition-colors">
                      Return Home
                    </a>
                  </div>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
