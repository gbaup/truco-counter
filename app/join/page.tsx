"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import Logo from "@/components/ui/Logo";
import Suit from "@/components/ui/Suit";
import OnboardingField from "@/components/onboarding/OnboardingField";
import { ChevronLeftIcon } from "@/components/ui/icons";
import { joinGroup } from "@/services/auth";

type GroupPreview = { id: string; name: string; memberCount: number; createdByName: string };
type ResolveState = "idle" | "loading" | "resolved" | "invalid";

function extractToken(raw: string): string | null {
  const v = raw.trim();
  if (!v) return null;
  const m = v.match(/\/join\/([A-Za-z0-9_-]+)/);
  if (m) return m[1];
  if (/^[A-Za-z0-9_-]{8,}$/.test(v)) return v;
  return null;
}

export default function JoinPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  const [resolveState, setResolveState] = useState<ResolveState>("idle");
  const [group, setGroup] = useState<GroupPreview | null>(null);
  const [joining, setJoining] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Cleanup debounce on unmount
  useEffect(() => () => clearTimeout(debounce.current), []);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    clearTimeout(debounce.current);

    const tk = extractToken(newValue);
    if (!newValue.trim() || !tk) {
      setGroup(null);
      setResolveState("idle");
      return;
    }

    debounce.current = setTimeout(async () => {
      setResolveState("loading");
      try {
        const res = await fetch(`/api/invite/${tk}`);
        if (!res.ok) throw new Error("invalid");
        const data = await res.json();
        setGroup(data.group);
        setResolveState("resolved");
      } catch {
        setGroup(null);
        setResolveState("invalid");
      }
    }, 400);
  };

  const hasInvalidFormat = !!value.trim() && !extractToken(value);
  const showError = hasInvalidFormat || resolveState === "invalid";
  const resolved = resolveState === "resolved" && !!group;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tk = extractToken(value);
    if (!tk || !resolved) return;
    setJoining(true);
    const result = await joinGroup(tk);
    setJoining(false);
    if (!result.success) {
      toast.error(result.errorCode === "group_full" ? t("join.errors.groupFull") : t("register.errors.joinFailed"));
      return;
    }
    router.push("/");
  };

  return (
    <div className="bg-background min-h-screen relative overflow-hidden flex flex-col">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 18% -5%, color-mix(in srgb, var(--color-them) 12%, transparent) 0%, transparent 60%), radial-gradient(ellipse 80% 45% at 85% 4%, color-mix(in srgb, var(--color-us) 13%, transparent) 0%, transparent 60%)",
        }}
      />

      <form onSubmit={onSubmit} className="relative flex-1 flex flex-col px-5.5 pt-6 pb-7">
        <div className="flex items-center justify-between h-9">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-surface border border-border text-text flex items-center justify-center"
          >
            <ChevronLeftIcon size={20} />
          </button>
          <span
            className="text-text-mute text-[11px] tracking-[0.16em] italic"
            style={{ fontFamily: "var(--font-crimson-pro), serif" }}
          >
            {t("join.step")}
          </span>
          <div className="w-9" />
        </div>

        <div className="flex flex-col items-center mt-8 mb-6">
          <Logo size={30} />
          <h1
            className="text-text text-[27px] font-bold mt-4"
            style={{ fontFamily: "var(--font-crimson-pro), serif" }}
          >
            {t("join.headline")}
          </h1>
          <p className="text-text-dim text-sm mt-1.5 text-center">{t("join.description")}</p>
        </div>

        <OnboardingField
          id="invite"
          mono
          label={t("join.fieldLabel")}
          placeholder={t("join.placeholder")}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          error={showError ? t("join.invalid") : null}
          autoFocus
        />

        {resolved && group && (
          <div
            className="mt-3.5 rounded-lg p-3.5 flex items-center gap-3.5 shadow-card"
            style={{ background: "linear-gradient(135deg, var(--color-paper), var(--color-paper-shade))" }}
          >
            <div className="w-10 h-[52px] rounded-md bg-paper-ink flex flex-col items-center justify-center shrink-0">
              <span
                className="self-start ml-1.5 text-paper leading-none"
                style={{ fontFamily: "var(--font-crimson-pro), serif", fontWeight: 800, fontSize: 14 }}
              >
                1
              </span>
              <Suit kind="espada" size={16} color="var(--color-paper)" />
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="text-[10px] tracking-[0.12em] italic"
                style={{
                  fontFamily: "var(--font-crimson-pro), serif",
                  color: "color-mix(in srgb, var(--color-paper-ink) 60%, transparent)",
                }}
              >
                {t("join.previewOverline")}
              </div>
              <div
                className="text-paper-ink text-[17px] font-bold leading-tight mt-0.5 truncate"
                style={{ fontFamily: "var(--font-crimson-pro), serif" }}
              >
                {group.name}
              </div>
              <div
                className="text-[11.5px] italic mt-0.5"
                style={{
                  fontFamily: "var(--font-crimson-pro), serif",
                  color: "color-mix(in srgb, var(--color-paper-ink) 67%, transparent)",
                }}
              >
                {t("join.previewMeta", { count: group.memberCount, admin: group.createdByName })}
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!resolved || joining}
          className="mt-3.5 w-full rounded-lg py-4 text-base font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform bg-us text-white disabled:bg-surface-elevated disabled:text-text-mute disabled:active:scale-100"
        >
          {joining ? "…" : resolved && group ? t("join.submitTo", { group: group.name }) : t("join.submit")}
        </button>

        {process.env.NEXT_PUBLIC_ENABLE_GROUP_CREATION !== "false" && (
          <p
            className="mt-auto pt-6 text-center text-text-mute text-[13px] italic"
            style={{ fontFamily: "var(--font-crimson-pro), serif" }}
          >
            {t("join.noInvite")}{" "}
            <Link href="/groups/new" className="text-us not-italic font-semibold">
              {t("join.noInviteCreate")}
            </Link>
          </p>
        )}
      </form>
    </div>
  );
}
