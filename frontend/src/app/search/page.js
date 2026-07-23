'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { productService, wishlistService } from '@/services/api';
import { Search as SearchIcon, ShoppingBag, ExternalLink, Heart, Loader2 } from 'lucide-react';

export default function SearchCatalog() {
  const router = useRouter();
  const { isAuthenticated, wishlist, toggleWishlist, initializeAuth } = useAuthStore();

  const [query, setQuery] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [searched, setSearched] = useState(false);
  const [wishlistedProductsMap, setWishlistedProductsMap] = useState({});

  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    const wishMap = {};
    wishlist.forEach(item => {
      wishMap[item.product.id] = true;
    });
    setWishlistedProductsMap(wishMap);
  }, [wishlist]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const data = await productService.searchProducts(query, budget);
      setProducts(data);
    } catch (err) {
      console.error(err);
      alert('Error searching products catalog.');
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistProduct = async (productId) => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/search');
      return;
    }

    const isWishlisted = wishlistedProductsMap[productId];
    try {
      if (isWishlisted) {
        await wishlistService.removeFromWishlist(productId);
        toggleWishlist(productId, true); // remove
      } else {
        const saved = await wishlistService.addToWishlist(productId);
        useAuthStore.setState((state) => ({
          wishlist: [...state.wishlist, saved]
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const budgetOptions = [
    { value: '', label: 'All Budgets' },
    { value: 'Under ₹999', label: 'Under ₹999' },
    { value: '₹1000-₹2000', label: '₹1000 - ₹2000' },
    { value: '₹2000-₹5000', label: '₹2000 - ₹5000' },
    { value: '₹5000+', label: '₹5000+' }
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-400">
          <SearchIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Search Store Catalog</h1>
          <p className="text-sm text-slate-400">Browse clothing items matching brand, color, material, or style.</p>
        </div>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-slate-500" />
            </div>
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for? (e.g. Linen Shirt, White Sneakers, Checked Trousers)"
              className="block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-xl bg-slate-900/60 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div className="w-full md:w-48">
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="block w-full py-2.5 px-3 border border-white/10 rounded-xl bg-slate-900/60 text-slate-450 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
            >
              {budgetOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-primary hover:opacity-90 rounded-xl text-sm font-bold text-white shadow-lg cursor-pointer flex items-center justify-center space-x-1.5"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SearchIcon className="h-4 w-4" />}
            <span>Search</span>
          </button>
        </div>
      </form>

      {/* Results View */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
        </div>
      ) : searched ? (
        products.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl text-center">
            <ShoppingBag className="h-10 w-10 text-slate-650 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No products found</h3>
            <p className="text-sm text-slate-500">Try adjusting your keyword query or budget selection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in">
            {products.map((product) => {
              return (
                <div key={product.id} className="glass-card overflow-hidden rounded-2xl flex flex-col justify-between border border-white/5">
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950 flex items-center justify-center">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="h-full w-full object-cover brightness-95" 
                    />
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => handleWishlistProduct(product.id)}
                        className={`rounded-full p-2 backdrop-blur-md transition-all ${
                          wishlistedProductsMap[product.id]
                            ? 'bg-rose-500 text-white'
                            : 'bg-slate-900/80 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </button>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="inline-flex items-center rounded-md bg-indigo-500/20 px-2.5 py-0.5 text-xs font-bold text-indigo-300 backdrop-blur-md border border-indigo-500/30">
                        {product.marketplace}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div className="mb-4">
                      <span className="text-slate-500 text-xs font-semibold block">{product.brand}</span>
                      <h4 className="text-sm font-bold text-white line-clamp-1">{product.name}</h4>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Category: {product.category}</span>
                        <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded font-bold">★ {product.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                      <div>
                        <span className="text-xs text-slate-500 block">Price</span>
                        <span className="text-base font-extrabold text-white">₹{product.price}</span>
                      </div>
                      <a
                        href={product.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-350 hover:text-white rounded-lg text-xs font-bold transition-all border border-white/5"
                      >
                        <span>Buy Link</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <div className="text-center py-12 text-slate-500 text-sm">
          Type keywords in the search bar above to query items inside AJIO, Myntra, and SAVANA catalog models.
        </div>
      )}
    </div>
  );
}
