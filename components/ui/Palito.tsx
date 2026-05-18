"use client";

/**
 * Palito — a single hand-drawn tally mark, 1 to 5 strokes forming a
 * square "casita" (Uruguayan style), NOT five parallel lines.
 *
 * Stroke order (count goes 1→5):
 *   1 → left side          (vertical)
 *   2 → top side           (horizontal)
 *   3 → right side         (vertical)
 *   4 → bottom side        (horizontal)
 *   5 → diagonal           (bottom-left → top-right)
 */

interface PalitoProps {
  count: number;       // 0..5
  color?: string;
  size?: number;
}

export default function Palito({
  count,
  color = "currentColor",
  size = 50,
}: PalitoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ overflow: "visible" }}
    >
      <g
        stroke={color}
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={0.92}
      >
        {count >= 1 && <path d="M 20 14 C 19 35, 22 60, 21 86" />}
        {count >= 2 && <path d="M 18 18 C 38 17, 62 19, 84 17" />}
        {count >= 3 && <path d="M 82 14 C 83 36, 80 60, 83 84" />}
        {count >= 4 && <path d="M 18 84 C 40 83, 62 86, 84 82" />}
        {count >= 5 && <path d="M 14 88 C 38 70, 62 38, 88 14" />}
      </g>
    </svg>
  );
}

/**
 * Tally — a column of Palitos that renders a numeric score.
 *
 * For the counter the score is split into two halves (malas / buenas);
 * see MatchCounter integration in IMPLEMENTATION.md.
 */
export function Tally({
  score,
  color,
  size = 50,
  gap = 6,
}: {
  score: number;
  color: string;
  size?: number;
  gap?: number;
}) {
  const groups: number[] = [];
  let r = score;
  while (r > 0) {
    groups.push(Math.min(5, r));
    r -= 5;
  }
  return (
    <div className="flex flex-col items-center" style={{ gap }}>
      {groups.map((c, i) => (
        <Palito key={i} count={c} color={color} size={size} />
      ))}
    </div>
  );
}
