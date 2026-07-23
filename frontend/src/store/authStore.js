import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  savedLooks: [],
  wishlist: [],
  history: [],

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('outfit_token', token);
        localStorage.setItem('outfit_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('outfit_token');
        localStorage.removeItem('outfit_user');
      }
    }
    set({ user, token, isAuthenticated: !!token });
  },

  initializeAuth: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('outfit_token');
      const userStr = localStorage.getItem('outfit_user');
      if (token && userStr) {
        set({ 
          token, 
          user: JSON.parse(userStr), 
          isAuthenticated: true 
        });
      }
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('outfit_token');
      localStorage.removeItem('outfit_user');
    }
    set({ user: null, token: null, isAuthenticated: false, savedLooks: [], wishlist: [], history: [] });
  },

  setUserPreferences: (preferences) => {
    set((state) => ({
      user: state.user ? { ...state.user, preferences } : null
    }));
    if (typeof window !== 'undefined' && get().user) {
      localStorage.setItem('outfit_user', JSON.stringify(get().user));
    }
  },

  setSavedLooks: (savedLooks) => set({ savedLooks }),
  setWishlist: (wishlist) => set({ wishlist }),
  setHistory: (history) => set({ history }),
  
  toggleWishlist: (productId, isWishlisted) => {
    set((state) => {
      if (isWishlisted) {
        return { wishlist: state.wishlist.filter(item => item.product.id !== productId) };
      }
      return state;
    });
  },

  toggleSaveLook: (lookId, isSaved) => {
    set((state) => {
      if (isSaved) {
        return { savedLooks: state.savedLooks.filter(item => item.look.id !== lookId) };
      }
      return state;
    });
  }
}));
