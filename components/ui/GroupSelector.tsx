"use client";

import { twMerge } from "tailwind-merge";

interface GroupSelectorProps {
  groups: Array<{ id: string; name: string }>;
  value: string | null;
  onChange: (id: string) => void;
  className?: string;
}

export default function GroupSelector({ groups, value, onChange, className }: GroupSelectorProps) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className={twMerge(
        "w-full px-3.5 py-2 rounded-md bg-surface border border-border text-sm text-text font-medium appearance-none cursor-pointer",
        className
      )}
    >
      {groups.map((g) => (
        <option key={g.id} value={g.id}>{g.name}</option>
      ))}
    </select>
  );
}
