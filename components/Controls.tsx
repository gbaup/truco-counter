"use client";

import { MinusIcon, PlusIcon, CloseIcon } from "@/components/ui/icons";

function triggerHaptic() {
  if (localStorage.getItem("prefs.haptics") === "false") return;
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(10);
  }
}

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
    <div className="flex gap-1.5 items-center px-3.5 pb-8 pt-3">
      {/* Team 1 (Nosotros) */}
      <div className="flex-1 flex gap-1.5 bg-surface rounded-xl border border-border p-1.5">
        <button
          onClick={() => onDecrement(1)}
          className="w-[42px] h-[42px] min-w-[42px] rounded-md border border-us/40 text-us flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Restar punto Nosotros"
        >
          <MinusIcon size={16} />
        </button>
        <div className="flex-1 grid place-items-center text-display-md font-display text-us">
          {score1}
        </div>
        <button
          onClick={() => { onIncrement(1); triggerHaptic(); }}
          className="w-[42px] h-[42px] min-w-[42px] rounded-md bg-us text-white flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Sumar punto Nosotros"
        >
          <PlusIcon size={16} />
        </button>
      </div>

      {/* Exit */}
      <button
        onClick={onExit}
        className="w-11 h-11 min-w-[44px] rounded-full bg-surface border border-border text-text-dim flex items-center justify-center active:scale-95 transition-transform"
        aria-label="Salir del partido"
      >
        <CloseIcon size={14} />
      </button>

      {/* Team 2 (Ellos) */}
      <div className="flex-1 flex gap-1.5 bg-surface rounded-xl border border-border p-1.5">
        <button
          onClick={() => onDecrement(2)}
          className="w-[42px] h-[42px] min-w-[42px] rounded-md border border-them/40 text-them flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Restar punto Ellos"
        >
          <MinusIcon size={16} />
        </button>
        <div className="flex-1 grid place-items-center text-display-md font-display text-them">
          {score2}
        </div>
        <button
          onClick={() => { onIncrement(2); triggerHaptic(); }}
          className="w-[42px] h-[42px] min-w-[42px] rounded-md bg-them text-paper-ink flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Sumar punto Ellos"
        >
          <PlusIcon size={16} />
        </button>
      </div>
    </div>
  );
}
