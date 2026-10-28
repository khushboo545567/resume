export type UserRole = "user" | "admin";

export type UserType = "student" | "working" | "fresher" | "unknown";

/** Extra details from Throne8's GET /auth/profile, shown in the profile popup. */
export interface UserProfile {
  firstName?: string;
  lastName?: string | null;
  phoneNumber?: string | null;
  location?: string | null;
  status?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  createdAt?: string;
  lastLoginAt?: string | null;
  userType?: UserType;
  student?: {
    collegeName?: string | null;
    degree?: string | null;
    fieldOfStudy?: string | null;
    graduationYear?: number | string | null;
  };
  working?: {
    jobTitle?: string | null;
    companyName?: string | null;
    startDate?: string | null;
    endDate?: string | null;
  };
  fresher?: {
    highestEducation?: string | null;
    preferredRole?: string | null;
    cgpa?: number | string | null;
  };
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: UserRole;
  /** Cloudinary URL of the Throne8 profile photo, or null when none / not loadable. */
  avatarUrl?: string | null;
  /** Used to load the photo in the background after the session check. */
  profilePhotoId?: string | null;
  /** Optional, so anything that only needs id/name/email/role is unaffected. */
  profile?: UserProfile;
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
