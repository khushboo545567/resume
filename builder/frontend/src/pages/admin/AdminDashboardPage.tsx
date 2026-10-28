import AdminStatCard from "../../features/admin/components/AdminStatCard";
import { useDashboardStats } from "../../features/admin/hooks/useDashboardStats";
import UserTable from "../../features/admin/components/UserTable";

export default function AdminDashboardPage() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold text-heading">Admin Dashboard</h1>

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
