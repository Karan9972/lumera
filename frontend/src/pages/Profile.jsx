import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { User, Package, Heart, LogOut } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const Profile = () => {
  const { user, logout, fetchProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!user) return;
    const loadOrders = async () => {
      setLoadingOrders(true);
      try {
        const res = await axios.get('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrders(false);
      }
    };
    if (activeTab === 'orders') loadOrders();
  }, [user, activeTab]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const statusColor = (status) => {
    if (status === 'DELIVERED') return 'text-green-600 bg-green-50';
    if (status === 'SHIPPED') return 'text-blue-600 bg-blue-50';
    if (status === 'CANCELLED') return 'text-red-600 bg-red-50';
    return 'text-amber-600 bg-amber-50';
  };

  const tabs = [
    { id: 'orders', label: 'My Orders', icon: <Package size={16} /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart size={16} /> },
    { id: 'account', label: 'Account', icon: <User size={16} /> }
  ];

  return (
    <div class="max-w-[1200px] mx-auto px-4 md:px-8 py-12">
      <h1 class="font-playfair text-3xl md:text-4xl text-primary uppercase mb-10">My Dashboard</h1>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside class="bg-[#FFFFFF] border border-border rounded-[16px] p-6 h-fit shadow-sm">
          <div class="text-center mb-6 pb-6 border-b border-border">
            <div class="w-16 h-16 rounded-full bg-primary text-[#FFFFFF] flex items-center justify-center mx-auto text-xl font-playfair font-semibold mb-3">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h3 class="font-playfair text-lg text-primary">{user?.name}</h3>
            <p class="text-[11px] text-graysoft font-poppins font-light">{user?.email}</p>
          </div>

          <ul class="flex flex-col gap-2">
            {tabs.map(tab => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  class={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors font-poppins ${
                    activeTab === tab.id ? 'bg-primary text-[#FFFFFF]' : 'text-graysoft hover:bg-ivory hover:text-accent'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              </li>
            ))}
            <li class="mt-4 border-t border-border pt-4">
              <button onClick={handleLogout} class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider text-danger hover:bg-red-50 transition-colors font-poppins">
                <LogOut size={16} /> Logout
              </button>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <div class="lg:col-span-3">
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div class="flex flex-col gap-4">
              <h2 class="font-playfair text-2xl text-primary mb-4">Order History</h2>
              {loadingOrders ? (
                <div class="flex justify-center py-10">
                  <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
                </div>
              ) : orders.length === 0 ? (
                <div class="text-center py-20 bg-ivory rounded-[16px]">
                  <Package size={48} class="text-accent mx-auto mb-4 opacity-40" />
                  <p class="font-poppins text-sm text-graysoft">No orders yet. Start shopping!</p>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order._id} class="bg-[#FFFFFF] border border-border rounded-[16px] p-5 shadow-sm">
                    <div class="flex justify-between items-start flex-wrap gap-3 border-b border-border pb-3 mb-4">
                      <div>
                        <p class="font-poppins text-xs text-graysoft font-light">Order Ref</p>
                        <p class="font-poppins text-xs font-semibold text-primary">#{order._id.slice(-8).toUpperCase()}</p>
                      </div>
                      <div>
                        <p class="font-poppins text-xs text-graysoft font-light">Date</p>
                        <p class="font-poppins text-xs font-medium">{new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                      </div>
                      <div>
                        <p class="font-poppins text-xs text-graysoft font-light">Total</p>
                        <p class="font-poppins text-xs font-semibold text-accent">₹{Math.round(order.totalAmount).toLocaleString('en-IN')}</p>
                      </div>
                      <span class={`text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full font-poppins ${statusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div class="flex flex-col gap-2">
                      {order.items.map(item => (
                        <div key={item._id} class="flex items-center gap-3 text-xs font-poppins">
                          <img 
                            src={item.product?.imageUrls?.[0] || 'https://placehold.co/40x50?text=—'} 
                            alt={item.product?.name}
                            class="w-10 h-12 object-cover rounded-lg"
                          />
                          <div class="flex-1">
                            <span class="font-medium text-primary">{item.product?.name}</span>
                            <span class="text-graysoft font-light"> × {item.quantity}</span>
                          </div>
                          <span class="font-semibold">₹{Math.round(item.price * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div>
              <h2 class="font-playfair text-2xl text-primary mb-6">Saved Pieces</h2>
              {!user?.wishlist || user.wishlist.length === 0 ? (
                <div class="text-center py-20 bg-ivory rounded-[16px]">
                  <Heart size={48} class="text-accent mx-auto mb-4 opacity-40" />
                  <p class="font-poppins text-sm text-graysoft">No wishlist items yet.</p>
                </div>
              ) : (
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {user.wishlist.map(product => (
                    <ProductCard key={product._id || product} product={product} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ACCOUNT TAB */}
          {activeTab === 'account' && (
            <div class="bg-[#FFFFFF] border border-border rounded-[16px] p-6 shadow-sm">
              <h2 class="font-playfair text-2xl text-primary mb-6">Account Details</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="text-[11px] font-semibold uppercase tracking-wider text-graysoft font-poppins">Full Name</label>
                  <div class="mt-1.5 border border-border p-3 rounded-lg text-sm font-poppins bg-ivory">{user?.name}</div>
                </div>
                <div>
                  <label class="text-[11px] font-semibold uppercase tracking-wider text-graysoft font-poppins">Email Address</label>
                  <div class="mt-1.5 border border-border p-3 rounded-lg text-sm font-poppins bg-ivory">{user?.email}</div>
                </div>
                <div>
                  <label class="text-[11px] font-semibold uppercase tracking-wider text-graysoft font-poppins">Account Role</label>
                  <div class="mt-1.5 border border-border p-3 rounded-lg text-sm font-poppins bg-ivory capitalize">{user?.role?.toLowerCase()}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
