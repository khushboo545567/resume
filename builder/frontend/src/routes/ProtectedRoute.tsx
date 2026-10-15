// ============ PROTECTED ROUTE: ONLY CHECKS THAT THE USER HAS A VALID THRONE8 SESSION. FOR ADMIN PAGES USE AdminProtectedRoute ============

import type { ReactNode } from "react";

import RequireUser from "./RequireUser";

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  return <RequireUser>{children}</RequireUser>;
}
