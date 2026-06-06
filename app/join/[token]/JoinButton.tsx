"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { joinGroup } from "@/services/auth";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import InviteHero from "@/components/InviteHero";
import { ArrowIcon } from "@/components/ui/icons";

interface JoinButtonProps {
  token: string;
  group: { name: string; memberCount: number; roster?: string[] };
  inviter: string;
  isFull?: boolean;
}

export default function JoinButton({ token, group, inviter, isFull = false }: JoinButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  const handleJoin = async () => {
    setIsLoading(true);
    const result = await joinGroup(token);
    setIsLoading(false);
    if (result.success) {
      router.push("/");
    } else if (result.errorCode === "group_full") {
      toast.error(t("join.errors.groupFull"));
    } else {
      toast.error(result.error ?? t("register.errors.joinFailed"));
    }
  };

  return (
    <InviteHero
      group={group}
      overlineLabel={t("invite.overline").toUpperCase()}
      joiningToLabel={t("invite.joiningTo")}
      inMesaLabel={t("invite.inMesa", { count: group.memberCount })}
      inviterLine={
        <>
          <span className="font-bold capitalize text-text">{inviter}</span> {t("invite.invitedBy")}
        </>
      }
    >
      <button
        onClick={handleJoin}
        disabled={isLoading || isFull}
        className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-us py-4 text-base font-bold text-white transition-transform active:scale-[0.98] disabled:bg-surface-elevated disabled:text-text-mute disabled:active:scale-100"
      >
        {isLoading ? t("invite.joining") : isFull ? t("join.errors.groupFull") : <>{t("invite.join", { group: group.name })} <ArrowIcon /></>}
      </button>
      <div className="text-center text-[13px] italic text-text-mute" style={{ fontFamily: "var(--font-crimson-pro), serif" }}>
        {t("invite.notYou")}{" "}
        <button onClick={() => router.push(`/login?token=${token}`)} className="font-semibold not-italic text-us">
          {t("invite.otherAccount")}
        </button>
      </div>
    </InviteHero>
  );
}
