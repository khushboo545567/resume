import { Navigate } from "react-router-dom";

import { useAuthStore } from "../store/auth.store";
import RequireUser from "./RequireUser";

import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AdminProtectedRoute({ children }: Props) {
  const user = useAuthStore((state) => state.user);

  return (
    <RequireUser>
      {user && user.role !== "admin" ? (
        <Navigate to="/404" replace />
      ) : (
        children
      )}
    </RequireUser>
  );
}
