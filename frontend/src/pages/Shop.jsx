import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCat, setSelectedCat] = useState(searchParams.get('category') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [material, setMaterial] = useState('');
  const [color, setColor] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    // Sync URL queries
    setSelectedCat(searchParams.get('category') || '');
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/categories');
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `http://localhost:5000/api/products?sort=${sort}`;
        if (selectedCat) url += `&category=${selectedCat}`;
        if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
        if (minPrice) url += `&minPrice=${minPrice}`;
        if (maxPrice) url += `&maxPrice=${maxPrice}`;
        if (material) url += `&material=${material}`;
        if (color) url += `&color=${color}`;

        const res = await axios.get(url);
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCat, searchQuery, minPrice, maxPrice, material, color, sort]);

  const handleCategoryClick = (catId) => {
    setSelectedCat(catId);
    setSearchParams(prev => {
      if (catId) prev.set('category', catId);
      else prev.delete('category');
      return prev;
    });
  };

  const handleResetFilters = () => {
    setSelectedCat('');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setMaterial('');
    setColor('');
    setSort('newest');
    setSearchParams({});
  };

  return (
    <div class="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
      <div class="text-center mb-12">
        <h1 class="font-playfair text-3xl md:text-4xl font-semibold text-primary uppercase">The Catalogue</h1>
        <p class="font-poppins text-xs text-graysoft tracking-widest mt-2 uppercase font-light">Explore handcrafted luxury artificial jewellery</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside class="bg-[#FFFFFF] border border-border p-6 rounded-[16px] h-fit flex flex-col gap-6 shadow-sm">
          <div>
            <h3 class="font-poppins text-xs font-semibold uppercase tracking-wider text-accent mb-3">Categories</h3>
            <ul class="flex flex-col gap-2 text-xs text-graysoft">
              <li 
                onClick={() => handleCategoryClick('')}
                class={`cursor-pointer hover:text-primary transition-colors ${!selectedCat ? 'font-semibold text-accent' : ''}`}
              >
                All Pieces
              </li>
              {categories.map(cat => (
                <li 
                  key={cat._id}
                  onClick={() => handleCategoryClick(cat._id)}
                  class={`cursor-pointer hover:text-primary transition-colors ${selectedCat === cat._id ? 'font-semibold text-accent' : ''}`}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 class="font-poppins text-xs font-semibold uppercase tracking-wider text-accent mb-3">Price Range (₹)</h3>
            <div class="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                class="w-full border border-border p-2 rounded-lg text-xs outline-none focus:border-accent"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                class="w-full border border-border p-2 rounded-lg text-xs outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <h3 class="font-poppins text-xs font-semibold uppercase tracking-wider text-accent mb-3">Material</h3>
            <select 
              value={material} 
              onChange={(e) => setMaterial(e.target.value)}
              class="w-full border border-border p-2 rounded-lg text-xs outline-none focus:border-accent text-graysoft"
            >
              <option value="">All Materials</option>
              <option value="Gold Plated">Gold Plated</option>
              <option value="Silver">Silver</option>
              <option value="Brass">Brass</option>
            </select>
          </div>

          <div>
            <h3 class="font-poppins text-xs font-semibold uppercase tracking-wider text-accent mb-3">Finish Color</h3>
            <select 
              value={color} 
              onChange={(e) => setColor(e.target.value)}
              class="w-full border border-border p-2 rounded-lg text-xs outline-none focus:border-accent text-graysoft"
            >
              <option value="">All Finishes</option>
              <option value="Yellow Gold">Yellow Gold</option>
              <option value="Rose Gold">Rose Gold</option>
              <option value="Silver">Silver Finish</option>
            </select>
          </div>

          <div>
            <h3 class="font-poppins text-xs font-semibold uppercase tracking-wider text-accent mb-3">Sort By</h3>
            <select 
              value={sort} 
              onChange={(e) => setSort(e.target.value)}
              class="w-full border border-border p-2 rounded-lg text-xs outline-none focus:border-accent text-graysoft"
            >
              <option value="newest">Newest Drops</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          <button 
            onClick={handleResetFilters}
            class="bg-primary text-[#FFFFFF] hover:bg-accent py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors mt-2"
          >
            Clear Filters
          </button>
        </aside>

        {/* Catalog Grid */}
        <div class="md:col-span-3">
          {loading ? (
            <div class="flex justify-center items-center py-20">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
            </div>
          ) : (
            <>
              <div class="mb-6 text-xs text-graysoft">
                {products.length} elegant items found
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map(p => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
