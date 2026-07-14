import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Heart, ShoppingBag } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { user, toggleWishlist } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  const hasDiscount = product.discount > 0;
  const finalPrice = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;

  const isWishlisted = user?.wishlist?.some(item => item._id === product._id || item === product._id);

  return (
    <div class="group bg-[#FFFFFF] border border-border rounded-[16px] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full relative">
      {/* Product Image Gallery Slot */}
      <div class="relative aspect-ratio-1 overflow-hidden bg-ivory aspect-square">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.imageUrls?.[0] || 'https://placehold.co/400x400/F8F5F2/111111?text=LUMERA'}
            alt={product.name}
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {product.imageUrls?.[1] && (
            <img
              src={product.imageUrls[1]}
              alt={product.name}
              class="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            />
          )}
        </Link>

        {/* Floating Badges */}
        {product.featured && (
          <span class="absolute top-4 left-4 bg-accent text-[#FFFFFF] text-[9px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-[4px] shadow-sm">
            Best Seller
          </span>
        )}

        {hasDiscount && (
          <span class="absolute top-4 left-4 bg-[#C0392B] text-[#FFFFFF] text-[9px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-[4px] shadow-sm">
            -{product.discount}%
          </span>
        )}

        {/* Floating Heart/Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product._id)}
          class={`absolute top-4 right-4 p-2.5 rounded-full shadow-md transition-transform duration-300 hover:scale-110 z-10 ${
            isWishlisted ? 'bg-accent text-[#FFFFFF]' : 'bg-white/80 backdrop-blur-sm text-primary hover:bg-white'
          }`}
        >
          <Heart size={16} class={isWishlisted ? 'fill-current' : ''} />
        </button>

        {/* Floating Cart Button */}
        <button
          onClick={() => addToCart(product)}
          class="absolute bottom-4 right-4 bg-primary text-[#FFFFFF] hover:bg-accent p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
        >
          <ShoppingBag size={16} />
        </button>
      </div>

      {/* Info Body */}
      <div class="p-5 flex flex-col flex-1 text-center">
        <span class="text-[10px] text-graysoft tracking-[0.15em] uppercase font-light mb-1">
          {product.category?.name || 'Staples'}
        </span>
        
        <Link to={`/product/${product._id}`} class="hover:text-accent transition-colors flex-1">
          <h3 class="font-playfair text-[15px] font-medium tracking-wide text-primary leading-snug line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Pricing */}
        <div class="mt-3 flex items-center justify-center gap-2 font-poppins text-sm font-medium">
          {hasDiscount ? (
            <>
              <span class="text-gray-400 line-through text-xs">₹{product.price.toLocaleString('en-IN')}</span>
              <span class="text-accent font-semibold">₹{Math.round(finalPrice).toLocaleString('en-IN')}</span>
            </>
          ) : (
            <span class="text-primary font-semibold">₹{product.price.toLocaleString('en-IN')}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
