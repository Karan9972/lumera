import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Heart, ShoppingBag, Truck, RefreshCw, ShieldCheck } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user, toggleWishlist } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImage, setActiveImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
        setActiveImage(res.data.imageUrls?.[0] || '');

        // Fetch related products
        const relRes = await axios.get(`http://localhost:5000/api/products?category=${res.data.category?._id}`);
        setRelatedProducts(relRes.data.filter(p => p._id !== id).slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div class="min-h-[60vh] flex items-center justify-center bg-[#FAFAFA]">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div class="min-h-[60vh] flex flex-col items-center justify-center bg-[#FAFAFA] gap-4">
        <h2 class="font-playfair text-2xl">Piece Not Found</h2>
        <button onClick={() => navigate('/shop')} class="bg-primary text-[#FFFFFF] px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider">
          Return to Shop
        </button>
      </div>
    );
  }

  const hasDiscount = product.discount > 0;
  const finalPrice = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;
  const isWishlisted = user?.wishlist?.some(item => item._id === product._id || item === product._id);

  const handleBuyNow = () => {
    addToCart(product, 1);
    navigate('/cart');
  };

  return (
    <div class="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
      {/* Product Information Main Grid */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Photo Gallery Panel */}
        <div class="flex flex-col gap-4">
          <div class="w-full aspect-square bg-ivory rounded-[20px] overflow-hidden border border-border">
            <img 
              src={activeImage || 'https://placehold.co/600x600/F8F5F2/111111?text=LUMERA'} 
              alt={product.name} 
              class="w-full h-full object-cover"
            />
          </div>
          {product.imageUrls && product.imageUrls.length > 1 && (
            <div class="flex gap-4 overflow-x-auto pb-2">
              {product.imageUrls.map((url, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveImage(url)}
                  class={`w-20 h-20 bg-ivory rounded-lg overflow-hidden border flex-shrink-0 ${activeImage === url ? 'border-accent ring-2 ring-accent/20' : 'border-border'}`}
                >
                  <img src={url} alt={`Thumbnail ${index}`} class="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Text Specs Information */}
        <div class="flex flex-col gap-6">
          <div>
            <span class="text-accent text-[11px] font-semibold uppercase tracking-[0.2em] font-poppins">
              {product.category?.name || 'Staples'}
            </span>
            <h1 class="font-playfair text-3xl md:text-4xl font-medium tracking-wide text-primary leading-tight mt-1">
              {product.name}
            </h1>
          </div>

          <div class="flex items-center gap-4 border-b border-border pb-4">
            <div class="font-poppins text-xl font-medium">
              {hasDiscount ? (
                <div class="flex items-center gap-3">
                  <span class="text-accent font-semibold">₹{Math.round(finalPrice).toLocaleString('en-IN')}</span>
                  <span class="text-gray-400 line-through text-sm">₹{product.price.toLocaleString('en-IN')}</span>
                </div>
              ) : (
                <span class="text-primary font-semibold">₹{product.price.toLocaleString('en-IN')}</span>
              )}
            </div>
            {product.stock > 0 ? (
              <span class="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium">In Stock</span>
            ) : (
              <span class="text-xs text-danger bg-red-50 px-3 py-1 rounded-full font-medium">Out of Stock</span>
            )}
          </div>

          <p class="text-xs text-graysoft leading-relaxed font-light font-poppins">
            {product.description || 'Finely detailed artificial jewellery crafted to resemble high-end precious metals and fine stones. Perfect for weddings, parties, or everyday minimal elegance.'}
          </p>

          {/* Specs Details */}
          <div class="bg-ivory border border-border p-5 rounded-[16px] flex flex-col gap-3 font-poppins text-xs">
            {product.material && (
              <div class="flex justify-between">
                <span class="text-gray-500 font-light">Material:</span>
                <span class="font-medium text-primary">{product.material}</span>
              </div>
            )}
            {product.color && (
              <div class="flex justify-between">
                <span class="text-gray-500 font-light">Finish Color:</span>
                <span class="font-medium text-primary">{product.color}</span>
              </div>
            )}
            <div class="flex justify-between">
              <span class="text-gray-500 font-light">Certified Craftsmanship:</span>
              <span class="font-medium text-accent">Luméra Authentic</span>
            </div>
          </div>

          {/* Action Triggers */}
          <div class="flex flex-col sm:flex-row gap-4 mt-2">
            <button
              onClick={() => addToCart(product, 1)}
              disabled={product.stock <= 0}
              class="flex-1 bg-primary text-[#FFFFFF] hover:bg-accent disabled:bg-gray-400 font-poppins text-xs font-semibold uppercase tracking-widest py-4 px-6 flex items-center justify-center gap-3 transition-colors rounded-[4px]"
            >
              <ShoppingBag size={15} /> Add to Bag
            </button>
            
            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              class="flex-1 border border-primary text-primary hover:bg-primary hover:text-white disabled:border-gray-400 disabled:text-gray-400 font-poppins text-xs font-semibold uppercase tracking-widest py-4 px-6 flex items-center justify-center transition-all rounded-[4px]"
            >
              Buy It Now
            </button>

            <button
              onClick={() => toggleWishlist(product._id)}
              class={`p-4 rounded-[4px] border border-border flex items-center justify-center transition-colors ${isWishlisted ? 'bg-accent text-[#FFFFFF] border-accent' : 'bg-transparent text-primary hover:bg-ivory'}`}
            >
              <Heart size={16} class={isWishlisted ? 'fill-current' : ''} />
            </button>
          </div>

          {/* Guarantee Policies */}
          <div class="border-t border-border pt-6 grid grid-cols-3 gap-4 text-center font-poppins text-[10px] text-graysoft uppercase tracking-wider font-light">
            <div class="flex flex-col items-center gap-1.5">
              <Truck size={20} class="text-accent" />
              <span>Free Delivery</span>
            </div>
            <div class="flex flex-col items-center gap-1.5">
              <RefreshCw size={20} class="text-accent" />
              <span>7 Day Returns</span>
            </div>
            <div class="flex flex-col items-center gap-1.5">
              <ShieldCheck size={20} class="text-accent" />
              <span>Premium Quality</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. RELATED PRODUCTS SECTION */}
      {relatedProducts.length > 0 && (
        <section class="mt-24 border-t border-border pt-16">
          <h2 class="font-playfair text-2xl text-center text-primary uppercase mb-12">Related Pieces</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {relatedProducts.map(rel => (
              <ProductCard key={rel._id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
