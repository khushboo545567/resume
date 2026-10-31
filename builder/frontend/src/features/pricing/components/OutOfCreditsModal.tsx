import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import { CREDITS_REQUIRED_EVENT } from "../../../api/axios";
import type { CreditsRequiredDetail } from "../../../api/axios";

/**
 * Mounted once for the whole app. Any AI request the server answers with 402
 * ("no credits left") opens this prompt, so every AI button gets it without
 * its own handling.
 */
export default function OutOfCreditsModal() {
  const navigate = useNavigate();
  const [detail, setDetail] = useState<CreditsRequiredDetail | null>(null);

  useEffect(() => {
    const onRequired = (event: Event) => {
      setDetail((event as CustomEvent<CreditsRequiredDetail>).detail);
    };

    window.addEventListener(CREDITS_REQUIRED_EVENT, onRequired);
    return () => window.removeEventListener(CREDITS_REQUIRED_EVENT, onRequired);
  }, []);

  if (!detail) return null;

  const close = () => setDetail(null);

  const openPricing = () => {
    const params = new URLSearchParams({ tab: detail.tab });
    if (detail.questions) params.set("questions", String(detail.questions));

    close();
    navigate(`/pricing?${params.toString()}`);
  };

  return (
    <Modal
      open
      onClose={close}
      size="sm"
      title="You're out of AI credits"
    >
      <div className="flex items-start gap-3">
        <Lock size={20} className="mt-0.5 shrink-0 text-heading" />
        <p className="text-sm text-nav-text">{detail.message}</p>
      </div>

      <p className="mt-3 text-sm text-nav-text">
        One-time payment, no subscription. Credits never expire.
      </p>

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={close}>
          Not now
        </Button>
        <Button onClick={openPricing}>View plans</Button>
      </div>
    </Modal>
  );
}
