'use client';

import React from 'react';
import Link from 'next/link';
import { Shirt, Sparkles, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-950 border-t border-white/10 pt-16 pb-12 relative overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-amber-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2.5 group w-fit">
              <div className="rounded-xl bg-gradient-to-br from-amber-500 via-indigo-600 to-violet-600 p-2 text-white shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
                <Shirt className="h-5 w-5" />
              </div>
              <span className="text-2xl font-black tracking-wider">
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]">
                  Vy
                </span>
                <span className="bg-gradient-to-r from-slate-100 via-indigo-200 to-violet-300 bg-clip-text text-transparent font-medium tracking-tight">
                  vora
                </span>
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Your ultimate fashion discovery platform. Find curated outfits for every destination, watch video styling guides, and shop verified complete looks seamlessly.
            </p>

            <div className="flex items-center gap-3 pt-2">
              {/* Instagram SVG */}
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-300 hover:text-pink-400 hover:border-pink-500/30 hover:bg-slate-800 transition-all group"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* YouTube SVG */}
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:border-rose-500/30 hover:bg-slate-800 transition-all group"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/generator" className="text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>AI Outfit Generator</span>
                </Link>
              </li>
              <li>
                <Link href="/videos" className="text-slate-400 hover:text-white transition-colors">
                  Style Videos
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-slate-400 hover:text-white transition-colors">
                  Search Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/#about" className="text-slate-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-slate-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/#privacy" className="text-slate-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/#terms" className="text-slate-400 hover:text-white transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Destinations Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">Popular Destinations</h4>
            <div className="flex flex-wrap gap-2">
              {['Goa', 'Udaipur', 'Las Vegas', 'Bali', 'Paris', 'Dubai'].map((loc) => (
                <Link
                  key={loc}
                  href={`/location/${encodeURIComponent(loc)}`}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/5 hover:border-amber-500/40 text-slate-300 hover:text-white text-xs transition-all flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>{loc}</span>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} Vyvora. Outfitting you head to toe for every destination.</p>
          <div className="flex items-center space-x-6">
            <Link href="/#privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link href="/#terms" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
            <Link href="/#contact" className="hover:text-slate-400 transition-colors">Contact Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
