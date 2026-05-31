"use client";

import Suit from "@/components/ui/Suit";
import RelatoRow from "@/components/live/RelatoRow";
import { Mano } from "@/hooks/usePointLog";
import { useTick } from "@/lib/timeAgo";

/**
 * RelatoSheet — bottom sheet con el relato del partido, mano por mano.
 *
 * Patrón = el Bottom Sheet del design system (ver DESIGN.md § Bottom
 * Sheet): backdrop blur, esquinas superiores rounded-2xl, grabber.
 * El contador queda atenuado detrás.
 *
 * El header de columnas ("Nosotros / la mano / Ellos") ancla qué lado
 * es cada equipo, así los renglones pueden ir sin repetir el nombre.
 */

type TimeStyle = "rel" | "hora";

interface RelatoSheetProps {
  open: boolean;
  onClose: () => void;
  manos: Mano[];
  pending?: { us: number; them: number; ts: number } | null;
  live?: boolean; // hay partido en curso → mostrar dot "en vivo"
  timeStyle?: TimeStyle;
}

function ColumnHead() {
  return (
    <div className="flex items-center pb-2 px-0.5 border-b border-border mb-0.5">
      <div className="flex-1 flex items-center gap-1.5">
        <Suit kind="espada" size={10} className="text-us" />
        <span className="font-serif italic font-bold text-[13px] text-us">
          Nosotros
        </span>
      </div>
      <div className="shrink-0 w-[86px] text-center text-[9px] tracking-[0.14em] uppercase text-text-mute">
        la mano
      </div>
      <div className="flex-1 flex items-center justify-end gap-1.5">
        <span className="font-serif italic font-bold text-[13px] text-them">
          Ellos
        </span>
        <Suit kind="basto" size={10} className="text-them" />
      </div>
    </div>
  );
}

export default function RelatoSheet({
  open,
  onClose,
  manos,
  pending = null,
  live = false,
  timeStyle = "rel",
}: RelatoSheetProps) {
  useTick(15000); // refresca los "hace …"

  const empty = manos.length === 0 && !pending;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-background/55 backdrop-blur-sm transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-label="El relato del partido"
        className={`fixed inset-x-0 bottom-0 z-50 flex flex-col overflow-hidden rounded-t-2xl border-t border-border bg-surface shadow-[0_-20px_40px_rgba(0,0,0,0.45)] transition-transform duration-[240ms] ease-[cubic-bezier(0.2,0.9,0.3,1)] ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: "64dvh" }}
      >
        <div className="flex justify-center pt-2">
          <div className="h-1 w-9 rounded-full bg-border" />
        </div>

        <div className="flex items-center justify-between px-[18px] pt-2 pb-2">
          <div>
            <h2 className="font-serif italic font-bold text-lg text-text">
              el relato
            </h2>
            <p className="mt-px text-[10.5px] tracking-[0.04em] text-text-mute">
              mano por mano, cómo se fue dando
            </p>
          </div>
          {live && (
            <span className="flex items-center gap-1.5 font-serif italic text-[11px] text-them">
              <span className="w-[7px] h-[7px] rounded-full bg-them animate-pulse" />
              en vivo
            </span>
          )}
        </div>

        <div
          className="flex-1 overflow-y-auto px-[18px] pb-[18px]"
          style={{
            WebkitMaskImage: "linear-gradient(180deg,#000 92%,transparent)",
          }}
        >
          {empty ? (
            <p className="pt-10 text-center font-serif italic text-text-mute">
              todavía no hay manos anotadas
            </p>
          ) : (
            <>
              <ColumnHead />
              {pending && (
                <RelatoRow mano={pending} pending timeStyle={timeStyle} />
              )}
              {manos.map((m, i) => (
                <RelatoRow
                  key={m.id}
                  mano={m}
                  timeStyle={timeStyle}
                  last={i === manos.length - 1}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
