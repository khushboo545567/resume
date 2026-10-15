import { authApi } from "../api/axios";
import type { User } from "../types/auth.types";

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
  };
};

/** Ends the session for BOTH apps (the cookies are shared). */
export const logoutUser = async (): Promise<void> => {
  await authApi.post("/auth/logout");
};
