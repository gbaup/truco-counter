"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";
import { Group } from "@/types/group";
import { useGroupShareLink } from "@/hooks/useGroupShareLink";

interface MyGroup extends Group {
  member_count: number;
  joined_at: string | null;
}

interface Props {
  adminedGroups: MyGroup[];
}

export default function GroupAdminSection({ adminedGroups }: Props) {
  const { t } = useTranslation();
  const [selectedGroupId, setSelectedGroupId] = useState(adminedGroups[0]?.id ?? null);
  const [copied, setCopied] = useState(false);
  const { data, isLoading, revoke, isRevoking } = useGroupShareLink(selectedGroupId);

  function handleCopy() {
    if (!data?.joinUrl) return;
    navigator.clipboard.writeText(data.joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleRevoke() {
    if (!data?.tokenId) return;
    revoke(data.tokenId);
  }

  return (
    <div className="px-5 pt-5 pb-4 border-b border-border">
      <p
        className="text-[10px] font-semibold text-text-mute mb-3 uppercase tracking-widest"
        style={{ fontFamily: "var(--font-crimson-pro), serif" }}
      >
        {t("admin.groupAdmin.title")}
      </p>

      {adminedGroups.length > 1 && (
        <select
          value={selectedGroupId ?? ""}
          onChange={(e) => setSelectedGroupId(e.target.value)}
          className="w-full px-3 py-2 mb-3 rounded-md bg-surface border border-border text-sm text-text appearance-none cursor-pointer"
        >
          {adminedGroups.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      )}

      {adminedGroups.length === 1 && (
        <p className="text-sm font-semibold text-text mb-3">{adminedGroups[0].name}</p>
      )}

      <p className="text-xs text-text-mute mb-1.5">{t("admin.groupAdmin.inviteSection")}</p>

      {isLoading ? (
        <div className="h-9 bg-surface rounded-md animate-pulse" />
      ) : (
        <div className="flex gap-2">
          <div className="flex-1 px-3 py-2 bg-surface border border-border rounded-md text-xs text-text-dim font-mono truncate min-w-0">
            {data?.joinUrl ?? "—"}
          </div>
          <button
            onClick={handleCopy}
            disabled={!data?.joinUrl}
            className={twMerge(
              "px-3 py-2 rounded-md border text-xs font-medium transition-colors shrink-0",
              copied
                ? "bg-us/20 border-us/40 text-us"
                : "bg-surface border-border text-text hover:bg-surface-elevated"
            )}
          >
            {copied ? t("admin.groupAdmin.copied") : t("admin.groupAdmin.copy")}
          </button>
        </div>
      )}

      <button
        onClick={handleRevoke}
        disabled={isRevoking || !data?.tokenId}
        className="mt-2 text-xs text-text-mute underline underline-offset-2 transition-opacity disabled:opacity-40"
      >
        {isRevoking ? t("admin.groupAdmin.revoking") : t("admin.groupAdmin.revoke")}
      </button>
    </div>
  );
}
