import { create } from "zustand";

interface NavProgressState {
  /** Path the user just clicked in the sidebar and that has not finished loading yet. */
  pendingPath: string | null;
  start: (path: string) => void;
  clear: () => void;
}

export const useNavProgress = create<NavProgressState>((set) => ({
  pendingPath: null,
  start: (path) => set({ pendingPath: path }),
  clear: () => set({ pendingPath: null }),
}));
