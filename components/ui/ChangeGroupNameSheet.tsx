"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import BottomSheet from "@/components/ui/BottomSheet";

const MAX_LENGTH = 30;

interface ChangeGroupNameSheetProps {
  open: boolean;
  currentName: string;
  onClose: () => void;
  onSaved: (newName: string) => void;
  onSave: (draft: string) => Promise<unknown>;
}

export default function ChangeGroupNameSheet({
  open,
  currentName,
  onClose,
  onSaved,
  onSave,
}: ChangeGroupNameSheetProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState(currentName);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const trimmed = draft.trim();
  const isValid = trimmed.length >= 1 && trimmed.length <= MAX_LENGTH;
  const hasChanged = trimmed !== currentName;
  const showError = !!error;

  async function handleSubmit() {
    if (!isValid) {
      setError(t("groupName.hint"));
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await onSave(trimmed);
      toast.success(t("groupName.savedToast", { name: trimmed }));
      onSaved(trimmed);
      onClose();
    } catch {
      setError(t("common.errorTryAgain"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      overline={t("groupName.overline")}
      headline={t("groupName.headline")}
      submit={{
        label: t("common.save"),
        onSubmit: handleSubmit,
        disabled: !isValid || !hasChanged,
        saving,
      }}
    >
      <div
        className={twMerge(
          "flex items-center gap-2.5 rounded-md border bg-background px-4 py-3.5 transition-colors",
          showError ? "border-danger" : "border-us/40"
        )}
      >
        <input
          autoFocus
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            if (error) setError(null);
          }}
          maxLength={MAX_LENGTH}
          className="flex-1 bg-transparent text-[17px] font-semibold text-text outline-none placeholder:text-text-mute"
          placeholder={t("groupName.placeholder")}
        />
        <span
          className={twMerge(
            "font-display text-[11px] font-semibold",
            draft.length > MAX_LENGTH - 3 ? "text-warning" : "text-text-mute"
          )}
        >
          {draft.length}/{MAX_LENGTH}
        </span>
      </div>

      <p
        className={twMerge(
          "mt-2 font-serif text-[11px] italic",
          showError ? "text-danger" : "text-text-mute"
        )}
      >
        {error ?? t("groupName.hint")}
      </p>
    </BottomSheet>
  );
}
