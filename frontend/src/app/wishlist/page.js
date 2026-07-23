'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { wishlistService } from '@/services/api';
import { Heart, ShoppingBag, ExternalLink, Loader2, Trash2 } from 'lucide-react';

export default function Wishlist() {
  const router = useRouter();
  const { isAuthenticated, wishlist, setWishlist, token, initializeAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
    if (!token) {
      router.push('/login?redirect=/wishlist');
      return;
    }

    const fetchWishlist = async () => {
      try {
        const data = await wishlistService.getWishlist();
        setWishlist(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [token, router, setWishlist]);

  const handleRemove = async (productId) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      setWishlist(wishlist.filter(item => item.product.id !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-400">
          <Heart className="h-6 w-6 fill-current" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">My Wishlist</h1>
          <p className="text-sm text-slate-400">Products saved from generated looks and matching styles.</p>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center flex flex-col items-center justify-center">
          <ShoppingBag className="h-12 w-12 text-slate-650 mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">Your wishlist is empty</h3>
          <p className="text-sm text-slate-500 max-w-sm mb-6">
            Generate customized outfits and add products you like to your personal wishlist catalog.
          </p>
          <button 
            onClick={() => router.push('/generator')}
            className="px-5 py-2.5 rounded-xl bg-indigo-650 text-white hover:bg-indigo-700 font-bold text-sm shadow-md transition-all"
          >
            Go to Outfit Generator
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((item) => {
            const product = item.product;
            return (
              <div key={item.id} className="glass-card overflow-hidden rounded-2xl flex flex-col justify-between border border-white/5 animate-fade-in">
                <div className="relative h-48 w-full overflow-hidden bg-slate-950 flex items-center justify-center">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="h-full w-full object-cover brightness-95" 
                  />
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => handleRemove(product.id)}
                      className="rounded-full p-2 bg-slate-900/80 text-rose-400 hover:text-white hover:bg-rose-600 backdrop-blur-md transition-all"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="h-4 w-4" />
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
                    <span className="text-xs text-slate-450 mt-1 block">Category: {product.category}</span>
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
      )}
    </div>
  );
}
