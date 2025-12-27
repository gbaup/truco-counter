import { PublicUser } from "@/types/database";
import TallyMarks from "@/components/TallyMarks";

interface TeamCounterProps {
  title: string;
  players: PublicUser[];
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

  const badgeBgColor = isBlue ? "bg-blue-500" : "bg-green-500";
  const badgePositionClass = badgePosition === "right" ? "-right-3" : "-left-3";

  //TODO: implement team members display
  return (
    <div
      className={`relative flex flex-col items-center rounded-2xl p-2 backdrop-blur-sm md:p-8 h-full ${bgUserColor}`}
    >
      <h3 className={`mb-2 text-2xl font-black md:text-3xl ${titleColor}`}>
        {title}
      </h3>

      <div className="w-full flex-1 flex flex-col gap-4">
        <div className="relative flex flex-1 flex-col items-center justify-start rounded-2xl bg-white/5 p-2 dark:bg-black/20">
          <TallyMarks score={malas} />
        </div>

        <div
          className={`h-1 w-full rounded-full shadow-inner ${isBlue ? "bg-blue-500/20" : "bg-green-500/20"
            }`}
        />

        <div className="relative flex flex-1 flex-col items-center justify-start rounded-2xl bg-white/5 p-2 dark:bg-black/20">
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
