'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authService, recommendationService } from '@/services/api';
import { User, Settings, History, Calendar, ThermometerSun, MapPin, Sparkles, Loader2, Check } from 'lucide-react';

export default function Profile() {
  const router = useRouter();
  const { user, token, setUserPreferences, setHistory, history, initializeAuth } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Preference edit states
  const [gender, setGender] = useState('Unisex');
  const [style, setStyle] = useState('Casual');
  const [budget, setBudget] = useState('₹1000-₹2000');

  useEffect(() => {
    initializeAuth();
    if (!token) {
      router.push('/login?redirect=/profile');
      return;
    }

    const fetchProfileData = async () => {
      try {
        const profile = await authService.getProfile();
        if (profile.preferences) {
          setGender(profile.preferences.preferredGender || 'Unisex');
          setStyle(profile.preferences.preferredStyle || 'Casual');
          setBudget(profile.preferences.budgetBracket || '₹1000-₹2000');
          setUserPreferences(profile.preferences);
        }
        
        const histData = await recommendationService.getHistory();
        setHistory(histData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [token, router, setUserPreferences, setHistory]);

  const handleUpdatePreferences = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setSuccessMsg('');

    try {
      const data = await authService.updatePreferences(gender, style, budget);
      setUserPreferences(data);
      setSuccessMsg('Style preferences updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to update preferences.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  const budgetOptions = ['Under ₹999', '₹1000-₹2000', '₹2000-₹5000', '₹5000+'];
  const styleOptions = ['Old Money', 'Korean', 'Casual', 'Luxury', 'Streetwear', 'Minimal', 'Formal', 'Traditional', 'Oversized', 'Vintage'];
  const genderOptions = ['Male', 'Female', 'Unisex'];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Welcome Header */}
      <div className="flex items-center space-x-4 mb-10">
        <div className="rounded-2xl bg-gradient-primary p-3.5 text-white shadow-lg shadow-indigo-500/20">
          <User className="h-8 w-8" />
        </div>
        <div>
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Account Profile</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">{user?.name || 'My Profile'}</h1>
          <p className="text-sm text-slate-400 mt-1">{user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Style Preferences Column */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6 h-fit">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2 pb-3 border-b border-white/5">
            <Settings className="h-5 w-5 text-indigo-400" />
            <span>Default Style Preferences</span>
          </h2>

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center space-x-1.5 animate-pulse">
              <Check className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePreferences} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-450 mb-2">Gender Archetype</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="block w-full py-2.5 px-3 border border-white/10 rounded-xl bg-slate-900/60 text-slate-350 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
              >
                {genderOptions.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-455 mb-2">Style Fit</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="block w-full py-2.5 px-3 border border-white/10 rounded-xl bg-slate-900/60 text-slate-350 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
              >
                {styleOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-460 mb-2">Budget Preference</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="block w-full py-2.5 px-3 border border-white/10 rounded-xl bg-slate-900/60 text-slate-350 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
              >
                {budgetOptions.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full py-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-750 text-white font-extrabold text-xs tracking-wider uppercase shadow-md transition-all flex items-center justify-center cursor-pointer"
            >
              {updating && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
              <span>Save Preferences</span>
            </button>
          </form>
        </div>

        {/* History Column */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2 pb-3 border-b border-white/5">
            <History className="h-5 w-5 text-indigo-400" />
            <span>Outfit Recommendation History</span>
          </h2>

          {history.length === 0 ? (
            <div className="glass-panel p-8 rounded-2xl text-center text-slate-500 text-sm">
              You haven&apos;t generated any outfits yet. Start using the generator tool to log history!
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((rec) => (
                <div key={rec.id} className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-white/15 transition-all">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-white">{rec.occasion} Outfit</span>
                      <span className="text-xs bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20 font-semibold">{rec.style}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-slate-400">
                      <span className="flex items-center space-x-0.5">
                        <MapPin className="h-3 w-3" />
                        <span>{rec.location}</span>
                      </span>
                      <span className="flex items-center space-x-0.5">
                        <ThermometerSun className="h-3 w-3" />
                        <span>{rec.weatherInfo}</span>
                      </span>
                      <span>Budget: {rec.budget}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">Match Score</span>
                      <span className="text-sm font-extrabold text-indigo-300">{rec.suitabilityScore}/10</span>
                    </div>
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] text-slate-500 block">Generated</span>
                      <span className="text-xs text-slate-400">
                        {new Date(rec.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
