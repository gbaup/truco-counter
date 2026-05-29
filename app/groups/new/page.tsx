"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateGroup } from "@/hooks/useCreateGroup";
import { useTranslation } from "react-i18next";
import Logo from "@/components/ui/Logo";
import OnboardingField from "@/components/onboarding/OnboardingField";

const BackChevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const MAX_LENGTH = 30;

export default function NewGroupPage() {
  const [groupName, setGroupName] = useState("");
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
    <div className="bg-background min-h-screen relative overflow-hidden flex flex-col">
      {/* felt glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 18% -5%, color-mix(in srgb, var(--color-them) 12%, transparent) 0%, transparent 60%), radial-gradient(ellipse 80% 45% at 85% 4%, color-mix(in srgb, var(--color-us) 13%, transparent) 0%, transparent 60%)",
        }}
      />

      <div className="relative flex-1 flex flex-col px-5.5 pt-6 pb-7">
        <div className="flex items-center justify-between h-9">
          <button
            type="button"
            onClick={() => router.push("/onboarding/choose")}
            className="w-9 h-9 rounded-full bg-surface border border-border text-text flex items-center justify-center"
          >
            <BackChevron />
          </button>
          <span
            className="text-text-mute text-[11px] tracking-[0.16em] italic"
            style={{ fontFamily: "var(--font-crimson-pro), serif" }}
          >
            {t("groups.new.overline")}
          </span>
          <div className="w-9" />
        </div>

        <div className="flex flex-col items-center mt-8 mb-6">
          <Logo size={30} />
          <h1
            className="text-text text-[27px] font-bold mt-4"
            style={{ fontFamily: "var(--font-crimson-pro), serif" }}
          >
            {t("groups.new.headline")}
          </h1>
          <p className="text-text-dim text-sm mt-1.5 text-center">{t("groups.new.description")}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div>
            <OnboardingField
              id="groupName"
              label={t("groups.new.nameLabel")}
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder={t("groups.new.namePlaceholder")}
              maxLength={MAX_LENGTH}
              required
              autoFocus
            />
            <p
              className="text-right text-[11px] mt-1.5 pr-1"
              style={{ fontFamily: "var(--font-space-grotesk), sans-serif", color: "var(--color-text-mute)" }}
            >
              {groupName.length}/{MAX_LENGTH}
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || !groupName.trim()}
            className="w-full rounded-lg py-4 text-base font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform bg-us text-white disabled:bg-surface-elevated disabled:text-text-mute disabled:active:scale-100"
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

        <p
          className="mt-auto pt-6 text-center text-text-mute text-[13px] italic"
          style={{ fontFamily: "var(--font-crimson-pro), serif" }}
        >
          {t("groups.new.inviteFootnote")}
        </p>
      </div>
    </div>
  );
}
