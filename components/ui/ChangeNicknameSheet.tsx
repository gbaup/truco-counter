"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import BottomSheet from "@/components/ui/BottomSheet";
import { toast } from "sonner";
import { USERNAME_RE } from "@/lib/validators";
import { twMerge } from "tailwind-merge";

interface ChangeNicknameSheetProps {
  open: boolean;
  currentNickname: string;
  overline: string;
  headline: string;
  onClose: () => void;
  onSaved: (newNickname: string) => void;
  onSave: (draft: string) => Promise<unknown>;
}

export default function ChangeNicknameSheet({
  open,
  currentNickname,
  overline,
  headline,
  onClose,
  onSaved,
  onSave,
}: ChangeNicknameSheetProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState(currentNickname);
  const [prevNickname, setPrevNickname] = useState(currentNickname);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (prevNickname !== currentNickname) {
    setPrevNickname(currentNickname);
    setDraft(currentNickname);
    setError(null);
  }

  const hasChanged = draft !== currentNickname;
  const isValid = USERNAME_RE.test(draft);
  const showError = !!error || (hasChanged && !isValid);

  async function handleSubmit() {
    if (!isValid) {
      setError(t("nickname.hint"));
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await onSave(draft);
      toast.success(t("nickname.savedToast", { name: draft }));
      onSaved(draft);
      onClose();
    } catch (e: unknown) {
      if (e instanceof Error && e.message === "taken") {
        setError(t("nickname.taken"));
      } else {
        setError(t("common.errorTryAgain"));
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      overline={overline}
      headline={headline}
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
          showError ? "border-danger" : "border-us/40",
        )}
      >
        <span className="text-base font-semibold text-text-mute">@</span>
        <input
          autoFocus
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value.toLowerCase());
            if (error) setError(null);
          }}
          maxLength={20}
          className="flex-1 bg-transparent text-[17px] font-semibold text-text outline-none placeholder:text-text-mute"
          placeholder="tu apodo"
        />
        <span
          className={twMerge(
            "font-display text-[11px] font-semibold",
            draft.length > 18 ? "text-warning" : "text-text-mute",
          )}
        >
          {draft.length}/20
        </span>
      </div>

      <p
        className={twMerge(
          "mt-2 font-serif text-[11px] italic",
          showError ? "text-danger" : "text-text-mute",
        )}
      >
        {error ?? t("nickname.hint")}
      </p>
    </BottomSheet>
  );
}
