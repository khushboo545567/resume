import { authApi } from "../api/axios";
import type { User, UserProfile } from "../types/auth.types";

// Login / register / password flows live in Throne8 — this app only reads the shared session.

/**
 * Current user from Throne8 (GET /api/v1/auth/profile), mapped to this app's User shape.
 * Throws a 401 when there is no valid session.
 */
export const getMe = async (): Promise<User> => {
  const response = await authApi.get("/auth/profile");
  const profile = response.data?.data ?? response.data;

  const fullName = [profile.firstName, profile.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    _id: profile.userId,
    fullName: fullName || profile.email,
    email: profile.email,
    // Throne8 also has "moderator" / "mentor"; this app only distinguishes admins.
    role: profile.role === "admin" ? "admin" : "user",
    profile: mapProfileDetails(profile),
  };
};

// Location may come back as a plain string or as an object (city/state/country).
const formatLocation = (location: unknown): string | null => {
  if (!location) return null;
  if (typeof location === "string") return location.trim() || null;
  if (typeof location === "object") {
    const text = Object.values(location as Record<string, unknown>)
      .filter((v): v is string => typeof v === "string" && v.trim() !== "")
      .join(", ");
    return text || null;
  }
  return null;
};

// The parts of Throne8's profile response that this app reads.
interface RawProfile {
  firstName?: string;
  lastName?: string | null;
  phoneNumber?: string | null;
  location?: unknown;
  status?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  createdAt?: string;
  metadata?: { lastLoginAt?: string | null };
  onboarding?: {
    userType?: UserProfile["userType"];
    studentProfile?: UserProfile["student"];
    workingProfile?: UserProfile["working"];
    fresherProfile?: UserProfile["fresher"];
  };
}

const mapProfileDetails = (profile: RawProfile): UserProfile => {
  const onboarding = profile.onboarding ?? {};

  return {
    firstName: profile.firstName,
    lastName: profile.lastName ?? null,
    phoneNumber: profile.phoneNumber ?? null,
    location: formatLocation(profile.location),
    status: profile.status,
    emailVerified: profile.emailVerified,
    phoneVerified: profile.phoneVerified,
    createdAt: profile.createdAt,
    lastLoginAt: profile.metadata?.lastLoginAt ?? null,
    userType: onboarding.userType ?? "unknown",
    student: onboarding.studentProfile,
    working: onboarding.workingProfile,
    fresher: onboarding.fresherProfile,
  };
};

/** Ends the session for BOTH apps (the cookies are shared). */
export const logoutUser = async (): Promise<void> => {
  await authApi.post("/auth/logout");
};
