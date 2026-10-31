import { useQuery } from "@tanstack/react-query";

import { CREDITS_QUERY_KEY } from "../../../api/axios";
import { useAuthStore } from "../../../store/auth.store";
import { getCredits } from "../services/payment.service";

/** The signed-in user's AI credit balances. Refreshed after every AI call and purchase. */
export function useCredits() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: CREDITS_QUERY_KEY,
    queryFn: getCredits,
    enabled: !!user,
  });
}
