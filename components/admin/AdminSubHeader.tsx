"use client";

import { useTranslation } from "react-i18next";
import { PlusIcon } from "@/components/ui/icons";

interface AdminSubHeaderProps {
  count: number;
  onCreate: () => void;
}

export default function AdminSubHeader({ count, onCreate }: AdminSubHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between px-5 py-3">
      <div>
        <h1
          className="font-serif text-[17px] font-bold italic text-text"
        >
          {t("admin.title")}
        </h1>
        <p className="font-serif text-[11px] italic text-text-mute">
          {t("admin.count", { count })}
        </p>
      </div>
      <button
        onClick={onCreate}
        className="flex items-center gap-1.5 rounded-xl bg-us px-3.5 py-2 text-xs font-bold text-white shadow-[0_6px_16px_-8px_theme(colors.us)] active:scale-[0.97] transition-transform"
      >
        <PlusIcon size={12} />
        {t("admin.new")}
      </button>
    </div>
  );
}
