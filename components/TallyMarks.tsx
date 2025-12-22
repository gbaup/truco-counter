"use client";

interface TallyGroupProps {
  points: number; // 1-5
}

function TallyGroup({ points }: TallyGroupProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="h-12 w-12 text-zinc-800 dark:text-zinc-200 lg:h-16 lg:w-16"
    >
      {/* Stroke width and linecaps for a "hand-drawn" or "marker" look */}
      {points >= 1 && (
        <line
          x1="20"
          y1="20"
          x2="20"
          y2="80"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      )}
      {points >= 2 && (
        <line
          x1="20"
          y1="20"
          x2="80"
          y2="20"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      )}
      {points >= 3 && (
        <line
          x1="80"
          y1="20"
          x2="80"
          y2="80"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      )}
      {points >= 4 && (
        <line
          x1="20"
          y1="80"
          x2="80"
          y2="80"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      )}
      {points >= 5 && (
        <line
          x1="20"
          y1="20"
          x2="80"
          y2="80"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      )}
    </svg>
  );
}

interface TallyMarksProps {
  score: number;
}

export default function TallyMarks({ score }: TallyMarksProps) {
  const fullGroups = Math.floor(score / 5);
  const partialGroup = score % 5;

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {Array.from({ length: fullGroups }).map((_, i) => (
        <TallyGroup key={`full-${i}`} points={5} />
      ))}
      {partialGroup > 0 && <TallyGroup points={partialGroup} />}
      {score === 0 && (
        <div className="h-12 w-12 border-2 border-dashed border-zinc-300 rounded-xl dark:border-zinc-700 lg:h-16 lg:w-16" />
      )}
    </div>
  );
}
