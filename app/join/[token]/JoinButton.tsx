"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { joinGroup } from "@/services/auth";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

interface JoinButtonProps {
  token: string;
  groupName: string;
}

export default function JoinButton({ token, groupName }: JoinButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleJoin = async () => {
    setIsLoading(true);
    const result = await joinGroup(token);
    setIsLoading(false);

    if (result.success) {
      router.push("/");
    } else {
      toast.error(result.error ?? "No se pudo unir al grupo");
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        <div className="text-center">
          <p className="text-text-dim text-sm uppercase tracking-widest mb-1">Invitación</p>
          <h1 className="text-text text-2xl font-bold">{groupName}</h1>
          <p className="text-text-dim mt-2 text-sm">Te invitaron a unirte a este grupo.</p>
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
            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            "Unirme al grupo"
          )}
        </button>
      </div>
    </div>
  );
}
