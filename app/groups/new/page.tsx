"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateGroup } from "@/hooks/useCreateGroup";
import { useTranslation } from "react-i18next";
import Logo from "@/components/ui/Logo";
import { twMerge } from "tailwind-merge";

export default function NewGroupPage() {
  const [groupName, setGroupName] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();
  const { isLoading, createGroup } = useCreateGroup();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const group = await createGroup(groupName.trim());
    if (group) {
      router.push(`/groups/${group.id}/invite`);
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <Logo size={42} />
          <div className="text-center">
            <p className="text-text-dim text-xs uppercase tracking-widest">{t("groups.new.overline")}</p>
            <h1 className="text-text text-2xl font-bold mt-1">{t("groups.new.headline")}</h1>
            <p className="text-text-dim text-sm mt-2">{t("groups.new.description")}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div
            className={twMerge(
              "bg-surface rounded-lg px-4 py-3 border transition-colors",
              focused ? "border-us/50" : "border-border"
            )}
          >
            <label
              htmlFor="groupName"
              className="text-caption-italic text-text-dim block cursor-pointer"
              style={{ fontFamily: "var(--font-crimson-pro), serif" }}
            >
              {t("groups.new.nameLabel")}
            </label>
            <input
              id="groupName"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="w-full bg-transparent text-text font-semibold text-[15px] mt-0.5 focus:outline-none"
              placeholder={t("groups.new.namePlaceholder")}
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !groupName.trim()}
            className="w-full bg-us text-white rounded-lg py-4 text-base font-bold flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] transition-transform"
          >
            {isLoading ? (
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              t("groups.new.submit")
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
