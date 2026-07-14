import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const localCart = localStorage.getItem('lumera-cart');
    if (localCart) {
      setCart(JSON.parse(localCart));
    }
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('lumera-cart', JSON.stringify(newCart));
  };

  const addToCart = (product, quantity = 1) => {
    const existing = cart.find(item => item.product._id === product._id);
    let newCart;
    if (existing) {
      newCart = cart.map(item =>
        item.product._id === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newCart = [...cart, { product, quantity }];
    }
    saveCart(newCart);
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.product._id !== productId);
    saveCart(newCart);
  };

  const changeQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const newCart = cart.map(item =>
      item.product._id === productId ? { ...item, quantity } : item
    );
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => {
      const price = item.product.price * (1 - item.product.discount / 100);
      return sum + price * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, changeQuantity, clearCart, getSubtotal }}>
      {children}
    </CartContext.Provider>
  );
};
