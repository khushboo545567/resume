export type UserRole = "user" | "admin";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  /** True until the first session check has finished (success or failure). */
  isLoading: boolean;
  /** True when the session check failed for a reason other than "not logged in" (network / server error). */
  authError: boolean;

  setAuth: (user: User) => void;
  /** Clears local state only (use signOut to end the shared Throne8 session). */
  logout: () => void;
  /** Ends the shared session on the backend, then sends the user back to Throne8. */
  signOut: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => Promise<void>;
}
