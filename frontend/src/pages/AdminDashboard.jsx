import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Package, Tag, Users, LayoutDashboard, Trash2, Edit, Upload, X, Plus } from 'lucide-react';

const API = 'http://localhost:5000/api';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', discount: 0, stock: '', category: '', material: '', color: '', featured: false, imageUrls: []
  });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const authHeaders = { headers: { Authorization: `Bearer ${user?.token}` } };

  useEffect(() => { loadData(); }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'products' || activeTab === 'overview') {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${API}/products`),
          axios.get(`${API}/categories`)
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      }
      if (activeTab === 'categories') {
        const catRes = await axios.get(`${API}/categories`);
        setCategories(catRes.data);
      }
      if (activeTab === 'orders') {
        const ordRes = await axios.get(`${API}/orders`, authHeaders);
        setOrders(ordRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('file', file);
    setUploading(true);
    try {
      const res = await axios.post(`${API}/upload`, data, {
        headers: { Authorization: `Bearer ${user?.token}`, 'Content-Type': 'multipart/form-data' }
      });
      setProductForm(prev => ({ ...prev, imageUrls: [...prev.imageUrls, res.data.url] }));
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploading(false);
    }
  };

  const handleProductSave = async () => {
    try {
      if (editingProduct) {
        await axios.put(`${API}/products/${editingProduct._id}`, productForm, authHeaders);
      } else {
        await axios.post(`${API}/products`, productForm, authHeaders);
      }
      setShowProductModal(false);
      setEditingProduct(null);
      resetProductForm();
      loadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Save failed');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    await axios.delete(`${API}/products/${id}`, authHeaders);
    loadData();
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name, description: product.description || '',
      price: product.price, discount: product.discount, stock: product.stock,
      category: product.category?._id || '', material: product.material || '',
      color: product.color || '', featured: product.featured, imageUrls: product.imageUrls || []
    });
    setShowProductModal(true);
  };

  const resetProductForm = () => {
    setProductForm({ name: '', description: '', price: '', discount: 0, stock: '', category: '', material: '', color: '', featured: false, imageUrls: [] });
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await axios.delete(`${API}/categories/${id}`, authHeaders);
    loadData();
  };

  const handleAddCategory = async () => {
    const name = prompt('Category name:');
    if (!name) return;
    await axios.post(`${API}/categories`, { name }, authHeaders);
    loadData();
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    await axios.put(`${API}/orders/${orderId}`, { status }, authHeaders);
    loadData();
  };

  const tabs = [
    { id: 'products', label: 'Products', icon: <Tag size={16} /> },
    { id: 'categories', label: 'Categories', icon: <LayoutDashboard size={16} /> },
    { id: 'orders', label: 'Orders', icon: <Package size={16} /> }
  ];

  return (
    <div class="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
      <h1 class="font-playfair text-3xl md:text-4xl text-primary uppercase mb-10">Admin Dashboard</h1>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Sidebar */}
        <aside class="bg-primary text-[#FFFFFF] rounded-[16px] p-6 h-fit flex flex-col gap-2 shadow-lg">
          <div class="font-playfair text-lg font-semibold tracking-widest mb-4 pb-4 border-b border-gray-700">LUMERA</div>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              class={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider font-poppins transition-colors ${
                activeTab === tab.id ? 'bg-accent text-[#FFFFFF]' : 'text-gray-400 hover:bg-gray-800 hover:text-[#FFFFFF]'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </aside>

        {/* Main Panel */}
        <div class="lg:col-span-4">
          {loading ? (
            <div class="flex justify-center py-20">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
            </div>
          ) : (
            <>
              {/* PRODUCTS */}
              {activeTab === 'products' && (
                <div>
                  <div class="flex justify-between items-center mb-6">
                    <h2 class="font-playfair text-2xl text-primary">Product Inventory</h2>
                    <button
                      onClick={() => { resetProductForm(); setEditingProduct(null); setShowProductModal(true); }}
                      class="bg-primary text-[#FFFFFF] hover:bg-accent px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider font-poppins flex items-center gap-2 transition-colors"
                    >
                      <Plus size={14} /> Add Piece
                    </button>
                  </div>
                  <div class="bg-[#FFFFFF] border border-border rounded-[16px] overflow-hidden shadow-sm">
                    <table class="w-full text-xs font-poppins">
                      <thead class="bg-ivory border-b border-border">
                        <tr>
                          <th class="p-4 text-left text-[10px] font-semibold uppercase tracking-wider text-graysoft">Image</th>
                          <th class="p-4 text-left text-[10px] font-semibold uppercase tracking-wider text-graysoft">Name</th>
                          <th class="p-4 text-left text-[10px] font-semibold uppercase tracking-wider text-graysoft">Price</th>
                          <th class="p-4 text-left text-[10px] font-semibold uppercase tracking-wider text-graysoft">Stock</th>
                          <th class="p-4 text-left text-[10px] font-semibold uppercase tracking-wider text-graysoft">Actions</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-border">
                        {products.map(p => (
                          <tr key={p._id} class="hover:bg-ivory transition-colors">
                            <td class="p-4">
                              <img src={p.imageUrls?.[0] || 'https://placehold.co/44x55?text=—'} alt={p.name} class="w-11 h-14 object-cover rounded-lg" />
                            </td>
                            <td class="p-4">
                              <div class="font-medium text-primary">{p.name}</div>
                              <div class="text-graysoft font-light">{p.category?.name}</div>
                            </td>
                            <td class="p-4 font-semibold text-accent">₹{p.price.toLocaleString('en-IN')}</td>
                            <td class="p-4">
                              <span class={`px-2 py-1 rounded-full text-[10px] font-semibold ${p.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-danger'}`}>
                                {p.stock} units
                              </span>
                            </td>
                            <td class="p-4">
                              <div class="flex gap-2">
                                <button onClick={() => handleEditProduct(p)} class="bg-primary text-[#FFFFFF] hover:bg-accent p-2 rounded-lg transition-colors">
                                  <Edit size={13} />
                                </button>
                                <button onClick={() => handleDeleteProduct(p._id)} class="bg-red-50 text-danger hover:bg-red-100 p-2 rounded-lg transition-colors">
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* CATEGORIES */}
              {activeTab === 'categories' && (
                <div>
                  <div class="flex justify-between items-center mb-6">
                    <h2 class="font-playfair text-2xl text-primary">Categories</h2>
                    <button onClick={handleAddCategory} class="bg-primary text-[#FFFFFF] hover:bg-accent px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider font-poppins flex items-center gap-2 transition-colors">
                      <Plus size={14} /> Add Category
                    </button>
                  </div>
                  <div class="bg-[#FFFFFF] border border-border rounded-[16px] overflow-hidden shadow-sm">
                    <table class="w-full text-xs font-poppins">
                      <thead class="bg-ivory border-b border-border">
                        <tr>
                          <th class="p-4 text-left text-[10px] font-semibold uppercase tracking-wider text-graysoft">Name</th>
                          <th class="p-4 text-left text-[10px] font-semibold uppercase tracking-wider text-graysoft">Actions</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-border">
                        {categories.map(cat => (
                          <tr key={cat._id} class="hover:bg-ivory transition-colors">
                            <td class="p-4 font-medium text-primary">{cat.name}</td>
                            <td class="p-4">
                              <button onClick={() => handleDeleteCategory(cat._id)} class="bg-red-50 text-danger hover:bg-red-100 p-2 rounded-lg transition-colors">
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ORDERS */}
              {activeTab === 'orders' && (
                <div>
                  <h2 class="font-playfair text-2xl text-primary mb-6">All Orders</h2>
                  <div class="bg-[#FFFFFF] border border-border rounded-[16px] overflow-auto shadow-sm">
                    <table class="w-full text-xs font-poppins min-w-[700px]">
                      <thead class="bg-ivory border-b border-border">
                        <tr>
                          <th class="p-4 text-left text-[10px] font-semibold uppercase tracking-wider text-graysoft">Order ID</th>
                          <th class="p-4 text-left text-[10px] font-semibold uppercase tracking-wider text-graysoft">Customer</th>
                          <th class="p-4 text-left text-[10px] font-semibold uppercase tracking-wider text-graysoft">Total</th>
                          <th class="p-4 text-left text-[10px] font-semibold uppercase tracking-wider text-graysoft">Payment</th>
                          <th class="p-4 text-left text-[10px] font-semibold uppercase tracking-wider text-graysoft">Update Status</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-border">
                        {orders.map(o => (
                          <tr key={o._id} class="hover:bg-ivory transition-colors">
                            <td class="p-4 font-medium text-primary">#{o._id.slice(-6).toUpperCase()}</td>
                            <td class="p-4">
                              <div class="font-medium text-primary">{o.user?.name}</div>
                              <div class="text-graysoft font-light">{o.user?.email}</div>
                            </td>
                            <td class="p-4 font-semibold text-accent">₹{Math.round(o.totalAmount).toLocaleString('en-IN')}</td>
                            <td class="p-4">
                              <div class="font-medium text-primary">{o.paymentMethod}</div>
                              <div class="text-graysoft font-light">{o.paymentStatus}</div>
                            </td>
                            <td class="p-4">
                              <select
                                value={o.status}
                                onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                                class="border border-border rounded-lg p-2 text-xs outline-none focus:border-accent"
                              >
                                <option value="PENDING">Pending</option>
                                <option value="SHIPPED">Shipped</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="CANCELLED">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* PRODUCT MODAL */}
      {showProductModal && (
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-[#FFFFFF] rounded-[20px] w-full max-w-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
              <h2 class="font-playfair text-2xl text-primary">
                {editingProduct ? 'Edit Piece' : 'Add New Piece'}
              </h2>
              <button onClick={() => setShowProductModal(false)} class="p-2 hover:bg-ivory rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>

            <div class="flex flex-col gap-5">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-[11px] font-semibold uppercase tracking-wider text-graysoft font-poppins">Piece Name *</label>
                  <input value={productForm.name} onChange={e => setProductForm(p => ({...p, name: e.target.value}))}
                    class="w-full mt-1.5 border border-border p-3 rounded-lg text-sm font-poppins outline-none focus:border-accent" />
                </div>
                <div>
                  <label class="text-[11px] font-semibold uppercase tracking-wider text-graysoft font-poppins">Category *</label>
                  <select value={productForm.category} onChange={e => setProductForm(p => ({...p, category: e.target.value}))}
                    class="w-full mt-1.5 border border-border p-3 rounded-lg text-sm font-poppins outline-none focus:border-accent">
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label class="text-[11px] font-semibold uppercase tracking-wider text-graysoft font-poppins">Description</label>
                <textarea value={productForm.description} onChange={e => setProductForm(p => ({...p, description: e.target.value}))}
                  rows={3}
                  class="w-full mt-1.5 border border-border p-3 rounded-lg text-sm font-poppins outline-none focus:border-accent resize-none" />
              </div>

              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="text-[11px] font-semibold uppercase tracking-wider text-graysoft font-poppins">Price (₹) *</label>
                  <input type="number" value={productForm.price} onChange={e => setProductForm(p => ({...p, price: e.target.value}))}
                    class="w-full mt-1.5 border border-border p-3 rounded-lg text-sm font-poppins outline-none focus:border-accent" />
                </div>
                <div>
                  <label class="text-[11px] font-semibold uppercase tracking-wider text-graysoft font-poppins">Discount (%)</label>
                  <input type="number" value={productForm.discount} onChange={e => setProductForm(p => ({...p, discount: e.target.value}))}
                    class="w-full mt-1.5 border border-border p-3 rounded-lg text-sm font-poppins outline-none focus:border-accent" />
                </div>
                <div>
                  <label class="text-[11px] font-semibold uppercase tracking-wider text-graysoft font-poppins">Stock *</label>
                  <input type="number" value={productForm.stock} onChange={e => setProductForm(p => ({...p, stock: e.target.value}))}
                    class="w-full mt-1.5 border border-border p-3 rounded-lg text-sm font-poppins outline-none focus:border-accent" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-[11px] font-semibold uppercase tracking-wider text-graysoft font-poppins">Material</label>
                  <input value={productForm.material} onChange={e => setProductForm(p => ({...p, material: e.target.value}))} placeholder="e.g. Gold Plated"
                    class="w-full mt-1.5 border border-border p-3 rounded-lg text-sm font-poppins outline-none focus:border-accent" />
                </div>
                <div>
                  <label class="text-[11px] font-semibold uppercase tracking-wider text-graysoft font-poppins">Finish Color</label>
                  <input value={productForm.color} onChange={e => setProductForm(p => ({...p, color: e.target.value}))} placeholder="e.g. Rose Gold"
                    class="w-full mt-1.5 border border-border p-3 rounded-lg text-sm font-poppins outline-none focus:border-accent" />
                </div>
              </div>

              <div class="flex items-center gap-3">
                <input type="checkbox" id="featured" checked={productForm.featured} onChange={e => setProductForm(p => ({...p, featured: e.target.checked}))} class="accent-accent w-4 h-4" />
                <label htmlFor="featured" class="text-xs font-poppins text-primary cursor-pointer">Mark as Featured / Best Seller</label>
              </div>

              {/* Image Upload Panel */}
              <div>
                <label class="text-[11px] font-semibold uppercase tracking-wider text-graysoft font-poppins">Product Images (Cloudinary)</label>
                <div class="mt-2 flex flex-wrap gap-3">
                  {productForm.imageUrls.map((url, idx) => (
                    <div key={idx} class="relative w-20 h-24 rounded-lg overflow-hidden border border-border">
                      <img src={url} alt="Product" class="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setProductForm(p => ({...p, imageUrls: p.imageUrls.filter((_, i) => i !== idx)}))}
                        class="absolute top-1 right-1 bg-danger text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileRef.current.click()}
                    disabled={uploading}
                    class="w-20 h-24 border-2 border-dashed border-accent rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-amber-50 transition-colors"
                  >
                    {uploading ? (
                      <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-accent"></div>
                    ) : (
                      <>
                        <Upload size={16} class="text-accent" />
                        <span class="text-[10px] text-accent font-poppins">Upload</span>
                      </>
                    )}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" class="hidden" onChange={handleImageUpload} />
                </div>
              </div>

              <div class="flex gap-3 pt-4 border-t border-border">
                <button onClick={() => setShowProductModal(false)}
                  class="flex-1 border border-border py-3 rounded-lg text-xs font-semibold uppercase tracking-wider font-poppins hover:bg-ivory transition-colors">
                  Cancel
                </button>
                <button onClick={handleProductSave}
                  class="flex-1 bg-primary text-[#FFFFFF] hover:bg-accent py-3 rounded-lg text-xs font-semibold uppercase tracking-wider font-poppins transition-colors">
                  {editingProduct ? 'Save Changes' : 'Create Piece'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
