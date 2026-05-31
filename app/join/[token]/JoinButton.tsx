"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { joinGroup } from "@/services/auth";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import InvitePage from "@/components/InvitePage";

interface JoinButtonProps {
  token: string;
  group: { name: string; memberCount: number; roster?: string[] };
  inviter: string;
}

export default function JoinButton({ token, group, inviter }: JoinButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  const handleJoin = async () => {
    setIsLoading(true);
    const result = await joinGroup(token);
    setIsLoading(false);
    if (result.success) {
      router.push("/");
    } else {
      toast.error(result.error ?? t("register.errors.joinFailed"));
    }
  };

  return (
    <InvitePage
      group={group}
      inviter={inviter}
      joining={isLoading}
      onJoin={handleJoin}
      onUseOtherAccount={() => router.push(`/login?token=${token}`)}
    />
  );
}
