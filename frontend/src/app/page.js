'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, ShieldCheck, ThermometerSun, Search, ShoppingBag, Play } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const categories = [
    { title: 'Date Night Look', occasion: 'Date', img: 'https://images.unsplash.com/photo-1516715094727-ec48be335d79?auto=format&fit=crop&w=600&q=80', desc: 'Sleek, romantic outfits to make a lasting impression.' },
    { title: 'Goa Vacation', occasion: 'Vacation', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', desc: 'Breezy linen shirts, floral skirts, and light fabrics for beaches.' },
    { title: 'College Outfits', occasion: 'College', img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80', desc: 'Oversized tees, baggy jeans, and retro sneakers under budget.' },
    { title: 'Job Interview', occasion: 'Interview', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80', desc: 'Sharp, corporate formal wear to secure your dream role.' },
    { title: 'Wedding Ceremonies', occasion: 'Wedding', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80', desc: 'Premium traditional sherwanis, Anarkalis, and rich accessories.' },
    { title: 'Airport Look', occasion: 'Airport', img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80', desc: 'Ultra-comfortable hoodies, joggers, and slip-on trainers.' }
  ];

  const selectOccasionAndGo = (occasion) => {
    router.push(`/generator?occasion=${encodeURIComponent(occasion)}`);
  };

  return (
    <div className="relative isolate px-6 pt-10 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="mx-auto max-w-3xl py-16 sm:py-24 text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative rounded-full px-3 py-1 text-xs leading-6 text-slate-400 ring-1 ring-white/10 hover:ring-white/20 flex items-center space-x-1">
            <Play className="h-4 w-4 text-indigo-400 fill-current" />
            <span>As seen on YouTube! Direct outfit links attached.</span>
          </div>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
          Dressed from head to toe, <span className="text-gradient">powered by AI</span>
        </h1>
        
        <p className="mt-6 text-lg leading-8 text-slate-300">
          Tell us where you are going, your budget, your preferred style, and location. 
          We&apos;ll analyze the weather instantly and recommend 3 complete looks with direct marketplace purchase links.
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/generator"
            className="flex items-center space-x-2 rounded-xl bg-gradient-primary px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="h-4 w-4" />
            <span>Generate Outfit Now</span>
          </Link>
          <Link href="/search" className="text-sm font-semibold leading-6 text-slate-300 hover:text-white flex items-center space-x-1.5 transition-all">
            <span>Browse Catalog</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Features Showcase */}
      <div className="mx-auto max-w-5xl py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="glass-card p-6 rounded-2xl">
            <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400 w-fit mb-4">
              <ThermometerSun className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Weather-Aware Suggestions</h3>
            <p className="text-sm text-slate-400">
              No heavy velvet in 40°C or white sneakers in heavy rain. We pull weather stats for your destination automatically.
            </p>
          </div>
          
          <div className="glass-card p-6 rounded-2xl">
            <div className="rounded-xl bg-violet-500/10 p-3 text-violet-400 w-fit mb-4">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Catalog Match Ranking</h3>
            <p className="text-sm text-slate-400">
              Matches styling items to verified inventory on Ajio, Myntra, Savana, and Meesho ranked by rating and price.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <div className="rounded-xl bg-rose-500/10 p-3 text-rose-400 w-fit mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Complete Looks Only</h3>
            <p className="text-sm text-slate-400">
              We styling you from tops and bottoms to sneakers, loaders, hats, and jewelry. Complete head-to-toe logic.
            </p>
          </div>
        </div>
      </div>

      {/* Trending Occasions Section */}
      <div className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Where are you heading?
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            Choose an occasion below to quickly launch the outfit builder with styling parameters ready.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div 
              key={cat.title} 
              onClick={() => selectOccasionAndGo(cat.occasion)}
              className="glass-card overflow-hidden rounded-2xl cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img 
                  src={cat.img} 
                  alt={cat.title} 
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4">
                  <span className="inline-flex items-center rounded-md bg-indigo-500/20 border border-indigo-500/30 px-2 py-1 text-xs font-semibold text-indigo-300">
                    {cat.occasion}
                  </span>
                </div>
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-slate-400 mb-4">
                    {cat.desc}
                  </p>
                </div>
                <div className="flex items-center space-x-1 text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
                  <span>Generate Look</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
