import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get('http://localhost:5000/api/products'),
          axios.get('http://localhost:5000/api/categories')
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error("Failed to load home page datasets", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categoryImages = {
    "Necklaces": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=400&auto=format&fit=crop",
    "Earrings": "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=400&auto=format&fit=crop",
    "Rings": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=400&auto=format&fit=crop",
    "Bangles": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400&auto=format&fit=crop",
    "Bridal": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400&auto=format&fit=crop",
    "Gift Sets": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=400&auto=format&fit=crop"
  };

  const reviews = [
    {
      name: "Priya S.",
      text: "The quality is amazing and exactly as shown in the pictures. Loved it!",
      rating: 5,
      img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop"
    },
    {
      name: "Neha R.",
      text: "Beautiful designs and perfect for every occasion.",
      rating: 5,
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
    },
    {
      name: "Ananya K.",
      text: "Packaging was so elegant and delivery was super fast!",
      rating: 5,
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
    }
  ];

  return (
    <div class="w-full">
      {/* 1. HERO SLIDER BANNER */}
      <section class="relative w-full h-[80vh] bg-ivory flex items-center overflow-hidden">
        <div class="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=1800&auto=format&fit=crop"
            alt="Luxury Banner Model"
            class="w-full h-full object-cover object-right md:object-center brightness-[0.95]"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-ivory/80 via-ivory/40 to-transparent"></div>
        </div>

        <div class="max-w-[1400px] mx-auto w-full px-4 md:px-8 relative z-10 flex flex-col items-start gap-4">
          <motion.span 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            class="font-poppins text-accent text-xs md:text-sm font-medium tracking-[0.25em] uppercase"
          >
            Exclusive Collection
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 25 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            class="font-playfair text-4xl md:text-6xl text-[#111111] leading-tight max-w-[600px]"
          >
            Timeless Elegance,<br/>Crafted for You
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 25 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.4 }}
            class="font-poppins text-graysoft text-sm md:text-base font-light max-w-[480px] mt-2 leading-relaxed"
          >
            Discover our exclusive range of artificial jewellery for every occasion. Finished in premium gold plating.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            class="mt-6"
          >
            <button 
              onClick={() => navigate('/shop')}
              class="bg-primary text-[#FFFFFF] hover:bg-accent font-poppins text-xs font-semibold uppercase tracking-widest px-8 py-4 flex items-center gap-3 transition-colors rounded-[4px] shadow-lg"
            >
              Shop Now <ArrowRight size={14} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. CATEGORY OVERVIEW */}
      <section class="max-w-[1400px] mx-auto px-4 md:px-8 py-20">
        <h2 class="text-center font-playfair text-2xl md:text-3xl font-semibold tracking-wider text-primary mb-12 uppercase relative">
          Shop By Category
          <span class="block w-12 h-[2px] bg-accent mx-auto mt-4"></span>
        </h2>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {categories.slice(0, 6).map((cat) => (
            <div 
              key={cat._id}
              onClick={() => navigate(`/shop?category=${cat._id}`)}
              class="group flex flex-col items-center cursor-pointer"
            >
              <div class="w-full aspect-square rounded-full overflow-hidden bg-ivory border border-border shadow-sm group-hover:shadow-md transition-all duration-300">
                <img 
                  src={categoryImages[cat.name] || "https://placehold.co/300x300?text=" + cat.name} 
                  alt={cat.name} 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 class="font-poppins text-xs font-semibold uppercase tracking-wider text-primary mt-4 group-hover:text-accent transition-colors">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CURATED PIECES / NEW ARRIVALS */}
      <section class="bg-[#FFFFFF] border-t border-b border-border py-20">
        <div class="max-w-[1400px] mx-auto px-4 md:px-8">
          <div class="flex justify-between items-end mb-12">
            <div>
              <span class="text-accent text-[11px] font-semibold uppercase tracking-[0.2em] font-poppins">Lustrous selection</span>
              <h2 class="font-playfair text-2xl md:text-3xl font-semibold text-primary mt-1 uppercase">New Arrivals</h2>
            </div>
            <Link to="/shop" class="text-xs font-semibold uppercase tracking-wider text-primary hover:text-accent flex items-center gap-1.5 transition-colors">
              Explore All <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div class="flex justify-center items-center py-10">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
            </div>
          ) : (
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {products.slice(0, 4).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. PROMOTIONAL BANNER */}
      <section class="max-w-[1400px] mx-auto px-4 md:px-8 py-20">
        <div class="bg-primary text-[#FFFFFF] rounded-[16px] overflow-hidden grid grid-cols-1 md:grid-cols-2 items-center shadow-xl">
          <div class="p-10 md:p-16 flex flex-col items-start gap-4">
            <span class="text-accent text-xs font-semibold uppercase tracking-widest font-poppins">Shine on every occasion</span>
            <h2 class="font-playfair text-3xl md:text-4xl font-semibold tracking-wide">UP TO 20% OFF</h2>
            <p class="text-xs text-gray-400 font-light leading-relaxed max-w-[400px] mt-1">
              Elevate your ensemble with handcrafted gold plated necklaces and matching bridal gift sets.
            </p>
            <button 
              onClick={() => navigate('/shop')}
              class="bg-accent text-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-primary transition-colors text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded-[4px] mt-4"
            >
              Shop Collection
            </button>
          </div>
          <div class="h-64 md:h-full min-h-[300px]">
            <img 
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop" 
              alt="Luxury Jewellery Collection Showcase" 
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 5. CUSTOMER TESTIMONIALS */}
      <section class="bg-ivory py-20 border-t border-b border-border">
        <div class="max-w-[1400px] mx-auto px-4 md:px-8">
          <h2 class="text-center font-playfair text-2xl md:text-3xl font-semibold text-primary mb-12 uppercase">
            What Our Customers Say
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev, idx) => (
              <div key={idx} class="bg-[#FFFFFF] border border-border p-8 rounded-[16px] flex flex-col justify-between shadow-sm">
                <div>
                  <div class="stars text-accent mb-4">{'★'.repeat(rev.rating)}</div>
                  <p class="text-xs text-graysoft font-light leading-relaxed">"{rev.text}"</p>
                </div>
                <div class="flex items-center gap-3 mt-6">
                  <img src={rev.img} alt={rev.name} class="w-10 h-10 rounded-full object-cover" />
                  <span class="font-poppins text-xs font-semibold text-primary">{rev.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
