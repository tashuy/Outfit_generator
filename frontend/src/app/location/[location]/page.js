'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import outfitService from '../../../services/outfitService';
import {
  MapPin,
  Film,
  Image as ImageIcon,
  ShoppingBag,
  ArrowLeft,
  Loader2,
  CloudSun,
  Sparkles,
} from 'lucide-react';

export default function LocationOutfitsPage({ params }) {
  const resolvedParams = use(params);
  const locationParam = decodeURIComponent(resolvedParams.location);

  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocationOutfits();
  }, [locationParam]);

  const loadLocationOutfits = async () => {
    setLoading(true);
    try {
      const data = await outfitService.getOutfitsByLocation(locationParam);
      setOutfits(data || []);
    } catch (err) {
      console.error('Error fetching location outfits:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        <div className="space-y-4">
          <Link
            href="/videos"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Outfits
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-400" />
                  Location Specific Catalog
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-100 capitalize flex items-center gap-2">
                Outfits for {locationParam}
              </h1>
              <p className="text-sm text-slate-400">
                Curated fashion styles and recommendations matched to climate and vibe in {locationParam}
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5">
              <CloudSun className="w-6 h-6 text-amber-400" />
              <div>
                <p className="text-xs font-bold text-slate-200">Weather Matched</p>
                <p className="text-[11px] text-slate-400">Optimized for {locationParam}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="py-24 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            <p className="text-slate-400 text-sm">Loading outfits for {locationParam}...</p>
          </div>
        ) : outfits.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md mx-auto">
            <MapPin className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-slate-300 font-semibold text-base">
              No outfits found for location &quot;{locationParam}&quot;
            </p>
            <Link
              href="/videos"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition-colors"
            >
              View All Outfits
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {outfits.map((outfit) => (
              <Link
                key={outfit.id}
                href={`/videos/${outfit.id}`}
                className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-amber-500/50 hover:shadow-amber-500/10 transition-all flex flex-col"
              >
                <div className="relative aspect-[3/4] bg-slate-950 overflow-hidden">
                  {outfit.mediaUrl ? (
                    outfit.mediaType === 'VIDEO' ? (
                      <video
                        src={outfit.mediaUrl}
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <img
                        src={outfit.mediaUrl}
                        alt={outfit.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700">
                      <ImageIcon className="w-12 h-12" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full bg-slate-950/80 text-slate-200 backdrop-blur-sm border border-slate-700">
                      {outfit.category || 'CASUAL'}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white font-medium bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                      {outfit.location}
                    </span>
                    {outfit.products?.length > 0 && (
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        {outfit.products.length}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <h3 className="font-bold text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-1">
                    {outfit.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {outfit.description || 'View outfit details & shop items...'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
