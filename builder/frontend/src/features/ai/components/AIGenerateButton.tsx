import { Sparkles } from "lucide-react";

import Button from "../../../components/ui/Button";

interface Props {
  loading?: boolean;
  disabled?: boolean;
  onClick: () => void;
  label?: string;
  loadingLabel?: string;
}

/** The one "✨ AI" action button used by every editor form. */
export default function AIGenerateButton({
  loading,
  disabled,
  onClick,
  label = "Generate with AI",
  loadingLabel = "Generating...",
}: Props) {
  return (
    <Button
      type="button"
      size="sm"
      onClick={onClick}
      disabled={loading || disabled}
      leftIcon={<Sparkles size={16} />}
    >
      {loading ? loadingLabel : label}
    </Button>
  );
}
