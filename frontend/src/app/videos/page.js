'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { videoService } from '@/services/videoService';
import { 
  Video, 
  UploadCloud, 
  Search, 
  MapPin, 
  Tag, 
  Sparkles, 
  X, 
  AlertCircle, 
  Clock, 
  User 
} from 'lucide-react';
import Link from 'next/link';

export default function VideosPage() {
  const { user, isAuthenticated, initializeAuth } = useAuthStore();
  
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');
  
  // Upload modal states
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Upload form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [occasion, setOccasion] = useState('Casual');
  const [style, setStyle] = useState('Minimal');
  const [file, setFile] = useState(null);

  useEffect(() => {
    initializeAuth();
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setLoading(true);
    try {
      const data = await videoService.getVideos();
      setVideos(data);
    } catch (err) {
      console.error('Failed to load videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchLocation.trim()) {
      loadVideos();
      return;
    }
    setLoading(true);
    try {
      const data = await videoService.searchVideosByLocation(searchLocation);
      setVideos(data);
    } catch (err) {
      console.error('Failed to filter videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!file) {
      setError('Please select a video file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('occasion', occasion);
    formData.append('style', style);

    setUploadLoading(true);
    try {
      await videoService.uploadVideo(formData);
      setSuccess('Video uploaded successfully!');
      setTitle('');
      setDescription('');
      setLocation('');
      setFile(null);
      
      // Reload videos and close modal after 1.5 seconds
      setTimeout(() => {
        setUploadModalOpen(false);
        setSuccess('');
        loadVideos();
      }, 1500);
      
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.response?.data?.message || 'Failed to upload video. Please ensure file is valid mp4/webm.');
    } finally {
      setUploadLoading(false);
    }
  };

  // Convert backend URL to absolute base URL
  const getVideoUrl = (path) => {
    if (!path || typeof path !== 'string') return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:8080${path}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2 sm:text-4xl">
            <Video className="h-8 w-8 text-indigo-400" />
            <span>Local Style Guides</span>
          </h1>
          <p className="text-slate-400 mt-2">
            Watch styling tips, outfits, and fashion guides uploaded by local creators for specific locations.
          </p>
        </div>
        
        {user?.role === 'ADMIN' && (
          <Link
            href="/admin/upload"
            className="flex items-center space-x-2 rounded-xl bg-gradient-primary px-5 py-3 text-sm font-bold text-white shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Upload Outfit</span>
          </Link>
        )}
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-10">
        <div className="relative flex max-w-lg">
          <input
            type="text"
            placeholder="Search by location (e.g., Indore, Bangalore)..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-3 px-4 pl-11 focus:outline-none focus:border-indigo-500 text-sm"
          />
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
          <button
            type="submit"
            className="ml-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors cursor-pointer"
          >
            Search
          </button>
        </div>
      </form>

      {/* Feed */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          <p className="text-slate-400 mt-4 text-sm">Loading guides...</p>
        </div>
      ) : videos.length === 0 ? (
        <div className="glass-card text-center py-20 rounded-2xl max-w-xl mx-auto">
          <Video className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No videos found</h3>
          <p className="text-sm text-slate-400">
            Be the first to upload an outfit guide video for this location!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((vid) => (
            <div key={vid.id} className="glass-card overflow-hidden rounded-2xl flex flex-col justify-between">
              {/* Video Player */}
              <div className="relative aspect-[9/16] bg-black max-h-[480px] overflow-hidden">
                <video
                  src={getVideoUrl(vid.mediaUrl || vid.videoUrl)}
                  controls
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Metadata details */}
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2 truncate">{vid.title}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-4">{vid.description}</p>
                  
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 text-xs font-semibold text-indigo-300">
                      <MapPin className="h-3 w-3" />
                      {vid.location}
                    </span>
                    {vid.occasion && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 text-xs font-semibold text-violet-300">
                        <Tag className="h-3 w-3" />
                        {vid.occasion}
                      </span>
                    )}
                    {vid.style && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                        <Sparkles className="h-3 w-3" />
                        {vid.style}
                      </span>
                    )}
                  </div>
                </div>

                {/* Uploader Info */}
                <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/60 pt-4">
                  <div className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    <span>{vid.user ? vid.user.name : 'Creator'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{new Date(vid.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-lg rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <UploadCloud className="h-5 w-5 text-indigo-400" />
                <span>Upload Style Video</span>
              </h2>
              <button 
                onClick={() => setUploadModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              {error && (
                <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-300 p-3.5 rounded-xl text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 p-3.5 rounded-xl text-sm">
                  <Sparkles className="h-4 w-4 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Video Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Casual Summer look in Indore"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Tell others about the outfit, layers, and style considerations..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-500 text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Indore"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Occasion</label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-3.5 px-4 focus:outline-none focus:border-indigo-500 text-sm cursor-pointer"
                  >
                    <option value="Casual">Casual</option>
                    <option value="Office">Office</option>
                    <option value="Date">Date</option>
                    <option value="Vacation">Vacation</option>
                    <option value="Wedding">Wedding</option>
                    <option value="College">College</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Style Tag</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-3.5 px-4 focus:outline-none focus:border-indigo-500 text-sm cursor-pointer"
                >
                  <option value="Minimal">Minimal</option>
                  <option value="Old Money">Old Money</option>
                  <option value="Korean">Korean</option>
                  <option value="Streetwear">Streetwear</option>
                  <option value="Traditional">Traditional</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Video File</label>
                <div className="relative border border-dashed border-slate-800 hover:border-indigo-500/50 rounded-xl p-6 text-center cursor-pointer transition-colors">
                  <input
                    type="file"
                    accept="video/mp4,video/webm"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <UploadCloud className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                  <span className="block text-xs text-slate-400 font-bold mb-1">
                    {file ? file.name : 'Select or drag video file'}
                  </span>
                  <span className="block text-[10px] text-slate-500">Supports .mp4 or .webm</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 transition-colors text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadLoading}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {uploadLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <span>Submit</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
