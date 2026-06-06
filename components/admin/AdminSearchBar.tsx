"use client";

import { useTranslation } from "react-i18next";
import { SearchIcon } from "@/components/ui/icons";

interface AdminSearchBarProps {
  value: string;
  onChange: (v: string) => void;
}

export default function AdminSearchBar({ value, onChange }: AdminSearchBarProps) {
  const { t } = useTranslation();

  return (
    <div className="px-5 pb-3">
      <div className="flex items-center gap-2.5 rounded-xl border border-border bg-surface px-3.5 py-2.5">
        <SearchIcon size={15} className="shrink-0 text-text-mute" />
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
