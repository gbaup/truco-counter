import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Session } from "@/types/auth";
import { serverT } from "@/lib/serverT";
import Link from "next/link";
import JoinButton from "./JoinButton";

export default async function JoinPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const inviteToken = await prisma.invite_tokens.findUnique({
    where: { token },
    include: {
      groups: {
        include: {
          _count: { select: { memberships: true } },
          memberships: { select: { user_id: true } },
        },
      },
    },
  });

  if (!inviteToken || inviteToken.revoked_at) {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-center flex flex-col gap-4">
          <p className="text-text text-lg font-semibold">{serverT("join.invalidTitle")}</p>
          <p className="text-text-dim text-sm">{serverT("join.invalidDescription")}</p>
          <Link href="/login" className="text-us font-semibold text-sm">
            {serverT("join.goToLogin")}
          </Link>
        </div>
      </div>
    );
  }

  const group = inviteToken.groups;
  const session = (await getSession()) as Session | null;

  if (!session?.userId) {
    const memberCount = group._count.memberships;
    const memberLabel = serverT(
      memberCount === 1 ? "join.memberCount_one" : "join.memberCount_other",
      { count: String(memberCount) }
    );

    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm flex flex-col items-center gap-6">
          <div className="text-center">
            <p className="text-text-dim text-sm uppercase tracking-widest mb-1">{serverT("join.overline")}</p>
            <h1 className="text-text text-2xl font-bold">{group.name}</h1>
            <p className="text-text-dim mt-2 text-sm">{memberLabel}</p>
          </div>

          <div className="w-full flex flex-col gap-2.5">
            <Link
              href={`/register?token=${token}`}
              className="w-full bg-us text-white rounded-lg py-4 text-base font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              {serverT("join.createAccount")}
            </Link>
            <Link
              href={`/login?token=${token}`}
              className="w-full bg-surface border border-border text-text rounded-lg py-4 text-base font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              {serverT("join.alreadyHaveAccount")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isAlreadyMember = group.memberships.some((m) => m.user_id === session.userId);

  if (isAlreadyMember) {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-center flex flex-col gap-4">
          <p className="text-text text-lg font-semibold">
            {serverT("join.alreadyMember", { groupName: group.name })}
          </p>
          <Link href="/" className="text-us font-semibold text-sm">
            {serverT("join.goHome")}
          </Link>
        </div>
      </div>
    );
  }

  return <JoinButton token={token} groupName={group.name} />;
}
