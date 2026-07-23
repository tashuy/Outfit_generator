'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { outfitService } from '@/services/outfitService';
import { 
  Video, 
  MapPin, 
  Tag, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Loader2, 
  ExternalLink 
} from 'lucide-react';

export default function Home() {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOutfits();
  }, []);

  const loadOutfits = async () => {
    setLoading(true);
    try {
      const data = await outfitService.getAllOutfits();
      setOutfits(data);
    } catch (err) {
      console.error('Failed to load outfits:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { title: 'Casual Wear', category: 'CASUAL', desc: 'Everyday comfortable outfits' },
    { title: 'Beach & Vacation', category: 'BEACH', desc: 'Breezy linen shirts & floral dresses' },
    { title: 'Party & Nightlife', category: 'PARTY', desc: 'Sleek, eye-catching evening wear' },
    { title: 'Formal & Office', category: 'FORMAL', desc: 'Sharp corporate and interview attire' },
    { title: 'College Style', category: 'COLLEGE', desc: 'Trendy streetwear & retro sneakers' },
    { title: 'Traditional & Wedding', category: 'WEDDING', desc: 'Rich ethnic wear and ceremonies' }
  ];

  const popularLocations = ['Goa', 'Mumbai', 'Delhi', 'Manali', 'Jaipur', 'Bangalore'];

  const getVideoUrl = (path) => {
    if (!path || typeof path !== 'string') return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:8080${path}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Hero Section */}
      <div className="text-center py-12 max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Creator Outfit Guides</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Discover Real Outfits & <span className="text-gradient">Shop Direct Links</span>
        </h1>
        <p className="text-slate-300 text-base sm:text-lg">
          Browse authentic style video guides, explore location-specific looks, and buy verified products from top fashion marketplaces.
        </p>
      </div>

      {/* Featured Locations Chips */}
      <div className="mb-12">
        <h2 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-rose-400" />
          <span>Popular Destination Styles</span>
        </h2>
        <div className="flex flex-wrap gap-3">
          {popularLocations.map((loc) => (
            <Link
              key={loc}
              href={`/location/${encodeURIComponent(loc)}`}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-amber-500/50 hover:bg-slate-800 transition-all text-sm font-semibold flex items-center gap-2"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{loc} Outfits</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Browse By Category Cards */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-400" />
            <span>Browse Categories</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.category}
              href={`/category/${encodeURIComponent(cat.category)}`}
              className="glass-card p-5 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="inline-flex px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold mb-3">
                  {cat.category}
                </span>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-400">{cat.desc}</p>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>View Category Outfits</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Latest Outfits Catalog Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Video className="w-6 h-6 text-amber-400" />
            <span>Latest Uploaded Outfits</span>
          </h2>
          <span className="text-xs font-semibold text-slate-400">
            {outfits.length} Published Outfits
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            <p className="text-slate-400 text-sm">Loading uploaded outfits...</p>
          </div>
        ) : outfits.length === 0 ? (
          <div className="py-16 text-center space-y-4 bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md mx-auto">
            <Video className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-slate-300 font-semibold text-base">
              No outfits uploaded yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {outfits.map((outfit) => (
              <div 
                key={outfit.id} 
                className="glass-card overflow-hidden rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all flex flex-col justify-between group"
              >
                {/* Media Preview Player */}
                <div className="relative aspect-[9/16] bg-black max-h-[380px] overflow-hidden">
                  {outfit.mediaType === 'VIDEO' ? (
                    <video
                      src={getVideoUrl(outfit.mediaUrl || outfit.videoUrl)}
                      controls
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={getVideoUrl(outfit.mediaUrl || outfit.videoUrl)}
                      alt={outfit.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}

                  {/* Badge Overlay */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
                    {(outfit.categories || []).map((cat, idx) => (
                      <span key={idx} className="bg-slate-950/80 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-md text-[10px] font-bold text-amber-300">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Info & Purchase Links */}
                <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                  <div>
                    <Link href={`/videos/${outfit.id}`}>
                      <h3 className="font-bold text-white text-base hover:text-amber-400 transition-colors line-clamp-1">
                        {outfit.title}
                      </h3>
                    </Link>
                    {outfit.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {outfit.description}
                      </p>
                    )}
                  </div>

                  {/* Locations */}
                  {(outfit.locations || []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {outfit.locations.map((loc, idx) => (
                        <span key={idx} className="text-[11px] font-semibold text-slate-300 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-rose-400" />
                          {loc}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Product Store Links */}
                  {(outfit.products || []).length > 0 && (
                    <div className="border-t border-white/5 pt-3 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3 text-amber-400" />
                        Shop Products ({outfit.products.length})
                      </span>
                      <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                        {outfit.products.map((prod, pIdx) => (
                          <a
                            key={pIdx}
                            href={prod.productUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between text-xs px-2 py-1 rounded-lg bg-slate-900 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/30 text-slate-200 hover:text-amber-300 transition-colors"
                          >
                            <span className="truncate max-w-[160px] font-medium">{prod.productName}</span>
                            <ExternalLink className="w-3 h-3 opacity-60" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* View Details Link */}
                  <Link
                    href={`/videos/${outfit.id}`}
                    className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center text-xs font-bold text-amber-400 transition-colors flex items-center justify-center gap-1 mt-2"
                  >
                    <span>View Full Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
