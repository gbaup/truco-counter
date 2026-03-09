import { PublicUser } from "@/types/database";
import TallyMarks from "@/components/ui/TallyMarks";

interface TeamCounterProps {
  title: string;
  players: PublicUser[];
  totalScore: number;
  malas: number;
  buenas: number;
  variant: "primary" | "secondary";
  badgePosition: "left" | "right";
}

export default function TeamCounter({
  title,
  totalScore,
  malas,
  buenas,
  variant,
  badgePosition,
}: TeamCounterProps) {
  const isPrimary = variant === "primary";

  const bgUserColor = isPrimary
    ? "bg-primary-900/20"
    : "bg-secondary-900/20";
  const titleColor = isPrimary ? "text-primary-500" : "text-secondary-500";

  const badgeBgColor = isPrimary ? "bg-primary-500" : "bg-secondary-500";
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
        <div className="relative flex flex-1 flex-col items-center justify-start rounded-2xl bg-black/20 p-2">
          <TallyMarks score={malas} />
        </div>

        <div
          className={`h-1 w-full rounded-full shadow-inner ${isPrimary ? "bg-primary-500/20" : "bg-secondary-500/20"
            }`}
        />

        <div className="relative flex flex-1 flex-col items-center justify-start rounded-2xl bg-black/20 p-2">
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
