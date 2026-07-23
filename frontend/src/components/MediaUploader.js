'use client';

import React, { useState } from 'react';
import mediaService from '../services/mediaService';
import { Upload, X, Film, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';

export default function MediaUploader({ value, onChange, disabled = false }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const allowedImageExts = ['jpg', 'jpeg', 'png', 'webp'];
  const allowedVideoExts = ['mp4', 'webm', 'mov'];
  const maxImageSize = 10 * 1024 * 1024; // 10MB
  const maxVideoSize = 100 * 1024 * 1024; // 100MB

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processAndUploadFile(file);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    if (disabled || uploading) return;
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processAndUploadFile(file);
  };

  const processAndUploadFile = async (file) => {
    setError(null);
    const ext = file.name.split('.').pop()?.toLowerCase();
    const isImage = allowedImageExts.includes(ext);
    const isVideo = allowedVideoExts.includes(ext);

    if (!isImage && !isVideo) {
      setError(`Invalid file format. Allowed formats: ${[...allowedImageExts, ...allowedVideoExts].join(', ')}`);
      return;
    }

    if (isImage && file.size > maxImageSize) {
      setError('Image file size exceeds 10 MB limit');
      return;
    }

    if (isVideo && file.size > maxVideoSize) {
      setError('Video file size exceeds 100 MB limit');
      return;
    }

    setUploading(true);
    try {
      const response = await mediaService.uploadMedia(file);
      onChange({
        mediaUrl: response.mediaUrl,
        publicId: response.publicId,
        mediaType: response.mediaType,
      });
    } catch (err) {
      console.error('Media upload error:', err);
      setError(err.response?.data?.message || err.message || 'Media upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (value?.publicId) {
      try {
        await mediaService.deleteMedia(value.publicId);
      } catch (err) {
        console.warn('Failed to delete media asset from Cloudinary:', err);
      }
    }
    onChange(null);
    setError(null);
  };

  return (
    <div className="w-full space-y-2">
      {value?.mediaUrl ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-900/80 shadow-lg">
          {value.mediaType === 'VIDEO' ? (
            <video
              src={value.mediaUrl}
              controls
              className="w-full max-h-[350px] object-contain bg-black"
            />
          ) : (
            <img
              src={value.mediaUrl}
              alt="Media Preview"
              className="w-full max-h-[350px] object-contain bg-slate-950"
            />
          )}

          <div className="absolute top-3 right-3 flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/90 text-white shadow-md flex items-center gap-1 backdrop-blur-sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {value.mediaType === 'VIDEO' ? 'Video Uploaded' : 'Image Uploaded'}
            </span>
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="p-1.5 rounded-full bg-rose-600/90 text-white hover:bg-rose-500 transition-colors shadow-md backdrop-blur-sm"
                title="Remove Media"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
            disabled ? 'opacity-50 cursor-not-allowed border-slate-700 bg-slate-900/40' : 'border-slate-700 hover:border-violet-500 bg-slate-900/60 cursor-pointer hover:bg-slate-900/80'
          }`}
        >
          <input
            type="file"
            id="media-upload-input"
            accept=".jpg,.jpeg,.png,.webp,.mp4,.webm,.mov"
            onChange={handleFileChange}
            disabled={disabled || uploading}
            className="hidden"
          />

          <label htmlFor="media-upload-input" className="cursor-pointer block space-y-3">
            {uploading ? (
              <div className="flex flex-col items-center justify-center space-y-2 py-4">
                <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
                <p className="text-sm font-medium text-slate-300">Uploading media to Cloudinary...</p>
              </div>
            ) : (
              <>
                <div className="flex justify-center items-center gap-3">
                  <div className="p-3 rounded-full bg-violet-500/10 text-violet-400">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400">
                    <Film className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    Click to upload or drag & drop image or video
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Images: JPG, PNG, WEBP (Max 10MB) | Videos: MP4, WEBM, MOV (Max 100MB)
                  </p>
                </div>
              </>
            )}
          </label>
        </div>
      )}

      {error && (
        <p className="text-xs font-medium text-rose-400 bg-rose-950/30 border border-rose-900/50 rounded-lg p-2.5">
          {error}
        </p>
      )}
    </div>
  );
}
