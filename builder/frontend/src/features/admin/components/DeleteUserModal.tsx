// DeleteUserModal.tsx
interface Props {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteUserModal({ open, onClose, onDelete }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-heading/60">
      <div className="w-[420px] rounded-xl bg-navbar p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-heading">Delete User</h2>

        <p className="mt-4 text-nav-text">
          Are you sure you want to delete this user?
        </p>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-border-popup px-5 py-2 text-heading transition hover:bg-btn-hover-bg"
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            className="rounded-lg bg-red-600 px-5 py-2 text-white transition hover:opacity-90"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
