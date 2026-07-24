'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { Sparkles, Heart, Bookmark, Search, Menu, X, LogOut, User, Shirt, Video } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Outfit Generator', href: '/generator', icon: Sparkles },
    { name: 'Style Videos', href: '/videos', icon: Video },
    { name: 'Search Catalog', href: '/search', icon: Search },
    ...(isAuthenticated ? [
      { name: 'Saved Looks', href: '/saved', icon: Bookmark },
      { name: 'Wishlist', href: '/wishlist', icon: Heart }
    ] : [])
  ];

  const isActive = (path) => pathname === path;

  return (
    <nav className="glass-panel sticky top-0 z-50 w-full border-b border-white/5 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="rounded-xl bg-gradient-to-br from-amber-500 via-indigo-600 to-violet-600 p-2 text-white shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
                <Shirt className="h-5 w-5" />
              </div>
              <span className="text-2xl font-black tracking-wider group-hover:brightness-110 transition-all">
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]">
                  FIT
                </span>
                <span className="bg-gradient-to-r from-slate-100 via-indigo-200 to-violet-300 bg-clip-text text-transparent font-light tracking-tight ml-0.5">
                  atlas
                </span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(link.href)
                      ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-white/5 hover:border-white/10 transition-all group">
                  <User className="h-4 w-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-slate-300 font-medium">{user?.name || 'My Profile'}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-rose-500/20 text-rose-400 hover:text-white hover:bg-rose-500 hover:border-rose-500 text-xs font-semibold tracking-wide transition-all"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-xs text-slate-300 hover:text-white font-semibold transition-all px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-primary hover:opacity-90 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg shadow-indigo-500/25 tracking-wide transition-all hover:scale-[1.02]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none transition-all"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-panel border-b border-white/5 px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2.5 rounded-lg text-base font-medium transition-all ${isActive(link.href)
                    ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
              >
                {Icon && <Icon className="h-5 w-5" />}
                <span>{link.name}</span>
              </Link>
            );
          })}
          <div className="border-t border-white/5 pt-4 pb-2 px-3 space-y-2">
            {isAuthenticated ? (
              <div className="flex flex-col space-y-2">
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 text-slate-300 hover:text-white"
                >
                  <User className="h-5 w-5 text-indigo-400" />
                  <span>{user?.name || 'My Profile'}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-2 text-rose-400 hover:text-rose-300 text-left pt-2"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-center text-slate-300 hover:text-white font-semibold py-2 rounded-lg hover:bg-white/5"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="text-center bg-gradient-primary text-white font-bold py-2.5 rounded-lg shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
