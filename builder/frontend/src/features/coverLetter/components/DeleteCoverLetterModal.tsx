import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";

interface Props {
  open: boolean;
  title: string;
  loading: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteCoverLetterModal({
  open,
  title,
  loading,
  onClose,
  onDelete,
}: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Delete Cover Letter">
      <div className="space-y-6">
        <p className="text-nav-text">Are you sure you want to delete</p>

        <div className="rounded-xl bg-red-600/10 p-4">
          <h3 className="font-bold text-heading">{title}</h3>

          <p className="mt-2 text-sm text-red-600">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={onDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete Cover Letter"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
