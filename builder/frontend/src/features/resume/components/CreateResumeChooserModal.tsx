import type { ReactNode } from "react";
import { ChevronRight, LayoutTemplate, Loader2, PenLine, Upload } from "lucide-react";

import Modal from "../../../components/ui/Modal";

interface Props {
  open: boolean;
  onClose: () => void;
  onChooseTemplate: () => void;
  onImport: () => void;
  onQuickStart: () => void;
  quickStartLoading?: boolean;
}

interface OptionProps {
  icon: ReactNode;
  title: string;
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

function Option({ icon, title, text, onClick, disabled }: OptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group flex w-full items-center gap-4 rounded-2xl border border-border-popup bg-navbar p-4 text-left transition hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sidebar to-btn text-gold-soft shadow-md">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-bold text-heading">{title}</p>
        <p className="mt-0.5 text-sm text-nav-text">{text}</p>
      </div>

      <ChevronRight
        size={20}
        className="shrink-0 text-heading/40 transition group-hover:translate-x-1 group-hover:text-heading"
      />
    </button>
  );
}

/** "How do you want to start?" chooser opened by every Create Resume button. */
export default function CreateResumeChooserModal({
  open,
  onClose,
  onChooseTemplate,
  onImport,
  onQuickStart,
  quickStartLoading = false,
}: Props) {
  return (
    <Modal
      open={open}
      onClose={quickStartLoading ? () => {} : onClose}
      title="Create a resume"
      description="How would you like to start?"
      size="md"
    >
      <div className="space-y-3">
        <Option
          icon={<LayoutTemplate size={22} />}
          title="Start from a template"
          text="Pick a design, then fill in your details."
          onClick={onChooseTemplate}
          disabled={quickStartLoading}
        />

        <Option
          icon={<Upload size={22} />}
          title="Import an existing resume"
          text="Upload your PDF and we'll rebuild it in a new design."
          onClick={onImport}
          disabled={quickStartLoading}
        />

        <Option
          icon={
            quickStartLoading ? (
              <Loader2 size={22} className="animate-spin" />
            ) : (
              <PenLine size={22} />
            )
          }
          title={quickStartLoading ? "Preparing your resume..." : "Start blank"}
          text="Open an empty ATS-friendly resume and start typing."
          onClick={onQuickStart}
          disabled={quickStartLoading}
        />
      </div>
    </Modal>
  );
}
