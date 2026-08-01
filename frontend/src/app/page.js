'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { outfitService } from '@/services/outfitService';
import OutfitCard from '@/components/OutfitCard';
import { 
  Search, 
  MapPin, 
  Tag, 
  Sparkles, 
  Loader2, 
  ArrowRight, 
  Video, 
  ShoppingBag, 
  Play, 
  ChevronLeft, 
  ChevronRight,
  Sun,
  Plane,
  Heart,
  Coffee,
  GraduationCap,
  Briefcase,
  Flame,
  Crown,
  CheckCircle2,
  Compass
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    loadOutfits();
  }, []);

  const loadOutfits = async () => {
    setLoading(true);
    try {
      const data = await outfitService.getAllOutfits();
      setOutfits(data || []);
    } catch (err) {
      console.error('Failed to load outfits:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleChipClick = (term) => {
    // Check if it matches a direct location or category search
    const lower = term.toLowerCase();
    if (['goa', 'udaipur', 'las vegas', 'bali', 'paris', 'dubai'].includes(lower)) {
      router.push(`/location/${encodeURIComponent(term)}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(term)}`);
    }
  };

  // Scroll handler for trending outfits horizontal row
  const scrollTrending = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Featured destinations list with cover images
  const featuredDestinations = [
    {
      name: 'Goa',
      icon: '🏖',
      image: 'https://images.unsplash.com/photo-1512343800234-840322ee969c?auto=format&fit=crop&w=800&q=80',
      count: outfits.filter(o => (o.locations || []).some(l => l.toLowerCase().includes('goa'))).length || 14,
    },
    {
      name: 'Udaipur',
      icon: '🏰',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      count: outfits.filter(o => (o.locations || []).some(l => l.toLowerCase().includes('udaipur'))).length || 18,
    },
    {
      name: 'Las Vegas',
      icon: '🎰',
      image: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=800&q=80',
      count: outfits.filter(o => (o.locations || []).some(l => l.toLowerCase().includes('las vegas'))).length || 12,
    },
    {
      name: 'Bali',
      icon: '🌊',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      count: outfits.filter(o => (o.locations || []).some(l => l.toLowerCase().includes('bali'))).length || 22,
    },
    {
      name: 'Paris',
      icon: '🗼',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      count: outfits.filter(o => (o.locations || []).some(l => l.toLowerCase().includes('paris'))).length || 29,
    },
    {
      name: 'Dubai',
      icon: '🏙',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      count: outfits.filter(o => (o.locations || []).some(l => l.toLowerCase().includes('dubai'))).length || 16,
    },
  ];

  // Quick suggestions chips
  const suggestionChips = [
    'Goa',
    'Udaipur',
    'Las Vegas',
    'Airport Outfit',
    'Beach Vacation',
    'Date Night',
  ];

  // Categories list
  const categoryList = [
    { title: 'Beach', category: 'BEACH', icon: Sun, color: 'from-amber-500/20 to-orange-500/20 text-amber-400' },
    { title: 'Party', category: 'PARTY', icon: Sparkles, color: 'from-purple-500/20 to-pink-500/20 text-purple-400' },
    { title: 'Airport', category: 'AIRPORT', icon: Plane, color: 'from-blue-500/20 to-cyan-500/20 text-blue-400' },
    { title: 'Wedding', category: 'WEDDING', icon: Heart, color: 'from-rose-500/20 to-red-500/20 text-rose-400' },
    { title: 'Cafe', category: 'CAFE', icon: Coffee, color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400' },
    { title: 'College', category: 'COLLEGE', icon: GraduationCap, color: 'from-indigo-500/20 to-violet-500/20 text-indigo-400' },
    { title: 'Formal', category: 'FORMAL', icon: Briefcase, color: 'from-slate-500/20 to-gray-500/20 text-slate-300' },
    { title: 'Streetwear', category: 'STREETWEAR', icon: Flame, color: 'from-orange-500/20 to-red-500/20 text-orange-400' },
    { title: 'Luxury', category: 'LUXURY', icon: Crown, color: 'from-amber-400/20 to-yellow-500/20 text-amber-300' },
  ];

  // Feature cards for "Why Vyvora"
  const whyVyvoraFeatures = [
    {
      icon: MapPin,
      title: '📍 Destination Based',
      description: 'Find outfits tailored specifically for any city, climate, or holiday destination.',
      glow: 'from-rose-500/10 to-amber-500/10',
      badgeColor: 'text-rose-400 border-rose-500/20 bg-rose-500/10'
    },
    {
      icon: ShoppingBag,
      title: '🛍 Shop the Complete Look',
      description: 'Every outfit video guide comes with direct, verified store links to buy each item.',
      glow: 'from-indigo-500/10 to-purple-500/10',
      badgeColor: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10'
    },
    {
      icon: Video,
      title: '🎥 Style Videos',
      description: 'Watch realistic styling videos to see how outfits look and move before buying.',
      glow: 'from-amber-500/10 to-orange-500/10',
      badgeColor: 'text-amber-400 border-amber-500/20 bg-amber-500/10'
    },
    {
      icon: Sparkles,
      title: '✨ Curated Fashion',
      description: 'Only handpicked outfit collections approved by fashion designers and top creators.',
      glow: 'from-violet-500/10 to-pink-500/10',
      badgeColor: 'text-violet-400 border-violet-500/20 bg-violet-500/10'
    },
  ];

  // Trending Outfits (subset or all)
  const trendingOutfits = outfits.length > 0 ? outfits.slice(0, 6) : [];

  return (
    <div className="space-y-20 pb-20">

      {/* ================================================== */}
      {/* HERO SECTION */}
      {/* ================================================== */}
      <section className="relative pt-16 pb-12 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-amber-500/15 via-indigo-500/15 to-violet-500/15 blur-[140px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10 space-y-8">
          {/* Top Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-bold tracking-wide shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Fashion Discovery Platform</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Find Your Perfect Outfit for <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-indigo-300 bg-clip-text text-transparent">Every Destination</span>
          </h1>

          {/* Subheading */}
          <p className="text-slate-300 text-base sm:text-xl font-normal max-w-2xl mx-auto leading-relaxed">
            Discover curated outfits for travel, vacations, cafés, parties, weddings and everyday style. Watch styling videos and shop the complete look.
          </p>

          {/* Large Search Bar */}
          <div className="max-w-2xl mx-auto pt-2">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <div className="relative w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-400 transition-colors pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search destination, occasion or style..."
                  className="w-full pl-12 pr-32 py-4 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-amber-500/40 focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/15 text-white placeholder-slate-400 text-sm sm:text-base font-medium shadow-2xl backdrop-blur-xl transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs sm:text-sm font-extrabold shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick Suggestion Chips */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                Try searching:
              </span>
              {suggestionChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleChipClick(chip)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-amber-300 hover:border-amber-500/40 hover:bg-slate-800 transition-all text-xs font-semibold"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* FEATURED DESTINATIONS */}
      {/* ================================================== */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">
              <MapPin className="w-4 h-4" />
              <span>Explore Destinations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Featured Travel Locations
            </h2>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md">
            Click any destination to discover location-perfect outfits, weather-matched styles, and complete shopping links.
          </p>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredDestinations.map((dest) => (
            <Link
              key={dest.name}
              href={`/location/${encodeURIComponent(dest.name)}`}
              className="group relative h-64 rounded-2xl overflow-hidden border border-white/10 hover:border-amber-500/50 transition-all duration-500 shadow-xl"
            >
              {/* Cover Image */}
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-90"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between z-10">
                <div>
                  <span className="text-2xl mb-1 block">{dest.icon}</span>
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium mt-1">
                    {dest.count} outfits available
                  </p>
                </div>

                <div className="w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 group-hover:border-amber-400 transition-all duration-300">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================================================== */}
      {/* TRENDING OUTFITS */}
      {/* ================================================== */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Curated Inspiration</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>🔥 Trending Outfits</span>
            </h2>
          </div>

          {/* Carousel controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollTrending('left')}
              className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 hover:border-amber-500/40 text-slate-300 hover:text-white flex items-center justify-center transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollTrending('right')}
              className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 hover:border-amber-500/40 text-slate-300 hover:text-white flex items-center justify-center transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Container */}
        {loading ? (
          <div className="py-16 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            <p className="text-slate-400 text-sm">Loading trending outfits...</p>
          </div>
        ) : trendingOutfits.length === 0 ? (
          <div className="py-12 text-center bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md mx-auto">
            <p className="text-slate-300 font-semibold text-sm">No outfits uploaded yet.</p>
          </div>
        ) : (
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth"
          >
            {trendingOutfits.map((outfit) => (
              <OutfitCard key={outfit.id} outfit={outfit} isHorizontal={true} />
            ))}
          </div>
        )}
      </section>

      {/* ================================================== */}
      {/* SHOP BY CATEGORY */}
      {/* ================================================== */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">
              <Tag className="w-4 h-4" />
              <span>Browse Outfits</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Shop by Category
            </h2>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md">
            Find clothing styles curated for specific occasions, dress codes, and aesthetic moods.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5">
          {categoryList.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <Link
                key={cat.category}
                href={`/category/${encodeURIComponent(cat.category)}`}
                className="glass-card p-6 rounded-2xl border border-white/10 hover:border-amber-500/40 transition-all group flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Explore {cat.title} style collection
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ================================================== */}
      {/* WHY VYVORA */}
      {/* ================================================== */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-indigo-500/10 blur-[100px] pointer-events-none rounded-full" />

          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              The Vyvora Experience
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why Choose Vyvora?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              The premier fashion-tech discovery engine designed for real travelers, trendsetters, and style enthusiasts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyVyvoraFeatures.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-900/70 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all space-y-4 group"
                >
                  <div className={`w-12 h-12 rounded-xl ${feat.badgeColor} border flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* LATEST UPLOADS */}
      {/* ================================================== */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">
              <Video className="w-4 h-4" />
              <span>Catalog Uploads</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Latest Uploads
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-400 bg-slate-900 border border-white/5 px-3 py-1.5 rounded-xl">
            {outfits.length} Outfits Published
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            <p className="text-slate-400 text-sm">Loading latest outfit collection...</p>
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
              <OutfitCard key={outfit.id} outfit={outfit} isHorizontal={false} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
