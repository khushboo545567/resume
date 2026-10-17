import axios from "axios";
import { create } from "zustand";

import type { AuthState } from "../types/auth.types";
import { getMe, logoutUser } from "../services/auth.service";
import { THRONE8_URL } from "../config/auth.config";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  isLoading: true,

  authError: false,

  setAuth: (user) => {
    set({
      user,
      isLoading: false,
      authError: false,
    });
  },

  logout: () => {
    set({
      user: null,
      isLoading: false,
      authError: false,
    });
  },

  signOut: async () => {
    try {
      await logoutUser();
    } catch {
      // Even if the call fails, leave: the next API call will show the real state.
    }

    set({ user: null, isLoading: false, authError: false });
    window.location.replace(`${THRONE8_URL}/login`);
  },

  setLoading: (loading) => {
    set({
      isLoading: loading,
    });
  },

  initializeAuth: async () => {
    // Also used by the "Try again" button, so reset the flags first.
    set({ isLoading: true, authError: false });

    try {
      const user = await getMe();

      set({
        user,
        isLoading: false,
        authError: false,
      });
    } catch (error) {
      // 401/403 = there really is no valid session -> logged out.
      // Anything else (network down, 5xx, timeout) is NOT a logout: keep the
      // user where they are and let the UI offer a retry.
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;
      const notLoggedIn = status === 400 || status === 401 || status === 403;

      set({
        user: null,
        isLoading: false,
        authError: !notLoggedIn,
      });
    }
  },
}));
