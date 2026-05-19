import { twMerge } from "tailwind-merge";

interface RoleBadgeProps {
  children: React.ReactNode;
  soft?: boolean;
}

export default function RoleBadge({ children, soft }: RoleBadgeProps) {
  return (
    <span
      className={twMerge(
        "inline-flex items-center rounded px-1.5 py-0.5 font-display text-[9px] font-bold tracking-widest",
        soft
          ? "bg-warning/20 text-warning"
          : "bg-us text-white"
      )}
    >
      {children}
    </span>
  );
}
