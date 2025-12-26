import { User } from "@/types/database";
import TallyMarks from "@/components/TallyMarks";

interface TeamCounterProps {
  title: string;
  players: User[];
  totalScore: number;
  malas: number;
  buenas: number;
  variant: "blue" | "green";
  badgePosition: "left" | "right";
}

export default function TeamCounter({
  title,
  players,
  totalScore,
  malas,
  buenas,
  variant,
  badgePosition,
}: TeamCounterProps) {
  const isBlue = variant === "blue";

  const bgUserColor = isBlue
    ? "bg-blue-600/10 dark:bg-blue-900/20"
    : "bg-green-600/10 dark:bg-green-900/20";
  const titleColor = isBlue ? "text-blue-500" : "text-green-500";

  const chipBgColor = isBlue ? "bg-blue-500/20" : "bg-green-500/20";
  const chipTextColor = isBlue ? "text-blue-400" : "text-green-400";

  const labelColor = isBlue ? "text-blue-500/40" : "text-green-500/40";

  const badgeBgColor = isBlue ? "bg-blue-500" : "bg-green-500";
  const badgePositionClass = badgePosition === "right" ? "-right-3" : "-left-3";

  return (
    <div
      className={`relative flex flex-col items-center rounded-2xl p-2 backdrop-blur-sm md:p-8 ${bgUserColor}`}
    >
      <h3 className={`mb-2 text-2xl font-black md:text-3xl ${titleColor}`}>
        {title}
      </h3>
      <div className="mb-4 flex flex-wrap justify-center gap-1">
        {players.map((u) => (
          <span
            key={u.id}
            className={`capitalize rounded-full px-2 py-0.5 text-xs font-medium ${chipBgColor} ${chipTextColor}`}
          >
            {u.username}
          </span>
        ))}
      </div>

      <div className="w-full space-y-4">
        {/* Malas */}
        <div className="relative flex min-h-[140px] flex-col items-center justify-center rounded-2xl bg-white/5 p-2 dark:bg-black/20">
          <span
            className={`absolute top-1 left-2 text-[10px] font-bold uppercase tracking-widest ${labelColor}`}
          >
            Malas
          </span>
          <TallyMarks score={malas} />
        </div>

        {/* Separator - color logic: Team 1 (blue) -> bg-blue-500/20, Team 2 (green) -> bg-green-500/20 */}
        <div
          className={`h-1 w-full rounded-full shadow-inner ${
            isBlue ? "bg-blue-500/20" : "bg-green-500/20"
          }`}
        />

        {/* Buenas */}
        <div className="relative flex min-h-[140px] flex-col items-center justify-center rounded-2xl bg-white/5 p-2 dark:bg-black/20">
          <span
            className={`absolute top-1 left-2 text-[10px] font-bold uppercase tracking-widest ${labelColor}`}
          >
            Buenas
          </span>
          <TallyMarks score={buenas} />
        </div>
      </div>

      <div
        className={`absolute top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-xs font-bold text-white shadow-lg md:flex ${badgeBgColor} ${badgePositionClass}`}
      >
        {totalScore}
      </div>
    </div>
  );
}
