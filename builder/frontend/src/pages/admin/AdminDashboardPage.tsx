import { useNavigate } from "react-router-dom";
import { CalendarCheck2, ChevronRight } from "lucide-react";

import AdminStatCard from "../../features/admin/components/AdminStatCard";
import { useDashboardStats } from "../../features/admin/hooks/useDashboardStats";
import UserTable from "../../features/admin/components/UserTable";
import { useAdminBookings } from "../../features/booking/hooks/useBookings";

export default function AdminDashboardPage() {
  const { data, isLoading } = useDashboardStats();
  const navigate = useNavigate();
  const { data: bookings = [] } = useAdminBookings();

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  if (isLoading) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold text-heading">Admin Dashboard</h1>

      {/* Interview Session Requests quick access */}
      <button
        onClick={() => navigate("/admin/bookings")}
        className="flex w-full items-center justify-between rounded-2xl border border-border bg-navbar p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-btn-hover-bg">
            <CalendarCheck2 size={24} className="text-subheading" />
          </div>
          <div>
            <p className="font-semibold text-heading">
              Interview Session Requests
            </p>
            <p className="text-sm text-heading/60">
              {pendingCount > 0
                ? `${pendingCount} pending request${pendingCount === 1 ? "" : "s"} awaiting review`
                : "No pending requests"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <span className="rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
              {pendingCount}
            </span>
          )}
          <ChevronRight size={20} className="text-heading/40" />
        </div>
      </button>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard title="Users" value={data.totalUsers} />

        <AdminStatCard title="Resumes" value={data.totalResumes} />

        <AdminStatCard title="Shared" value={data.totalSharedResumes} />

        <AdminStatCard title="ATS Analyses" value={data.totalATSAnalyses} />

        <AdminStatCard title="AI Requests" value={data.totalAIRequests} />

        <AdminStatCard title="Downloads" value={data.totalDownloads} />

        <AdminStatCard title="Views" value={data.totalViews} />

        <AdminStatCard title="Shares" value={data.totalShares} />
      </div>

      {/* Users Table */}
      <div>
        <h2 className="mb-4 text-2xl font-bold text-heading">Users</h2>

        <UserTable />
      </div>
    </div>
  );
}
