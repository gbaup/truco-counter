interface ConfirmationExitModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationExitModal({
  onConfirm,
  onCancel,
}: ConfirmationExitModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-sm rounded-3xl bg-zinc-900 border border-white/10 p-8 text-center shadow-2xl">
        <h2 className="mb-2 text-2xl font-black text-white">
          ¿Salir del partido?
        </h2>
        <p className="mb-8 text-zinc-400">Se perderá el progreso actual.</p>
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 rounded-2xl bg-white/10 py-4 font-bold text-white transition-all hover:bg-white/20 active:scale-95"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-2xl bg-red-600 py-4 font-bold text-white transition-all hover:bg-red-700 active:scale-95"
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );
}
