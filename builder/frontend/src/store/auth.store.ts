import { create } from "zustand";

import type { AuthState } from "../types/auth.types";
import { getMe, logoutUser } from "../services/auth.service";
import { THRONE8_URL } from "../config/auth.config";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  isLoading: true,

  setAuth: (user) => {
    set({
      user,
      isLoading: false,
    });
  },

  logout: () => {
    set({
      user: null,
      isLoading: false,
    });
  },

  signOut: async () => {
    try {
      await logoutUser();
    } catch {
      // Even if the call fails, leave: the next API call will show the real state.
    }

    set({ user: null, isLoading: false });
    window.location.replace(`${THRONE8_URL}/login`);
  },

  setLoading: (loading) => {
    set({
      isLoading: loading,
    });
  },

  initializeAuth: async () => {
    try {
      const user = await getMe();

      set({
        user,
        isLoading: false,
      });
    } catch {
      set({
        user: null,
        isLoading: false,
      });
    }
  },
}));
