"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { joinGroup } from "@/services/auth";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { SpinnerIcon } from "@/components/ui/icons";
import { useTranslation } from "react-i18next";

interface JoinButtonProps {
  token: string;
  groupName: string;
}

export default function JoinButton({ token, groupName }: JoinButtonProps) {
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
    <div className="bg-background min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        <div className="text-center">
          <p className="text-text-dim text-sm uppercase tracking-widest mb-1">{t("join.overline")}</p>
          <h1 className="text-text text-2xl font-bold">{groupName}</h1>
          <p className="text-text-dim mt-2 text-sm">{t("join.invitedDescription")}</p>
        </div>

        <button
          onClick={handleJoin}
          disabled={isLoading}
          className={twMerge(
            "w-full bg-us text-white rounded-lg py-4 text-base font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform",
            isLoading && "opacity-50"
          )}
        >
          {isLoading ? (
            <SpinnerIcon className="h-5 w-5 animate-spin" />
          ) : (
            t("join.submitTo", { group: groupName })
          )}
        </button>
      </div>
    </div>
  );
}
