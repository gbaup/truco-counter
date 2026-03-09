import { useTranslation } from "react-i18next";
import { Button } from "./ui/Button";

interface WinnerModalProps {
  winner: string | null;
  onFinish: () => void;
  isLoading?: boolean;
}

export default function WinnerModal({ winner, onFinish, isLoading }: WinnerModalProps) {
  const { t } = useTranslation();

  if (!winner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-sm rounded-3xl bg-zinc-900 border border-white/10 p-8 text-center shadow-2xl">
        <div className="mb-4 text-6xl">🏆</div>
        <h2 className="mb-2 text-3xl font-black text-white">{t("winnerModal.title", { winner })}</h2>
        <p className="mb-8 text-zinc-400">{t("winnerModal.description")}</p>
        <Button onClick={onFinish} disabled={isLoading}>
          {isLoading ? t("winnerModal.button.loading") : t("winnerModal.button.confirm")}
        </Button>
      </div>
    </div>
  );
}
