"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Logo from "@/components/ui/Logo";
import Suit from "@/components/ui/Suit";
import { ChevronRightIcon } from "@/components/ui/icons";

type Choice = {
  href: string;
  suit: "espada" | "basto";
  accentVar: string;
  title: string;
  sub: string;
  primary?: boolean;
};

function ChooseTableContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const name = searchParams.get("name") ?? "";

  const choices: Choice[] = [
    {
      href: "/groups/new",
      suit: "espada",
      accentVar: "--color-us",
      title: t("onboarding.choose.createTitle"),
      sub: t("onboarding.choose.createSub"),
      primary: true,
    },
    {
      href: "/join",
      suit: "basto",
      accentVar: "--color-them",
      title: t("onboarding.choose.joinTitle"),
      sub: t("onboarding.choose.joinSub"),
    },
  ];

  return (
    <div className="bg-background min-h-screen relative overflow-hidden flex flex-col">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 18% -5%, color-mix(in srgb, var(--color-them) 12%, transparent) 0%, transparent 60%), radial-gradient(ellipse 80% 45% at 85% 4%, color-mix(in srgb, var(--color-us) 13%, transparent) 0%, transparent 60%)",
        }}
      />

      <div className="relative flex-1 flex flex-col px-5.5 pt-16 pb-7">
        <p
          className="text-center text-text-mute text-[11px] tracking-[0.16em] italic"
          style={{ fontFamily: "var(--font-crimson-pro), serif" }}
        >
          {t("onboarding.choose.step")}
        </p>

        <div className="flex flex-col items-center mt-8 mb-7">
          <Logo size={30} />
          <p
            className="text-text-mute text-[11px] tracking-[0.16em] italic mt-3.5"
            style={{ fontFamily: "var(--font-crimson-pro), serif" }}
          >
            {t("onboarding.choose.overline", { name })}
          </p>
          <h1
            className="text-text text-[27px] font-bold mt-1"
            style={{ fontFamily: "var(--font-crimson-pro), serif" }}
          >
            {t("onboarding.choose.headline")}
          </h1>
        </div>

        <div className="flex flex-col gap-3">
          {choices.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="w-full rounded-[18px] p-4 flex items-center gap-3.5 text-left transition-colors"
              style={
                c.primary
                  ? {
                      background: `color-mix(in srgb, var(${c.accentVar}) 12%, transparent)`,
                      border: `1.5px solid var(${c.accentVar})`,
                      boxShadow: `0 0 0 4px color-mix(in srgb, var(${c.accentVar}) 10%, transparent)`,
                    }
                  : { background: "var(--color-surface)", border: "1px solid var(--color-border)" }
              }
            >
              <div
                className="w-[46px] h-[46px] rounded-[13px] flex items-center justify-center shrink-0"
                style={{
                  background: `color-mix(in srgb, var(${c.accentVar}) 12%, transparent)`,
                  border: `1px solid color-mix(in srgb, var(${c.accentVar}) 55%, transparent)`,
                }}
              >
                <Suit kind={c.suit} size={22} color={`var(${c.accentVar})`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-text text-base font-bold">{c.title}</div>
                <div className="text-text-dim text-[12.5px] mt-0.5 leading-snug">{c.sub}</div>
              </div>
              <span style={{ color: c.primary ? `var(${c.accentVar})` : "var(--color-text-mute)" }}>
                <ChevronRightIcon size={18} />
              </span>
            </Link>
          ))}
        </div>

        <p
          className="mt-auto pt-6 text-center text-text-mute text-[13px] italic"
          style={{ fontFamily: "var(--font-crimson-pro), serif" }}
        >
          {t("onboarding.choose.footnote")}
        </p>
      </div>
    </div>
  );
}

export default function ChooseTablePage() {
  return (
    <Suspense>
      <ChooseTableContent />
    </Suspense>
  );
}
