'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../../../store/authStore';
import outfitService from '../../../../services/outfitService';
import MediaUploader from '../../../../components/MediaUploader';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  ShoppingBag,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function AdminEditOutfitPage({ params }) {
  const resolvedParams = use(params);
  const outfitId = resolvedParams.id;

  const router = useRouter();
  const { user, isAuthenticated, initializeAuth } = useAuthStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState(['CASUAL']);
  const [locations, setLocations] = useState([]);
  const [locationInput, setLocationInput] = useState('');
  const [isLocationSpecific, setIsLocationSpecific] = useState(true);
  const [occasion, setOccasion] = useState('');
  const [style, setStyle] = useState('');
  const [mediaInfo, setMediaInfo] = useState(null);

  const [products, setProducts] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const CATEGORY_OPTIONS = [
    'CASUAL',
    'FORMAL',
    'PARTY',
    'BEACH',
    'STREETWEAR',
    'ATHLEISURE',
    'ETHNIC',
    'WINTER',
  ];

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/admin/login');
      return;
    }
    loadOutfitData();
  }, [isAuthenticated, user, outfitId, router]);

  const loadOutfitData = async () => {
    setFetching(true);
    try {
      const data = await outfitService.getOutfitById(outfitId);
      if (data) {
        setTitle(data.title || '');
        setDescription(data.description || '');
        if (data.categories?.length > 0) {
          setCategories(data.categories);
        } else if (data.category) {
          setCategories([data.category]);
        } else {
          setCategories(['CASUAL']);
        }

        if (data.locations?.length > 0) {
          setLocations(data.locations);
        } else if (data.location) {
          setLocations([data.location]);
        } else {
          setLocations([]);
        }

        setIsLocationSpecific(data.isLocationSpecific ?? true);
        setOccasion(data.occasion || '');
        setStyle(data.style || '');
        setMediaInfo({
          mediaUrl: data.mediaUrl,
          publicId: data.publicId,
          mediaType: data.mediaType || 'VIDEO',
        });
        setProducts(
          data.products?.length > 0
            ? data.products.map((p) => ({
                productName: p.productName,
                productUrl: p.productUrl,
                platform: p.platform || 'Myntra',
              }))
            : [{ productName: '', productUrl: '', platform: 'Myntra' }]
        );
      }
    } catch (err) {
      console.error('Failed to load outfit for edit:', err);
      setError('Failed to fetch outfit details');
    } finally {
      setFetching(false);
    }
  };

  const toggleCategory = (cat) => {
    if (categories.includes(cat)) {
      if (categories.length > 1) {
        setCategories(categories.filter((c) => c !== cat));
      }
    } else {
      setCategories([...categories, cat]);
    }
  };

  const handleAddLocation = () => {
    const trimmed = locationInput.trim();
    if (trimmed && !locations.includes(trimmed)) {
      setLocations([...locations, trimmed]);
      setLocationInput('');
    }
  };

  const handleRemoveLocation = (locToRemove) => {
    setLocations(locations.filter((loc) => loc !== locToRemove));
  };

  const handleAddProduct = () => {
    setProducts([...products, { productName: '', productUrl: '', platform: 'Myntra' }]);
  };

  const handleRemoveProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleProductChange = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!mediaInfo?.mediaUrl) {
      setError('Please upload an image or video before updating');
      return;
    }

    if (categories.length === 0) {
      setError('Please select at least one category');
      return;
    }

    const validProducts = products.filter(
      (p) => p.productName.trim() !== '' && p.productUrl.trim() !== ''
    );

    setSaving(true);

    try {
      const payload = {
        title,
        description,
        mediaUrl: mediaInfo.mediaUrl,
        publicId: mediaInfo.publicId,
        mediaType: mediaInfo.mediaType,
        categories: categories,
        category: categories[0] || 'CASUAL',
        isLocationSpecific,
        locations: locations,
        location: locations.length > 0 ? locations.join(', ') : '',
        occasion,
        style,
        products: validProducts,
      };

      await outfitService.updateOutfit(outfitId, payload);
      router.push('/admin');
    } catch (err) {
      console.error('Outfit update error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update outfit');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Edit Mode
          </span>
        </div>

        {fetching ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            <p className="text-slate-400 text-sm">Loading outfit details...</p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Edit Outfit #{outfitId.substring(0, 8)}</h1>
              <p className="text-sm text-slate-400">
                Update outfit metadata, replace Cloudinary media, or modify attached store product links
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-300 text-sm flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Media Uploader Section */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase">
                  Outfit Media (Image or Video) *
                </label>
                <MediaUploader value={mediaInfo} onChange={setMediaInfo} disabled={saving} />
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase">
                    Outfit Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Goa Beach Sunset Outfit"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide styling details..."
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase">
                    Categories (Select Multiple) *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORY_OPTIONS.map((cat) => {
                      const isSelected = categories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-500/20'
                              : 'bg-slate-950 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase">
                    Locations (Optional - Add Multiple)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddLocation();
                        }
                      }}
                      placeholder="Type location (e.g. Goa, Mumbai, Paris) and press Enter"
                      className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddLocation}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
                    >
                      + Add
                    </button>
                  </div>
                  {locations.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {locations.map((loc, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded-full text-xs font-medium"
                        >
                          {loc}
                          <button
                            type="button"
                            onClick={() => handleRemoveLocation(loc)}
                            className="hover:text-rose-400 transition-colors ml-0.5"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-400 uppercase">
                    Occasion (Optional)
                  </label>
                  <input
                    type="text"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    placeholder="e.g., Night Out"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-400 uppercase">
                    Style Vibe (Optional)
                  </label>
                  <input
                    type="text"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    placeholder="e.g., Minimalist"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>

              {/* Location Specific Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <p className="text-sm font-semibold text-slate-200">Location Specific Outfit</p>
                  <p className="text-xs text-slate-400">
                    Is this outfit tailored to specific weather & local vibes of this location?
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isLocationSpecific}
                    onChange={(e) => setIsLocationSpecific(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                </label>
              </div>

              {/* Product Links Section */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-indigo-400" />
                      Product Store Links
                    </h3>
                    <p className="text-xs text-slate-400">
                      Manage external marketplace buy links for items in this outfit
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddProduct}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Product Link
                  </button>
                </div>

                <div className="space-y-3">
                  {products.map((prod, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800"
                    >
                      <div className="w-full sm:w-1/3">
                        <input
                          type="text"
                          placeholder="Product Name"
                          value={prod.productName}
                          onChange={(e) => handleProductChange(idx, 'productName', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="w-full sm:w-1/2">
                        <input
                          type="url"
                          placeholder="Product URL"
                          value={prod.productUrl}
                          onChange={(e) => handleProductChange(idx, 'productUrl', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="w-full sm:w-1/4 flex items-center gap-2">
                        <select
                          value={prod.platform}
                          onChange={(e) => handleProductChange(idx, 'platform', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                        >
                          <option value="Myntra">Myntra</option>
                          <option value="AJIO">AJIO</option>
                          <option value="Meesho">Meesho</option>
                          <option value="Amazon">Amazon</option>
                          <option value="Flipkart">Flipkart</option>
                          <option value="Zara">Zara</option>
                          <option value="H&M">H&M</option>
                          <option value="Other">Other</option>
                        </select>
                        {products.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(idx)}
                            className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-end gap-3">
                <Link
                  href="/admin"
                  className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Updating Outfit...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
