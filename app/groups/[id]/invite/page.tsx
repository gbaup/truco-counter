import { getSession } from "@/lib/auth";
import { Session } from "@/types/auth";
import { serverT } from "@/lib/serverT";
import { redirect } from "next/navigation";
import { findOrCreateShareToken } from "@/lib/inviteTokens";
import Logo from "@/components/ui/Logo";
import ShareLinkPanel from "./ShareLinkPanel";

export default async function GroupInvitePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: groupId } = await params;
  const session = (await getSession()) as Session | null;

  if (!session?.userId) {
    redirect("/login");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
  const activeToken = await findOrCreateShareToken(groupId, session.userId);
  const joinUrl = `${appUrl}/join/${activeToken.token}`;

  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <Logo size={42} />
          <div className="text-center">
            <p className="text-text-dim text-xs uppercase tracking-widest">{serverT("groups.invite.overline")}</p>
            <h1 className="text-text text-2xl font-bold mt-1">{serverT("groups.invite.headline")}</h1>
            <p className="text-text-dim text-sm mt-2">{serverT("groups.invite.description")}</p>
          </div>
        </div>

        <ShareLinkPanel joinUrl={joinUrl} />
      </div>
    </div>
  );
}
