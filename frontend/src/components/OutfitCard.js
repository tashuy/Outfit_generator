'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Tag, Eye, ShoppingBag, Play, ArrowRight, ExternalLink } from 'lucide-react';
import analyticsService from '@/services/analyticsService';

export default function OutfitCard({ outfit, isHorizontal = false }) {
  if (!outfit) return null;

  const getVideoUrl = (path) => {
    if (!path || typeof path !== 'string') return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:8080${path}`;
  };

  const handleProductClick = async (e, prod) => {
    e.preventDefault();
    if (!prod?.id) {
      if (prod?.productUrl) window.open(prod.productUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    try {
      const res = await analyticsService.trackProductClick(prod.id);
      window.open(res?.productUrl || prod.productUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('Click tracking error:', err);
      window.open(prod.productUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const cleanLocationName = (loc) => {
    if (!loc || typeof loc !== 'string') return '';
    return loc.replace(/^[{}\[\]"']+|[{}\[\]"']+$/g, '').trim();
  };

  const viewsCount = outfit.views || outfit.viewCount || Math.floor((outfit.id * 17) % 450 + 120);
  const mediaSrc = getVideoUrl(outfit.mediaUrl || outfit.videoUrl);
  const products = outfit.products || [];
  const locations = outfit.locations || [];
  const categories = outfit.categories || [];

  if (isHorizontal) {
    return (
      <div className="glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-amber-500/40 transition-all duration-300 group flex flex-col sm:flex-row h-full min-w-[280px] sm:min-w-[420px] max-w-[480px] flex-shrink-0">
        {/* Thumbnail Container */}
        <div className="relative sm:w-2/5 aspect-[4/5] sm:aspect-auto bg-slate-900 overflow-hidden flex-shrink-0">
          {outfit.mediaType === 'VIDEO' ? (
            <video
              src={mediaSrc}
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <img
              src={mediaSrc}
              alt={outfit.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
          
          {/* Media type overlay button */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
            </div>
          </div>

          {/* Top badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 z-10 pointer-events-none">
            {categories.slice(0, 1).map((cat, idx) => (
              <span key={idx} className="bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide">
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Content Container */}
        <div className="p-4 sm:w-3/5 flex flex-col justify-between space-y-3">
          <div>
            {/* Location & Views bar */}
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              {locations.length > 0 ? (
                <span className="flex items-center gap-1 text-rose-400 font-medium truncate max-w-[140px]">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{cleanLocationName(locations[0])}</span>
                </span>
              ) : (
                <span className="text-slate-500">Global Look</span>
              )}
              <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                <span>{viewsCount}</span>
              </span>
            </div>

            <Link href={`/videos/${outfit.id}`}>
              <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                {outfit.title}
              </h3>
            </Link>

            {outfit.description && (
              <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                {outfit.description}
              </p>
            )}
          </div>

          {/* Bottom metadata & action */}
          <div className="space-y-3 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-slate-300 text-[11px] font-medium">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                <span>{products.length} {products.length === 1 ? 'item' : 'items'}</span>
              </span>
            </div>

            <Link
              href={`/videos/${outfit.id}`}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-extrabold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10 group/btn"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Watch Outfit</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Standard Grid Card (Vertical Card Design)
  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between group h-full">
      {/* Large Media Thumbnail */}
      <div className="relative aspect-[4/5] bg-slate-900 overflow-hidden">
        {outfit.mediaType === 'VIDEO' ? (
          <video
            src={mediaSrc}
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <img
            src={mediaSrc}
            alt={outfit.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}

        {/* Hover play overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 group-hover:border-amber-400 transition-all duration-300 shadow-xl">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <div className="flex flex-wrap gap-1.5">
            {categories.slice(0, 2).map((cat, idx) => (
              <span key={idx} className="bg-slate-950/80 backdrop-blur-md border border-amber-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-amber-300 tracking-wide">
                {cat}
              </span>
            ))}
          </div>

          <span className="bg-slate-950/80 backdrop-blur-md border border-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-medium text-slate-300 flex items-center gap-1">
            <Eye className="w-3 h-3 text-indigo-400" />
            {viewsCount}
          </span>
        </div>

        {/* Bottom Location Overlay Pill */}
        {locations.length > 0 && (
          <div className="absolute bottom-3 left-3 pointer-events-none z-10">
            <span className="bg-slate-950/80 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{cleanLocationName(locations[0])}</span>
            </span>
          </div>
        )}
      </div>

      {/* Outfit Info Body */}
      <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
        <div>
          <Link href={`/videos/${outfit.id}`}>
            <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors line-clamp-1">
              {outfit.title}
            </h3>
          </Link>

          {outfit.description && (
            <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
              {outfit.description}
            </p>
          )}
        </div>

        {/* Product list preview if available */}
        {products.length > 0 && (
          <div className="border-t border-white/5 pt-3 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
              <span className="flex items-center gap-1.5 text-amber-400">
                <ShoppingBag className="w-3.5 h-3.5" />
                Shop Looks ({products.length})
              </span>
            </div>
            <div className="space-y-1 max-h-20 overflow-y-auto pr-1">
              {products.slice(0, 2).map((prod, pIdx) => (
                <a
                  key={pIdx}
                  href={prod.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleProductClick(e, prod)}
                  className="flex items-center justify-between text-xs px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-amber-500/15 border border-white/5 hover:border-amber-500/30 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <span className="truncate max-w-[170px] font-medium text-[11px]">{prod.productName}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Watch Outfit Primary CTA */}
        <Link
          href={`/videos/${outfit.id}`}
          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 border border-white/10 hover:border-amber-400 text-amber-400 text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-md mt-2"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Watch Outfit</span>
        </Link>
      </div>
    </div>
  );
}
