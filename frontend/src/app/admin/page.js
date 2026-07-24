'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import outfitService from '../../services/outfitService';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Film,
  Image as ImageIcon,
  MapPin,
  Tag,
  ShoppingBag,
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, initializeAuth } = useAuthStore();

  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/admin/login');
      return;
    }
    loadOutfits();
  }, [isAuthenticated, user, router]);

  const loadOutfits = async () => {
    setLoading(true);
    try {
      const data = await outfitService.getAllOutfits();
      setOutfits(data || []);
    } catch (err) {
      console.error('Failed to load outfits for admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this outfit? The Cloudinary asset and attached product links will be permanently deleted.')) {
      return;
    }
    try {
      await outfitService.deleteOutfit(id);
      setOutfits((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error('Delete outfit error:', err);
      alert('Failed to delete outfit: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredOutfits = outfits.filter(
    (o) =>
      o.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categoriesCount = new Set(outfits.map((o) => o.category).filter(Boolean)).size;
  const locationsCount = new Set(outfits.map((o) => o.location).filter(Boolean)).size;
  const totalProducts = outfits.reduce((acc, o) => acc + (o.products?.length || 0), 0);

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Admin Control Panel
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100">Outfit Management</h1>
            <p className="text-sm text-slate-400">
              Create, edit, and delete outfits, product links, and Cloudinary media assets
            </p>
          </div>

          <Link
            href="/admin/upload"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-semibold text-sm shadow-lg hover:shadow-amber-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Upload New Outfit
          </Link>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-1">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Outfits</p>
            <p className="text-3xl font-bold text-slate-100">{outfits.length}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-1">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Categories</p>
            <p className="text-3xl font-bold text-violet-400">{categoriesCount}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-1">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Locations Covered</p>
            <p className="text-3xl font-bold text-indigo-400">{locationsCount}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-1">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Product Links</p>
            <p className="text-3xl font-bold text-emerald-400">{totalProducts}</p>
          </div>
        </div>

        {/* Outfits Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-4">
          <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-100">All Published Outfits</h2>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search outfits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400">Loading admin outfits...</div>
          ) : filteredOutfits.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <p className="text-slate-400 font-medium">No outfits found</p>
              <Link
                href="/admin/upload"
                className="inline-flex items-center gap-1.5 text-amber-400 hover:underline text-sm font-semibold"
              >
                <Plus className="w-4 h-4" /> Create your first outfit
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-xs font-semibold text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Media</th>
                    <th className="px-6 py-4">Title & Description</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4 text-center">Products</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredOutfits.map((outfit) => (
                    <tr key={outfit.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-14 h-14 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden relative flex items-center justify-center">
                          {outfit.mediaUrl ? (
                            outfit.mediaType === 'VIDEO' ? (
                              <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
                                <Film className="w-6 h-6 text-indigo-400" />
                              </div>
                            ) : (
                              <img
                                src={outfit.mediaUrl}
                                alt={outfit.title}
                                className="w-full h-full object-cover"
                              />
                            )
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-600" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-100">{outfit.title}</p>
                        <p className="text-xs text-slate-400 line-clamp-1 max-w-xs">
                          {outfit.description || 'No description'}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                          {outfit.category || 'GENERAL'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className="flex items-center gap-1 text-xs font-medium text-slate-200">
                            <MapPin className="w-3.5 h-3.5 text-rose-400" />
                            {outfit.location || 'Global'}
                          </span>
                          <span
                            className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded ${
                              outfit.isLocationSpecific
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {outfit.isLocationSpecific ? 'Location Specific' : 'Global'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-800 text-slate-200">
                          <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                          {outfit.products?.length || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                        <Link
                          href={`/videos/${outfit.id}`}
                          className="inline-flex p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                          title="View Public Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/edit/${outfit.id}`}
                          className="inline-flex p-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-colors"
                          title="Edit Outfit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(outfit.id)}
                          className="inline-flex p-2 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 transition-colors"
                          title="Delete Outfit"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
