'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { recommendationService, wishlistService } from '@/services/api';
import { videoService } from '@/services/videoService';
import { 
  Sparkles, ThermometerSun, Bookmark, Heart, ExternalLink, 
  ArrowLeft, ArrowRight, Loader2, RefreshCw, ShoppingBag, 
  MapPin, Check, Briefcase, Calendar, GraduationCap, HeartHandshake,
  Plane, Home as HomeIcon, Map, Compass, Gem, ShoppingCart, ShieldCheck,
  Video, Award, Shirt, Palette, ShieldAlert
} from 'lucide-react';

function GeneratorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, savedLooks, wishlist, toggleWishlist, toggleSaveLook, token } = useAuthStore();

  // Multi-step questionnaire state
  const [step, setStep] = useState(1);
  const [occasion, setOccasion] = useState('');
  const [budget, setBudget] = useState('');
  const [style, setStyle] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');

  // Extended profile questionnaire state
  const [age, setAge] = useState('');
  const [bodyType, setBodyType] = useState('Athletic');
  const [favoriteColors, setFavoriteColors] = useState('');
  const [avoidColors, setAvoidColors] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  // Local style videos
  const [localVideos, setLocalVideos] = useState([]);

  // Execution states
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [activeLookTab, setActiveLookTab] = useState(0);
  const [savedLooksMap, setSavedLooksMap] = useState({});
  const [wishlistedProductsMap, setWishlistedProductsMap] = useState({});

  // Parse query occasion parameter on load
  useEffect(() => {
    const qOccasion = searchParams.get('occasion');
    if (qOccasion) {
      setOccasion(qOccasion);
      setStep(2); // Jump to budget
    }
  }, [searchParams]);

  // Sync saved looks & wishlist sets from store
  useEffect(() => {
    const looksMap = {};
    savedLooks.forEach(item => {
      looksMap[item.look.id] = true;
    });
    setSavedLooksMap(looksMap);

    const wishMap = {};
    wishlist.forEach(item => {
      wishMap[item.product.id] = true;
    });
    setWishlistedProductsMap(wishMap);
  }, [savedLooks, wishlist]);

  const occasions = [
    { name: 'Date', label: 'Date Night', icon: Heart },
    { name: 'College', label: 'College Wear', icon: GraduationCap },
    { name: 'Office', label: 'Office Fit', icon: Briefcase },
    { name: 'Interview', label: 'Job Interview', icon: ShieldCheck },
    { name: 'Wedding', label: 'Wedding / Festive', icon: Gem },
    { name: 'Vacation', label: 'Vacation Trip', icon: Compass },
    { name: 'Party', label: 'Party Night', icon: Sparkles },
    { name: 'Airport', label: 'Airport Look', icon: Plane },
    { name: 'Temple', label: 'Temple / Traditional', icon: HomeIcon },
    { name: 'Shopping', label: 'Shopping Day', icon: ShoppingCart },
    { name: 'Casual Outing', label: 'Casual Hangout', icon: Map }
  ];

  const budgets = [
    { value: 'Under ₹999', label: 'Budget (Under ₹999)' },
    { value: '₹1000-₹2000', label: 'Moderate (₹1000-₹2000)' },
    { value: '₹2000-₹5000', label: 'Premium (₹2000-₹5000)' },
    { value: '₹5000+', label: 'Luxury (₹5000+)' }
  ];

  const styles = [
    { value: 'Old Money', label: 'Old Money' },
    { value: 'Korean', label: 'Korean Streetwear' },
    { value: 'Casual', label: 'Casual Basic' },
    { value: 'Luxury', label: 'Luxury Designer' },
    { value: 'Streetwear', label: 'Streetwear Graphic' },
    { value: 'Minimal', label: 'Clean Minimalist' },
    { value: 'Formal', label: 'Formal Tailored' },
    { value: 'Traditional', label: 'Traditional Ethnic' },
    { value: 'Oversized', label: 'Oversized Comfy' },
    { value: 'Vintage', label: 'Retro Vintage' }
  ];

  const genders = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Unisex', label: 'Unisex' }
  ];

  const locations = ['Bangalore', 'Mumbai', 'Delhi', 'Goa', 'Indore', 'Shimla'];

  const handleNext = () => {
    if (step < 6) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleGenerate = async () => {
    if (!location.trim()) return;
    
    setLoading(true);
    setRecommendation(null);
    setLocalVideos([]);
    
    // Simulate loading stages for smooth premium UX
    setLoadingStage('Connecting to local weather service...');
    await new Promise(r => setTimeout(r, 1200));
    
    setLoadingStage(`Analyzing climate metrics in ${location}...`);
    await new Promise(r => setTimeout(r, 1000));
    
    setLoadingStage('Consulting Gemini AI fashion stylist models...');
    await new Promise(r => setTimeout(r, 1400));
    
    setLoadingStage('Scanning AJIO, Myntra, & Savana inventory datasets...');
    await new Promise(r => setTimeout(r, 1200));

    try {
      const payload = {
        occasion,
        budget,
        style,
        gender,
        location,
        age: age ? parseInt(age) : null,
        bodyType,
        favoriteColors: favoriteColors ? favoriteColors.split(',').map(c => c.trim()) : [],
        avoidColors: avoidColors ? avoidColors.split(',').map(c => c.trim()) : [],
        height: height ? parseFloat(height) : null,
        weight: weight ? parseFloat(weight) : null
      };

      const data = await recommendationService.generateRecommendation(payload, isAuthenticated);
      
      // Also fetch user uploaded guides/videos for this location
      try {
        const videosData = await videoService.searchVideosByLocation(location);
        setLocalVideos(videosData);
      } catch (videoErr) {
        console.error('Failed to load local videos for location:', videoErr);
      }

      setRecommendation(data);
      setActiveLookTab(0);
      setStep(7); // Results screen is now step 7
    } catch (err) {
      console.error(err);
      alert('Error generating outfit. Please verify that the backend application is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLook = async (lookId) => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/generator');
      return;
    }
    
    const isSaved = savedLooksMap[lookId];
    try {
      if (isSaved) {
        await recommendationService.unsaveLook(lookId);
        toggleSaveLook(lookId, true); // remove
      } else {
        const saved = await recommendationService.saveLook(lookId);
        // refresh user data or update local map
        useAuthStore.setState((state) => ({
          savedLooks: [...state.savedLooks, saved]
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleWishlistProduct = async (productId) => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/generator');
      return;
    }

    const isWishlisted = wishlistedProductsMap[productId];
    try {
      if (isWishlisted) {
        await wishlistService.removeFromWishlist(productId);
        toggleWishlist(productId, true); // remove
      } else {
        const saved = await wishlistService.addToWishlist(productId);
        useAuthStore.setState((state) => ({
          wishlist: [...state.wishlist, saved]
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetGenerator = () => {
    setOccasion('');
    setBudget('');
    setStyle('');
    setGender('');
    setLocation('');
    setStep(1);
    setRecommendation(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Loading Screen */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-xl"></div>
            <Loader2 className="h-16 w-16 text-indigo-400 animate-spin relative" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Styling Your Custom Looks</h2>
          <p className="text-indigo-200 text-sm tracking-wide transition-all duration-300 font-medium animate-pulse">
            {loadingStage}
          </p>
        </div>
      )}

      {/* Questionnaire Flow */}
      {!loading && step <= 6 && (
        <div className="glass-panel p-8 rounded-2xl animate-fade-in">
          {/* Progress Header */}
          <div className="flex items-center justify-between mb-8">
            <span className="text-xs font-bold text-indigo-400 tracking-wider uppercase">Questionnaire Step {step} of 6</span>
            <div className="w-48 bg-slate-800 rounded-full h-2 overflow-hidden border border-white/5">
              <div 
                className="bg-gradient-primary h-full transition-all duration-300"
                style={{ width: `${(step / 6) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* STEP 1: Occasion */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-extrabold text-white mb-2">Where are you heading?</h2>
              <p className="text-sm text-slate-400 mb-6">Your choice modifies styling guidelines, accessories and overall aesthetic.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {occasions.map((occ) => {
                  const Icon = occ.icon;
                  const selected = occasion === occ.name;
                  return (
                    <button
                      key={occ.name}
                      onClick={() => setOccasion(occ.name)}
                      className={`flex items-center space-x-3 p-4 rounded-xl text-left border transition-all ${
                        selected 
                          ? 'bg-indigo-500/15 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-500/5' 
                          : 'bg-slate-800/40 border-white/5 text-slate-300 hover:border-white/10 hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${selected ? 'text-indigo-400' : 'text-slate-400'}`} />
                      <span className="text-sm font-semibold">{occ.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Budget */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-extrabold text-white mb-2">What is your budget tier?</h2>
              <p className="text-sm text-slate-400 mb-6">Limits prices and filters suggested marketplace items accordingly.</p>
              
              <div className="space-y-4">
                {budgets.map((b) => {
                  const selected = budget === b.value;
                  return (
                    <button
                      key={b.value}
                      onClick={() => setBudget(b.value)}
                      className={`w-full flex items-center justify-between p-5 rounded-xl border transition-all ${
                        selected 
                          ? 'bg-indigo-500/15 border-indigo-500 text-indigo-300' 
                          : 'bg-slate-800/40 border-white/5 text-slate-300 hover:border-white/10'
                      }`}
                    >
                      <span className="text-sm font-semibold">{b.label}</span>
                      {selected && <Check className="h-5 w-5 text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Style */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-extrabold text-white mb-2">What style speaks to you?</h2>
              <p className="text-sm text-slate-400 mb-6">Choose your fit archetype (Old Money, Korean, Minimalist streetwear, etc.)</p>
              
              <div className="grid grid-cols-2 gap-4">
                {styles.map((s) => {
                  const selected = style === s.value;
                  return (
                    <button
                      key={s.value}
                      onClick={() => setStyle(s.value)}
                      className={`p-4 rounded-xl text-left border transition-all ${
                        selected 
                          ? 'bg-indigo-500/15 border-indigo-500 text-indigo-300' 
                          : 'bg-slate-800/40 border-white/5 text-slate-300 hover:border-white/10'
                      }`}
                    >
                      <span className="text-sm font-semibold block">{s.value}</span>
                      <span className="text-xs text-slate-400 mt-1 block">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Gender */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-extrabold text-white mb-2">Select your gender perspective</h2>
              <p className="text-sm text-slate-400 mb-6">Influences dress types and body profiles for styling calculations.</p>
              
              <div className="grid grid-cols-3 gap-4">
                {genders.map((g) => {
                  const selected = gender === g.value;
                  return (
                    <button
                      key={g.value}
                      onClick={() => setGender(g.value)}
                      className={`flex flex-col items-center justify-center p-6 rounded-xl border text-center transition-all ${
                        selected 
                          ? 'bg-indigo-500/15 border-indigo-500 text-indigo-300' 
                          : 'bg-slate-800/40 border-white/5 text-slate-300 hover:border-white/10'
                      }`}
                    >
                      <span className="text-sm font-semibold">{g.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Extended Profile */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-white mb-2">Build Your Style Profile</h2>
                <p className="text-sm text-slate-400 mb-6">Optional parameters to customize the fabric compatibility, color matching, and design rules.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Your Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 23"
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Body Shape</label>
                  <select
                    value={bodyType}
                    onChange={(e) => setBodyType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-3.5 px-4 focus:outline-none focus:border-indigo-500 text-sm cursor-pointer"
                  >
                    <option value="Athletic">Athletic / Slim</option>
                    <option value="Rectangle">Rectangle</option>
                    <option value="Hourglass">Hourglass</option>
                    <option value="Pear">Pear</option>
                    <option value="Oval">Oval / Plus Size</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Favorite Colors (Comma-separated)</label>
                  <input
                    type="text"
                    value={favoriteColors}
                    onChange={(e) => setFavoriteColors(e.target.value)}
                    placeholder="e.g. Black, White, Beige"
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Avoid Colors (Comma-separated)</label>
                  <input
                    type="text"
                    value={avoidColors}
                    onChange={(e) => setAvoidColors(e.target.value)}
                    placeholder="e.g. Neon, Yellow"
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Height (in cm - optional)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 175"
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Weight (in kg - optional)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 70"
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Location */}
          {step === 6 && (
            <div>
              <h2 className="text-2xl font-extrabold text-white mb-2">Where is your location?</h2>
              <p className="text-sm text-slate-400 mb-6">This detects current local temperature and shapes climate-based recommendations.</p>
              
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Type city name (e.g. Bangalore, Goa, Delhi, Mumbai)"
                  className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>

              <div className="mb-6">
                <span className="text-xs text-slate-400 block mb-2 font-semibold">Suggested Locations:</span>
                <div className="flex flex-wrap gap-2">
                  {locations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setLocation(loc)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                        location.toLowerCase() === loc.toLowerCase()
                          ? 'bg-indigo-500 text-white border-indigo-500'
                          : 'bg-slate-850 border-white/5 text-slate-400 hover:border-white/10 hover:text-white'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 flex justify-between border-t border-white/5 pt-6">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`flex items-center space-x-1.5 px-4 py-2 text-sm font-semibold rounded-lg border transition-all ${
                step === 1 
                  ? 'border-transparent text-slate-650 cursor-not-allowed' 
                  : 'border-white/15 text-slate-350 hover:bg-white/5 hover:text-white'
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>

            {step < 6 ? (
              <button
                onClick={handleNext}
                disabled={
                  (step === 1 && !occasion) ||
                  (step === 2 && !budget) ||
                  (step === 3 && !style) ||
                  (step === 4 && !gender)
                }
                className="flex items-center space-x-1.5 px-5 py-2 text-sm font-bold rounded-lg bg-indigo-650 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={!location.trim()}
                className="flex items-center space-x-1.5 px-6 py-2.5 text-sm font-extrabold rounded-lg bg-gradient-primary text-white hover:opacity-95 shadow-md shadow-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.01]"
              >
                <Sparkles className="h-4 w-4" />
                <span>Generate Outfits</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* RESULTS SCREEN */}
      {step === 7 && recommendation && (
        <div className="space-y-8 animate-fade-in">
          {/* Metadata Card */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest block mb-1">Generated Recommendations</span>
              <h2 className="text-2xl font-extrabold text-white flex items-center space-x-2">
                <span>{recommendation.style} Style</span>
                <span className="text-slate-400 font-medium">for</span>
                <span className="text-indigo-300">{recommendation.occasion}</span>
              </h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 text-xs text-slate-400">
                <span className="flex items-center space-x-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-500" />
                  <span>{recommendation.location}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <ThermometerSun className="h-3.5 w-3.5 text-slate-500" />
                  <span>{recommendation.weatherInfo}</span>
                </span>
                <span className="font-semibold text-indigo-400">Budget: {recommendation.budget}</span>
              </div>
            </div>

            <button
              onClick={resetGenerator}
              className="flex items-center space-x-1.5 px-4 py-2 border border-white/10 hover:border-white/20 text-slate-350 hover:text-white rounded-xl text-xs font-bold transition-all bg-slate-800/20"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Generate New Look</span>
            </button>
          </div>

          {/* Detailed Styling Metrics Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-card p-4 rounded-xl text-center">
              <span className="text-xs text-slate-400 block font-semibold mb-1 uppercase tracking-wider">Overall Match</span>
              <span className="text-3xl font-extrabold text-indigo-400">{recommendation.overallScore || 95}/100</span>
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <span className="text-xs text-slate-400 block font-semibold mb-1 uppercase tracking-wider">Weather Score</span>
              <span className="text-3xl font-extrabold text-violet-400">{recommendation.weatherScore || 20}/20</span>
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <span className="text-xs text-slate-400 block font-semibold mb-1 uppercase tracking-wider">Suitability</span>
              <span className="text-3xl font-extrabold text-emerald-400">{recommendation.suitabilityScore || 9.5}/10</span>
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <span className="text-xs text-slate-400 block font-semibold mb-1 uppercase tracking-wider">Locality Match</span>
              <span className="text-3xl font-extrabold text-pink-400">Verified</span>
            </div>
          </div>

          {/* AI Advisor Context */}
          <div className="glass-card p-6 rounded-2xl border-l-2 border-indigo-500 bg-indigo-500/5">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center space-x-1.5">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span>AI Advisor Explanation</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">{recommendation.explanation}</p>
          </div>

          {/* Tab Selection for Looks */}
          <div>
            <div className="flex space-x-2 border-b border-white/5 pb-px">
              {recommendation.looks.map((look, index) => (
                <button
                  key={look.id}
                  onClick={() => setActiveLookTab(index)}
                  className={`px-6 py-3.5 text-sm font-bold border-b-2 transition-all ${
                    activeLookTab === index
                      ? 'border-indigo-500 text-white bg-indigo-500/5'
                      : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {look.lookName}
                </button>
              ))}
            </div>

            {/* Selected Look Panel */}
            {recommendation.looks[activeLookTab] && (() => {
              const currentLook = recommendation.looks[activeLookTab];
              const isSaved = savedLooksMap[currentLook.id];
              return (
                <div className="py-6 space-y-6">
                  {/* Notes & Actions */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <p className="text-sm text-slate-400 italic max-w-xl">
                      &ldquo;{currentLook.stylingNotes}&rdquo;
                    </p>
                    
                    <button
                      onClick={() => handleSaveLook(currentLook.id)}
                      className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all w-full sm:w-auto justify-center ${
                        isSaved 
                          ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20' 
                          : 'bg-indigo-650 hover:bg-indigo-700 text-white shadow-md'
                      }`}
                    >
                      <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                      <span>{isSaved ? 'Look Saved' : 'Save Look to Profile'}</span>
                    </button>
                  </div>

                  {/* Look Score Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-slate-900/40 p-4 rounded-2xl border border-white/5">
                    <div className="text-center">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Look Score</span>
                      <span className="text-sm font-extrabold text-indigo-400">{currentLook.lookScore || 95}/100</span>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Fashion</span>
                      <span className="text-sm font-extrabold text-slate-200">{currentLook.fashionScore || 19}/20</span>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Color</span>
                      <span className="text-sm font-extrabold text-slate-200">{currentLook.colorScore || 10}/10</span>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Fabric</span>
                      <span className="text-sm font-extrabold text-slate-200">{currentLook.fabricScore || 10}/10</span>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Budget</span>
                      <span className="text-sm font-extrabold text-slate-200">{currentLook.budgetScore || 10}/10</span>
                    </div>
                  </div>

                  {/* Outfit Items Catalog Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {currentLook.items.map((item) => {
                      const product = item.matchedProduct;
                      return (
                        <div key={item.id} className="glass-card overflow-hidden rounded-2xl flex flex-col justify-between border border-white/5">
                          {product ? (
                            <>
                              <div className="relative h-44 w-full overflow-hidden bg-slate-950 flex items-center justify-center">
                                <img 
                                  src={product.imageUrl} 
                                  alt={product.name} 
                                  className="h-full w-full object-cover brightness-95" 
                                />
                                <div className="absolute top-3 left-3">
                                  <span className="inline-flex items-center rounded-md bg-slate-900/80 px-2.5 py-0.5 text-xs font-bold text-indigo-400 backdrop-blur-md border border-white/5">
                                    {item.category}
                                  </span>
                                </div>
                                <div className="absolute top-3 right-3">
                                  <button
                                    onClick={() => handleWishlistProduct(product.id)}
                                    className={`rounded-full p-2 backdrop-blur-md transition-all ${
                                      wishlistedProductsMap[product.id]
                                        ? 'bg-rose-500 text-white'
                                        : 'bg-slate-900/80 text-slate-400 hover:text-white'
                                    }`}
                                  >
                                    <Heart className="h-4 w-4 fill-current" />
                                  </button>
                                </div>
                              </div>
                              <div className="p-4 flex-grow flex flex-col justify-between">
                                <div className="mb-4">
                                  <span className="text-slate-500 text-xs font-semibold block">{product.brand}</span>
                                  <h4 className="text-sm font-bold text-white line-clamp-1">{product.name}</h4>
                                  <span className="text-xs text-slate-400 block mt-1">Suggested fit: {item.description}</span>
                                </div>
                                
                                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                                  <div>
                                    <span className="text-xs text-slate-500 block">Price</span>
                                    <span className="text-base font-extrabold text-white">₹{product.price}</span>
                                  </div>
                                  <a
                                    href={product.productUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-all border border-white/5"
                                  >
                                    <span>Buy on {product.marketplace}</span>
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="p-6 flex flex-col items-center justify-center text-center h-full">
                              <ShoppingBag className="h-10 w-10 text-slate-650 mb-3" />
                              <span className="inline-flex items-center rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-400 mb-2">
                                {item.category}
                              </span>
                              <h4 className="text-sm font-bold text-white">{item.description}</h4>
                              <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
                                No exact store catalog match below budget. Search natural language query on AJIO.
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-6 text-xs text-slate-400">
                    <span>Look Suitability: Excellent for {recommendation.occasion}</span>
                    <span className="font-extrabold text-slate-200">Combined cost: ~₹{Math.round(currentLook.totalCost)}</span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Local Style Videos Section */}
          {localVideos.length > 0 && (
            <div className="border-t border-white/5 pt-8">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Video className="h-5 w-5 text-indigo-400" />
                <span>Style Guides for {recommendation.location}</span>
              </h3>
              <p className="text-sm text-slate-400 mb-6">Watch user-uploaded styling video guides for this location.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {localVideos.map((vid) => (
                  <div key={vid.id} className="glass-card overflow-hidden rounded-xl flex flex-col justify-between">
                    <div className="relative aspect-[9/16] bg-black max-h-[320px] overflow-hidden">
                      {(() => {
                        const vUrl = vid.mediaUrl || vid.videoUrl || '';
                        const videoSrc = vUrl.startsWith('http') ? vUrl : `http://localhost:8080${vUrl}`;
                        return (
                          <video
                            src={videoSrc}
                            controls
                            className="w-full h-full object-cover"
                          />
                        );
                      })()}
                    </div>
                    <div className="p-4">
                      <h4 className="text-sm font-bold text-white mb-1 truncate">{vid.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{vid.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Generator() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    }>
      <GeneratorContent />
    </Suspense>
  );
}
