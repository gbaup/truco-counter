"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { WhatsAppIcon } from "@/components/ui/icons";

interface ShareLinkPanelProps {
  joinUrl: string;
}

export default function ShareLinkPanel({ joinUrl }: ShareLinkPanelProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`${t("groups.invite.whatsappText")} ${joinUrl}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="bg-surface border border-border rounded-lg px-4 py-3">
        <p className="text-text-dim text-xs mb-1 font-medium">{t("groups.invite.linkLabel")}</p>
        <p className="text-text text-sm font-mono break-all">{joinUrl}</p>
      </div>

      <button
        onClick={handleCopy}
        className="w-full bg-us text-white rounded-lg py-4 text-base font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
      >
        {copied ? t("groups.invite.copied") : t("groups.invite.copy")}
      </button>

      <button
        onClick={handleWhatsApp}
        className="w-full bg-surface border border-border text-text rounded-lg py-4 text-base font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
      >
        <WhatsAppIcon size={20} />
        {t("groups.invite.whatsapp")}
      </button>

      <button
        onClick={() => router.push("/")}
        className="text-center text-sm text-text-dim mt-2 underline"
      >
        {t("groups.invite.skipToApp")}
      </button>
    </div>
  );
}
