import { useQuery } from "@tanstack/react-query";

import { getDashboard } from "../services/dashboard.service";

import type { DashboardResponse } from "../types/dashboard.types";

export function useDashboard() {
  return useQuery<DashboardResponse>({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });
}