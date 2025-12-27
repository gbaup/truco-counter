interface ControlsProps {
  onIncrement: (team: 1 | 2) => void;
  onDecrement: (team: 1 | 2) => void;
  onExit: () => void;
  score1: number;
  score2: number;
}

export default function Controls({
  onIncrement,
  onDecrement,
  onExit,
  score1,
  score2,
}: ControlsProps) {
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-white/10 bg-zinc-950/80 p-4 backdrop-blur-lg">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <div className="flex flex-1 items-center justify-center gap-4">
          <button
            onClick={() => onDecrement(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl font-bold text-blue-500 transition-all active:scale-90"
          >
            -
          </button>
          <div className="flex flex-col items-center">
            <span className="text-xl font-black text-blue-500">{score1}</span>
          </div>
          <button
            onClick={() => onIncrement(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-xl font-bold text-white shadow-lg transition-all active:scale-110"
          >
            +
          </button>
        </div>

        <button
          onClick={onExit}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-lg transition-all active:scale-110"
        >
          X
        </button>

        <div className="flex flex-1 items-center justify-center gap-4">
          <button
            onClick={() => onDecrement(2)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl font-bold text-green-500 transition-all active:scale-90"
          >
            -
          </button>
          <div className="flex flex-col items-center">
            <span className="text-xl font-black text-green-500">{score2}</span>
          </div>
          <button
            onClick={() => onIncrement(2)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-xl font-bold text-white shadow-lg transition-all active:scale-110"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
