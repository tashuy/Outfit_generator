'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import outfitService from '../../../services/outfitService';
import {
  ArrowLeft,
  MapPin,
  Tag,
  ShoppingBag,
  ExternalLink,
  Loader2,
  Calendar,
  Sparkles,
  Share2,
} from 'lucide-react';

export default function PublicOutfitDetailPage({ params }) {
  const resolvedParams = use(params);
  const outfitId = resolvedParams.id;

  const [outfit, setOutfit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadOutfit();
  }, [outfitId]);

  const loadOutfit = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await outfitService.getOutfitById(outfitId);
      setOutfit(data);
    } catch (err) {
      console.error('Error loading outfit details:', err);
      setError('Outfit not found or has been removed');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getPlatformBadgeColor = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'myntra':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      case 'ajio':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'amazon':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'zara':
        return 'bg-slate-200 text-slate-900 border-slate-300';
      case 'h&m':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-violet-500/10 text-violet-300 border-violet-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <Link
            href="/videos"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Outfits Feed
          </Link>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copied ? 'Link Copied!' : 'Share Outfit'}
          </button>
        </div>

        {loading ? (
          <div className="py-24 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            <p className="text-slate-400 text-sm">Loading outfit details...</p>
          </div>
        ) : error || !outfit ? (
          <div className="py-20 text-center space-y-4 bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md mx-auto">
            <p className="text-slate-300 font-semibold text-lg">{error || 'Outfit not found'}</p>
            <Link
              href="/videos"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition-colors"
            >
              Browse All Outfits
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Media Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl relative">
                {outfit.mediaType === 'VIDEO' ? (
                  <video
                    src={outfit.mediaUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full max-h-[600px] object-contain bg-black"
                  />
                ) : (
                  <img
                    src={outfit.mediaUrl}
                    alt={outfit.title}
                    className="w-full max-h-[600px] object-contain bg-slate-950"
                  />
                )}
              </div>
            </div>

            {/* Right Details & Product Links Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
                {/* Header Tags */}
                <div className="flex flex-wrap items-center gap-2">
                  {(outfit.categories?.length > 0 ? outfit.categories : [outfit.category]).filter(Boolean).map((cat) => (
                    <Link
                      key={cat}
                      href={`/category/${cat}`}
                      className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 hover:bg-violet-500/30 transition-colors"
                    >
                      {cat}
                    </Link>
                  ))}

                  {(outfit.locations?.length > 0 ? outfit.locations : (outfit.location ? [outfit.location] : [])).filter(Boolean).map((loc) => (
                    <Link
                      key={loc}
                      href={`/location/${loc}`}
                      className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1 hover:bg-slate-700 transition-colors"
                    >
                      <MapPin className="w-3 h-3 text-rose-400" />
                      {loc}
                    </Link>
                  ))}

                  {outfit.isLocationSpecific && (
                    <span className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Location-Specific Style
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
                    {outfit.title}
                  </h1>
                  {outfit.description && (
                    <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                      {outfit.description}
                    </p>
                  )}
                </div>

                {/* Meta details */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-4 text-xs text-slate-400">
                  {outfit.occasion && (
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-amber-400" />
                      {outfit.occasion}
                    </span>
                  )}
                  {outfit.createdAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(outfit.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Product Links Section */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-amber-400" />
                    Shop This Outfit
                  </h3>
                  <span className="text-xs font-semibold text-slate-400">
                    {outfit.products?.length || 0} items available
                  </span>
                </div>

                {!outfit.products || outfit.products.length === 0 ? (
                  <p className="text-sm text-slate-500 py-3 text-center italic">
                    No direct store links attached for this outfit yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {outfit.products.map((prod) => (
                      <div
                        key={prod.id}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all group"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                            {prod.productName}
                          </p>
                          <span
                            className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded border ${getPlatformBadgeColor(
                              prod.platform
                            )}`}
                          >
                            {prod.platform}
                          </span>
                        </div>

                        <a
                          href={prod.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex-shrink-0"
                        >
                          Shop Now
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
