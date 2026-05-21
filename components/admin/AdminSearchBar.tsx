"use client";

import { useTranslation } from "react-i18next";

interface AdminSearchBarProps {
  value: string;
  onChange: (v: string) => void;
}

export default function AdminSearchBar({ value, onChange }: AdminSearchBarProps) {
  const { t } = useTranslation();

  return (
    <div className="px-5 pb-3">
      <div className="flex items-center gap-2.5 rounded-xl border border-border bg-surface px-3.5 py-2.5">
        <svg
          width={15}
          height={15}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 text-text-mute"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t("admin.search")}
          className="flex-1 bg-transparent text-sm text-text outline-none placeholder:text-text-mute"
        />
      </div>
    </div>
  );
}
