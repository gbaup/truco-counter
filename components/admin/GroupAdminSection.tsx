"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";
import { Group } from "@/types/group";
import { useGroupShareLink } from "@/hooks/useGroupShareLink";
import { useUpdateGroupName } from "@/hooks/useUpdateGroupName";
import ChangeGroupNameSheet from "@/components/ui/ChangeGroupNameSheet";
import { UsersIcon, PencilIcon, CopyIcon, CheckIcon, RefreshIcon } from "@/components/ui/icons";

interface MyGroup extends Group {
  member_count: number;
  joined_at: string | null;
}

interface Props {
  adminedGroups: MyGroup[];
  selectedGroupId: string | null;
  onSelectGroup: (id: string) => void;
}

export default function GroupAdminSection({ adminedGroups, selectedGroupId, onSelectGroup }: Props) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);

  const { data, isLoading, revoke, isRevoking } = useGroupShareLink(selectedGroupId);
  const updateName = useUpdateGroupName();

  const selectedGroup =
    adminedGroups.find((g) => g.id === selectedGroupId) ?? adminedGroups[0];
  const groupName = selectedGroup?.name ?? "";

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
      {adminedGroups.length > 1 && (
        <select
          value={selectedGroupId ?? ""}
          onChange={(e) => onSelectGroup(e.target.value)}
          className="w-full px-3 py-2 mb-3 rounded-md bg-surface border border-border text-sm text-text appearance-none cursor-pointer"
        >
          {adminedGroups.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      )}

      <div className="rounded-2xl bg-surface border border-border p-3.5 shadow-card">
        <div className="flex items-center gap-3">
          <div
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full font-serif text-sm font-extrabold text-white"
            style={{ background: "linear-gradient(135deg, var(--color-us), var(--color-us-deep))" }}
          >
            <UsersIcon size={20} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-serif text-[10.5px] italic uppercase tracking-[0.18em] text-text-mute">
              {t("admin.groupAdmin.title")}
            </p>
            <p className="truncate text-[18px] font-bold leading-tight text-text">
              {groupName}
            </p>
          </div>

          <button
            onClick={() => setEditing(true)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-text-dim transition-colors hover:bg-surface-elevated active:scale-95"
            aria-label={t("groupName.edit")}
          >
            <PencilIcon size={14} />
          </button>
        </div>

        <div className="my-3 h-px bg-border" />

        <p className="mb-2 text-xs text-text-dim">{t("admin.groupAdmin.inviteSection")}</p>

        {isLoading ? (
          <div className="h-10 rounded-[11px] bg-background animate-pulse" />
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex h-10 min-w-0 flex-1 items-center truncate rounded-[11px] border border-border bg-background px-3.5 font-display text-[12.5px] text-text-dim">
              {data?.joinUrl ?? "—"}
            </div>
            <button
              onClick={handleCopy}
              disabled={!data?.joinUrl}
              className={twMerge(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors active:scale-95 disabled:opacity-40",
                copied
                  ? "border-us/40 bg-us/10 text-us"
                  : "border-border text-text-dim hover:bg-surface-elevated"
              )}
              aria-label={copied ? t("admin.groupAdmin.copied") : t("admin.groupAdmin.copy")}
            >
              {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
            </button>
          </div>
        )}

        <button
          onClick={handleRevoke}
          disabled={isRevoking || !data?.tokenId}
          className="mt-2.5 flex items-center gap-1.5 text-xs text-text-mute transition-opacity disabled:opacity-40"
        >
          <RefreshIcon size={13} />
          {isRevoking ? t("admin.groupAdmin.revoking") : t("admin.groupAdmin.revoke")}
        </button>
      </div>

      <ChangeGroupNameSheet
        key={selectedGroupId ?? "none"}
        open={editing}
        currentName={groupName}
        onClose={() => setEditing(false)}
        onSave={(name) => updateName.mutateAsync({ groupId: selectedGroupId!, name })}
        onSaved={() => setEditing(false)}
      />
    </div>
  );
}
