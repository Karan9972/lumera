import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api/auth';

  useEffect(() => {
    const localUser = localStorage.getItem('lumera-user');
    if (localUser) {
      const parsed = JSON.parse(localUser);
      setUser(parsed);
      // Fetch fresh profile to populate wishlist etc.
      fetchProfile(parsed.token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async (token) => {
    try {
      const res = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser({ ...res.data, token });
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    setUser(res.data);
    localStorage.setItem('lumera-user', JSON.stringify(res.data));
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await axios.post(`${API_URL}/register`, { name, email, password });
    setUser(res.data);
    localStorage.setItem('lumera-user', JSON.stringify(res.data));
    return res.data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lumera-user');
  };

  const toggleWishlistApi = async (productId) => {
    if (!user) return;
    try {
      const res = await axios.post(`${API_URL}/wishlist/${productId}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setUser(prev => ({ ...prev, wishlist: res.data }));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, toggleWishlist: toggleWishlistApi, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
