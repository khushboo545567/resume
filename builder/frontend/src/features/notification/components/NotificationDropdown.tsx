import { useState, useRef, useEffect } from "react";
import { Bell, Check, CalendarCheck, CalendarX, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useNotifications,
  useUnreadCount,
  useMarkAsRead,
  useMarkAllAsRead,
} from "../hooks/useNotifications";
import type { INotification } from "../types/notification.types";

const NotificationIcon = ({ type }: { type: INotification["type"] }) => {
  switch (type) {
    case "booking_confirmed":
      return <CalendarCheck size={18} className="text-green-700" />;
    case "booking_completed":
      return <Check size={18} className="text-subheading" />;
    case "booking_cancelled":
      return <CalendarX size={18} className="text-red-600" />;
    default:
      return <Info size={18} className="text-nav-text" />;
  }
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString();
};

export default function NotificationDropdown() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: notifications = [], isLoading } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadCount();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: INotification) => {
    if (!notification.read) {
      markAsRead.mutate(notification._id);
    }
    setIsOpen(false);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAllAsRead.mutate();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
        }
        aria-expanded={isOpen}
        className="relative rounded-xl p-3 transition hover:bg-navbar-hover focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white shadow-sm">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-2xl border border-border-popup bg-navbar shadow-xl focus:outline-none sm:w-96">
          <div className="flex items-center justify-between border-b border-border-popup px-4 py-3">
            <h3 className="font-semibold text-heading">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={markAllAsRead.isPending}
                className="text-xs font-medium text-subheading hover:underline disabled:opacity-50"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-sm text-heading/60">
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-heading/60">
                No notifications yet
              </div>
            ) : (
              <div className="divide-y divide-border-navbar">
                {notifications.map((notification) => (
                  <button
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`flex w-full items-start gap-3 p-4 text-left transition hover:bg-btn/5 ${
                      !notification.read ? "bg-btn/10" : ""
                    }`}
                  >
                    <div className="mt-1 shrink-0">
                      <NotificationIcon type={notification.type} />
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-sm ${
                          !notification.read
                            ? "font-semibold text-heading"
                            : "font-medium text-heading/80"
                        }`}
                      >
                        {notification.title}
                      </p>
                      <p className="mt-0.5 text-sm text-nav-text line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-xs text-heading/50">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.read && (
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-btn" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
