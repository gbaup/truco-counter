import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Session } from "@/types/auth";
import { serverT } from "@/lib/serverT";
import Link from "next/link";
import Suit from "@/components/ui/Suit";
import InviteHero from "@/components/InviteHero";
import JoinButton from "./JoinButton";

export default async function JoinPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const inviteToken = await prisma.invite_tokens.findUnique({
    where: { token },
    include: {
      groups: {
        include: {
          _count: { select: { memberships: true } },
          memberships: {
            select: { user_id: true, users: { select: { name: true, username: true } } },
            take: 5,
            orderBy: { joined_at: "asc" as const },
          },
          admin: { select: { name: true, username: true } },
        },
      },
    },
  });

  // ── Estado 4 · token inválido / revocado / inexistente — dorso de carta.
  if (!inviteToken || inviteToken.revoked_at) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 text-text">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 40% at 18% -5%, color-mix(in srgb, var(--color-them) 12%, transparent) 0%, transparent 60%), radial-gradient(ellipse 80% 45% at 85% 4%, color-mix(in srgb, var(--color-us) 13%, transparent) 0%, transparent 60%)",
          }}
        />
        <div className="relative flex flex-col items-center gap-6 text-center">
          <div
            className="flex h-[168px] w-[120px] -rotate-[4deg] items-center justify-center rounded-[16px] border border-border"
            style={{
              background: "linear-gradient(150deg, var(--color-surface-elevated), var(--color-surface))",
              boxShadow: "0 24px 48px -20px rgba(0,0,0,0.6)",
            }}
          >
            <span className="opacity-35">
              <Suit kind="espada" size={40} color="var(--color-text-mute)" />
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-[22px] font-bold text-text" style={{ fontFamily: "var(--font-crimson-pro), serif" }}>
              {serverT("join.invalidTitle")}
            </p>
            <p className="max-w-[260px] text-sm text-text-dim">{serverT("join.invalidDescription")}</p>
          </div>
          <Link href="/login" className="text-sm font-semibold text-us">
            {serverT("join.goToLogin")}
          </Link>
        </div>
      </div>
    );
  }

  const group = inviteToken.groups;
  const memberCount = group._count.memberships;
  const roster = group.memberships
    .map((m) => m.users?.name ?? m.users?.username ?? null)
    .filter((n): n is string => n !== null);
  const groupPreview = { name: group.name, memberCount, roster };

  const inMesaLabel = serverT("invite.inMesa", { count: String(memberCount) });
  const joiningToLabel = serverT("invite.joiningTo");
  const session = (await getSession()) as Session | null;

  // ── Estado 1 · SIN sesión — carta + dos CTAs (crear cuenta / ya tengo cuenta).
  if (!session?.userId) {
    return (
      <InviteHero
        group={groupPreview}
        joiningToLabel={joiningToLabel}
        inMesaLabel={inMesaLabel}
        inviterLine={
          <>
            <span className="font-bold capitalize text-text">
              {group.admin?.name ?? group.admin?.username ?? ""}
            </span>{" "}
            {serverT("invite.invitedBy")}
          </>
        }
      >
        <Link
          href={`/register?token=${token}`}
          className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-us py-4 text-base font-bold text-white transition-transform active:scale-[0.98]"
        >
          {serverT("join.createAccount")}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
        <Link
          href={`/login?token=${token}`}
          className="flex w-full items-center justify-center rounded-[14px] border border-border bg-surface py-3.5 text-base font-semibold text-text transition-transform active:scale-[0.98]"
        >
          {serverT("join.alreadyHaveAccount")}
        </Link>
        <div
          className="mt-1 text-center text-[12px] italic text-text-mute"
          style={{ fontFamily: "var(--font-crimson-pro), serif" }}
        >
          {serverT("invite.signupHint", { group: group.name })}
        </div>
      </InviteHero>
    );
  }

  // ── Estado 3 · ya sos miembro — carta + sello ✓ + ir al grupo.
  // Note: group.memberships is capped at take:5 (roster), so we query directly.
  const membershipRow = await prisma.group_memberships.findFirst({
    where: { group_id: group.id, user_id: session.userId },
    select: { id: true },
  });
  const isAlreadyMember = membershipRow !== null;
  if (isAlreadyMember) {
    return (
      <InviteHero
        group={groupPreview}
        joiningToLabel={joiningToLabel}
        inMesaLabel={inMesaLabel}
        inviterLine={
          <span className="flex items-center justify-center gap-2 font-semibold text-them">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {serverT("invite.alreadyMemberSeal")}
          </span>
        }
      >
        <Link
          href="/"
          className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-us py-4 text-base font-bold text-white transition-transform active:scale-[0.98]"
        >
          {serverT("invite.goToGroup", { group: group.name })}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </InviteHero>
    );
  }

  // ── Estado 2 · CON sesión, puede unirse — client (joinGroup) vía JoinButton.
  return (
    <JoinButton
      token={token}
      group={groupPreview}
      inviter={group.admin?.name ?? group.admin?.username ?? ""}
    />
  );
}
