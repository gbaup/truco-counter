"use client";

import Logo from "@/components/ui/Logo";
import Suit from "@/components/ui/Suit";

type GroupPreview = {
  name: string;
  memberCount: number;
  roster?: string[];
};

function CornerIndex({ rotated = false }: { rotated?: boolean }) {
  return (
    <div
      className="absolute flex flex-col items-center leading-none text-paper-ink/[0.32]"
      style={{
        fontFamily: "var(--font-crimson-pro), serif",
        fontWeight: 800,
        fontSize: 18,
        ...(rotated ? { bottom: 12, right: 16, transform: "rotate(180deg)" } : { top: 12, left: 16 }),
      }}
    >
      1<Suit kind="espada" size={13} color="var(--color-paper-ink)" />
    </div>
  );
}

function hueFromName(n: string) {
  let h = 0;
  for (let i = 0; i < n.length; i++) h = (h * 31 + n.charCodeAt(i)) % 360;
  return h;
}

export default function InviteHero({
  group,
  overlineLabel,
  joiningToLabel,
  inMesaLabel,
  inviterLine,
  children,
}: {
  group: GroupPreview;
  overlineLabel: string;
  joiningToLabel: string;
  inMesaLabel: string;
  inviterLine?: React.ReactNode;
  children: React.ReactNode;
}) {
  const roster = group.roster ?? [];
  const extra = Math.max(0, group.memberCount - roster.length);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-text">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 18% -5%, color-mix(in srgb, var(--color-them) 12%, transparent) 0%, transparent 60%), radial-gradient(ellipse 80% 45% at 85% 4%, color-mix(in srgb, var(--color-us) 13%, transparent) 0%, transparent 60%)",
        }}
      />

      <div className="relative flex min-h-screen flex-col px-5.5 pb-6.5 pt-[62px]">
        <div className="flex justify-center">
          <Logo size={22} />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-5.5">
          <div
            className="text-[11px] italic tracking-[0.22em] text-text-mute"
            style={{ fontFamily: "var(--font-crimson-pro), serif" }}
          >
            {overlineLabel}
          </div>

          <div
            className="relative w-full overflow-hidden rounded-[20px] px-5.5 pb-6 pt-6.5"
            style={{
              background: "linear-gradient(150deg, var(--color-paper), var(--color-paper-shade))",
              boxShadow: "0 24px 48px -20px rgba(0,0,0,0.6), 0 4px 0 0 rgba(0,0,0,0.18)",
            }}
          >
            <CornerIndex />
            <CornerIndex rotated />

            <div className="flex flex-col items-center text-center">
              <div
                className="flex h-[60px] w-[60px] items-center justify-center rounded-[16px] bg-paper-ink"
                style={{ boxShadow: "0 8px 16px -8px rgba(0,0,0,0.5)" }}
              >
                <Suit kind="espada" size={30} color="var(--color-paper)" />
              </div>
              <div
                className="mt-4 text-[11px] italic tracking-[0.14em] text-paper-ink/60"
                style={{ fontFamily: "var(--font-crimson-pro), serif" }}
              >
                {joiningToLabel}
              </div>
              <div
                className="mt-1 text-[30px] font-extrabold leading-[1.05] text-paper-ink"
                style={{ fontFamily: "var(--font-crimson-pro), serif" }}
              >
                {group.name}
              </div>

              <div className="mt-4.5 flex items-center gap-2.5">
                {roster.length > 0 && (
                  <div className="flex">
                    {roster.map((n, i) => (
                      <div
                        key={n}
                        className="flex h-[30px] w-[30px] capitalize items-center justify-center rounded-full text-[12px] font-bold text-white"
                        style={{
                          marginLeft: i === 0 ? 0 : -9,
                          background: `hsl(${hueFromName(n)} 42% 32%)`,
                          border: "2px solid var(--color-paper)",
                          zIndex: roster.length - i,
                        }}
                      >
                        {n[0]}
                      </div>
                    ))}
                    {extra > 0 && (
                      <div
                        className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-paper-ink text-[11px] font-bold text-paper"
                        style={{ marginLeft: -9, border: "2px solid var(--color-paper)" }}
                      >
                        +{extra}
                      </div>
                    )}
                  </div>
                )}
                <div className="text-[13px] font-semibold text-paper-ink/80">{inMesaLabel}</div>
              </div>
            </div>
          </div>

          {inviterLine && (
            <div className="text-center text-[14px] leading-[1.45] text-text-dim">{inviterLine}</div>
          )}
        </div>

        <div className="flex flex-col gap-2.5">{children}</div>
      </div>
    </div>
  );
}
