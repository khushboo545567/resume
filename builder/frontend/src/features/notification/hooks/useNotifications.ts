import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../../store/auth.store";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "../services/notification.service";

export const useNotifications = () => {
  const isLoggedIn = useAuthStore((state) => !!state.user);

  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(),
    enabled: isLoggedIn,
  });
};

export const useUnreadCount = () => {
  const isLoggedIn = useAuthStore((state) => !!state.user);

  return useQuery({
    queryKey: ["notifications", "unreadCount"],
    queryFn: getUnreadCount,
    enabled: isLoggedIn,
    refetchInterval: 30000, // Poll every 30 seconds
    refetchOnWindowFocus: true,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unreadCount"],
      });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unreadCount"],
      });
    },
  });
};
