import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FileUp } from "lucide-react";

import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

import { uploadAndParseResume } from "../services/resume.service";
import { isOutOfCreditsError } from "../../../api/axios";
import { UploadCreditsHint } from "../../pricing/components/CreditHints";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AnalyseATSScoreModal({ open, onClose }: Props) {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetAndClose = () => {
    if (loading) return;
    setFile(null);
    setError("");
    onClose();
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!file) {
      setError("Please choose a PDF resume to upload.");
      return;
    }

    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setError("Only PDF files are allowed.");
      return;
    }

    try {
      setLoading(true);

      const resume = await uploadAndParseResume(file);

      setFile(null);
      onClose();
      navigate(`/resume/${resume._id}/edit`);
    } catch (err) {
      // No credits: the app-wide "buy credits" prompt is already showing.
      if (isOutOfCreditsError(err)) return;

      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message;
        setError(
          typeof message === "string" && message.trim()
            ? message
            : "Failed to parse this resume. Please try a different PDF.",
        );
        return;
      }

      setError("Failed to parse this resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={resetAndClose}
      title="Analyse ATS Score"
      description="Upload an existing PDF resume. We'll parse it into the editor so you can review it before running ATS."
      size="md"
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <Input
          label="Resume PDF"
          required
          type="file"
          accept=".pdf,application/pdf"
          leftIcon={<FileUp size={18} />}
          error={error}
          disabled={loading}
          onChange={(event) => {
            setError("");
            setFile(event.target.files?.[0] ?? null);
          }}
        />

        {loading && (
          <p className="text-sm text-nav-text">Parsing your resume...</p>
        )}

        <UploadCreditsHint />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={resetAndClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={loading}>
            {loading ? "Parsing your resume..." : "Upload & Analyse"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
