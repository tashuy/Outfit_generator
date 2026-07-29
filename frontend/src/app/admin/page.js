'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import outfitService from '../../services/outfitService';
import analyticsService from '../../services/analyticsService';
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
  MousePointerClick,
  TrendingUp,
  BarChart2,
  PieChart as PieIcon,
  Flame,
  Loader2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, initializeAuth } = useAuthStore();

  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Analytics states
  const [analyticsSummary, setAnalyticsSummary] = useState({
    totalViews: 0,
    totalProductClicks: 0,
    topLocation: 'N/A',
    topCategory: 'N/A',
    mostViewedOutfit: null,
  });
  const [topOutfits, setTopOutfits] = useState([]);
  const [topLocations, setTopLocations] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  const PIE_COLORS = ['#f59e0b', '#8b5cf6', '#3b82f6', '#10b981', '#ec4899', '#6366f1', '#14b8a6', '#f97316'];

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/admin/login');
      return;
    }
    loadDashboardData();
  }, [isAuthenticated, user, router]);

  const loadDashboardData = async () => {
    setLoading(true);
    setAnalyticsLoading(true);

    try {
      const [outfitsData, summaryData, topOutfitsData, topLocsData, topCatsData] = await Promise.all([
        outfitService.getAllOutfits().catch(() => []),
        analyticsService.getDashboard().catch(() => null),
        analyticsService.getTopOutfits().catch(() => []),
        analyticsService.getTopLocations().catch(() => []),
        analyticsService.getTopCategories().catch(() => []),
      ]);

      setOutfits(outfitsData || []);

      if (summaryData) {
        setAnalyticsSummary(summaryData);
      }
      setTopOutfits(topOutfitsData || []);
      setTopLocations(topLocsData || []);
      setTopCategories(topCatsData || []);
    } catch (err) {
      console.error('Failed to load admin analytics or outfits:', err);
    } finally {
      setLoading(false);
      setAnalyticsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this outfit? The Cloudinary asset and attached product links will be permanently deleted.')) {
      return;
    }
    try {
      await outfitService.deleteOutfit(id);
      setOutfits((prev) => prev.filter((o) => o.id !== id));
      setTopOutfits((prev) => prev.filter((o) => o.id !== id));
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

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
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
            <h1 className="text-2xl font-bold text-slate-100">Outfit & Analytics Dashboard</h1>
            <p className="text-sm text-slate-400">
              Real-time platform traffic, product link engagement, and content management
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

        {/* 1. Analytics Summary Cards Section */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider text-xs">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            Platform Overview Metrics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Outfit Views */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Outfit Views</p>
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Eye className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white">
                {analyticsLoading ? '...' : (analyticsSummary.totalViews || 0).toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400">👀 Lifetime content impressions</p>
            </div>

            {/* Card 2: Product Link Clicks */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Product Link Clicks</p>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <MousePointerClick className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-emerald-400">
                {analyticsLoading ? '...' : (analyticsSummary.totalProductClicks || 0).toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400">🛍 Direct store buy redirects</p>
            </div>

            {/* Card 3: Top Location */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Location</p>
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-rose-300 truncate">
                {analyticsLoading ? '...' : (analyticsSummary.topLocation || 'N/A')}
              </p>
              <p className="text-[11px] text-slate-400">📍 Highest viewed destination</p>
            </div>

            {/* Card 4: Top Category */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Category</p>
                <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                  <Flame className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-violet-300 truncate">
                {analyticsLoading ? '...' : (analyticsSummary.topCategory || 'N/A')}
              </p>
              <p className="text-[11px] text-slate-400">🔥 Most engaging fashion style</p>
            </div>
          </div>
        </div>

        {/* 2. Recharts Visualizations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart: Most Popular Locations */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-indigo-400" />
                  Most Popular Locations
                </h3>
                <p className="text-xs text-slate-400">Aggregated views by destination</p>
              </div>
              <span className="px-2.5 py-1 text-[10px] font-semibold rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Bar Analytics
              </span>
            </div>

            {analyticsLoading ? (
              <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
                <Loader2 className="w-6 h-6 text-amber-400 animate-spin mr-2" /> Loading location chart...
              </div>
            ) : topLocations.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-slate-500 text-sm italic">
                No location analytics available yet
              </div>
            ) : (
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topLocations} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <XAxis
                      dataKey="location"
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                    />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '0.75rem',
                        color: '#f8fafc',
                        fontSize: '12px',
                      }}
                      cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                    />
                    <Bar dataKey="views" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Pie Chart: Most Popular Categories */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-amber-400" />
                  Most Popular Categories
                </h3>
                <p className="text-xs text-slate-400">View breakdown across category tags</p>
              </div>
              <span className="px-2.5 py-1 text-[10px] font-semibold rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Share Distribution
              </span>
            </div>

            {analyticsLoading ? (
              <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
                <Loader2 className="w-6 h-6 text-amber-400 animate-spin mr-2" /> Loading category chart...
              </div>
            ) : topCategories.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-slate-500 text-sm italic">
                No category analytics available yet
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topCategories}
                      dataKey="views"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={40}
                      paddingAngle={3}
                      label={({ category }) => category}
                    >
                      {topCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '0.75rem',
                        color: '#f8fafc',
                        fontSize: '12px',
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
                      formatter={(value) => <span className="text-slate-300 text-xs">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* 3. Top 10 Viewed Outfits Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-4">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                Top Performing Outfits (By Views)
              </h2>
              <p className="text-xs text-slate-400">Top 10 most viewed style guides across the platform</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Top 10
            </span>
          </div>

          {analyticsLoading ? (
            <div className="py-12 text-center text-slate-400 text-sm">Loading top performing outfits...</div>
          ) : topOutfits.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm italic">No outfit view records yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-xs font-semibold text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5">Thumbnail</th>
                    <th className="px-6 py-3.5">Title</th>
                    <th className="px-6 py-3.5">Location</th>
                    <th className="px-6 py-3.5">Category</th>
                    <th className="px-6 py-3.5 text-right">Views</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {topOutfits.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-3 whitespace-nowrap">
                        <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden relative flex items-center justify-center">
                          {item.thumbnail ? (
                            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-600" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <Link href={`/videos/${item.id}`} className="font-bold text-slate-100 hover:text-amber-400 transition-colors">
                          {item.title}
                        </Link>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <span className="flex items-center gap-1 text-xs font-medium text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-rose-400" />
                          {item.location || 'Global'}
                        </span>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                          {item.category || 'CASUAL'}
                        </span>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-right font-extrabold text-amber-400">
                        <span className="inline-flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          {(item.views || 0).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 4. Full Published Outfits Catalog Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-4">
          <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-100">All Published Outfits Catalog</h2>
              <p className="text-xs text-slate-400">Manage existing outfit guides, product links, and Cloudinary media</p>
            </div>
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
                    <th className="px-6 py-4 text-center">Views</th>
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
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-800 text-amber-400">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          {(outfit.viewCount || 0).toLocaleString()}
                        </span>
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
