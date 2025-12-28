interface WinnerModalProps {
  winner: string | null;
  onFinish: () => void;
}

export default function WinnerModal({ winner, onFinish }: WinnerModalProps) {
  if (!winner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-sm rounded-3xl bg-zinc-900 border border-white/10 p-8 text-center shadow-2xl">
        <div className="mb-4 text-6xl">🏆</div>
        <h2 className="mb-2 text-3xl font-black text-white">¡Ganó {winner}!</h2>
        <p className="mb-8 text-zinc-400">Tremendo partido. ¿Revancha?</p>
        <button
          onClick={onFinish}
          className="w-full rounded-2xl bg-primary-600 py-4 font-bold text-white transition-all hover:bg-primary-700 active:scale-95"
        >
          Terminar y Salir
        </button>
      </div>
    </div>
  );
}
