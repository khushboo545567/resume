// UserDetailsModal.tsx
interface Props {
  open: boolean;
  onClose: () => void;
  data: any;
}

export default function UserDetailsModal({ open, onClose, data }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-heading/60">
      <div className="w-[500px] rounded-xl bg-navbar p-6 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-heading">User Details</h2>

        <div className="space-y-3 text-heading">
          <p>
            <b>Name:</b> {data?.user?.fullName}
          </p>

          <p>
            <b>Email:</b> {data?.user?.email}
          </p>

          <p>
            <b>Role:</b> {data?.user?.role}
          </p>

          <p>
            <b>Status:</b> {data?.user?.status}
          </p>

          <hr className="border-border-popup" />

          <p>
            <b>Resumes:</b> {data?.stats?.resumes}
          </p>

          <p>
            <b>AI Requests:</b> {data?.stats?.aiRequests}
          </p>

          <p>
            <b>ATS Analyses:</b> {data?.stats?.atsAnalyses}
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-8 rounded bg-btn px-5 py-2 text-btn-text hover:bg-btn-hover"
        >
          Close
        </button>
      </div>
    </div>
  );
}
