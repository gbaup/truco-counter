import { twMerge } from "tailwind-merge";

interface PlayerAvatarProps {
  name: string;
  lastName?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function PlayerAvatar({ name, lastName, className, style }: PlayerAvatarProps) {
  const initials = (name[0] ?? "") + (lastName?.[0] ?? "");
  return (
    <div
      className={twMerge(
        "flex uppercase items-center justify-center rounded-full shrink-0 w-9 h-9 bg-surface-elevated border border-border font-bold text-[12px] text-text-dim",
        className
      )}
      style={style}
    >
      {initials}
    </div>
  );
}
