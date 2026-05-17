import { useTranslation } from "react-i18next";

interface ConfirmationExitModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationExitModal({ onConfirm, onCancel }: ConfirmationExitModalProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-sm rounded-[22px] bg-surface border border-border p-8 text-center shadow-hero">
        <h2
          className="mb-2 text-2xl font-black text-text"
          style={{ fontFamily: "var(--font-crimson-pro), serif" }}
        >
          {t("confirmationExitModal.title")}
        </h2>
        <p
          className="mb-8 text-caption-italic text-text-dim"
          style={{ fontFamily: "var(--font-crimson-pro), serif" }}
        >
          {t("confirmationExitModal.description")}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl bg-surface-elevated border border-border py-4 font-bold text-text transition-all hover:bg-border active:scale-95"
          >
            {t("confirmationExitModal.cancel")}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-danger py-4 font-bold text-white transition-all hover:bg-danger/90 active:scale-95"
          >
            {t("confirmationExitModal.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
