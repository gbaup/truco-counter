"use client";

import { twMerge } from "tailwind-merge";

interface SettingsToggleProps {
  on: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}

export default function SettingsToggle({ on, onChange, label }: SettingsToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={twMerge(
        "relative inline-flex h-[22px] w-[38px] shrink-0 cursor-pointer rounded-full border-2 border-transparent",
        "transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-us",
        on ? "bg-us" : "bg-border"
      )}
    >
      <span
        className={twMerge(
          "pointer-events-none inline-block h-[18px] w-[18px] rounded-full bg-white shadow",
          "transition-transform duration-200",
          on ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );
}
