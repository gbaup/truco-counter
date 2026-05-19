"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import BottomSheet from "@/components/ui/BottomSheet";
import { updateMyUsername } from "@/services/userService";
import { toast } from "sonner";

const NICKNAME_RE = /^[a-z0-9_]{3,20}$/;

interface ChangeNicknameSheetProps {
  open: boolean;
  currentNickname: string;
  onClose: () => void;
  onSaved: (newNickname: string) => void;
  targetUser?: { id: string; displayName: string };
}

export default function ChangeNicknameSheet({
  open,
  currentNickname,
  onClose,
  onSaved,
  targetUser,
}: ChangeNicknameSheetProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState(currentNickname);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdminFlow = !!targetUser;
  const hasChanged = draft !== currentNickname;
  const isValid = NICKNAME_RE.test(draft);
  const showError = !!error || (hasChanged && !isValid);

  useEffect(() => {
    if (open) {
      setDraft(currentNickname);
      setError(null);
    }
  }, [open, currentNickname]);

  async function handleSubmit() {
    if (!isValid) {
      setError(t("nickname.hint"));
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await updateMyUsername(draft, targetUser?.id);
      toast.success(`ahora @${draft}`);
      onSaved(draft);
      onClose();
    } catch (e: unknown) {
      if (e instanceof Error && e.message === "taken") {
        setError(t("nickname.taken"));
      } else {
        setError("algo salió mal · probá de nuevo");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      overline={
        isAdminFlow
          ? t("nickname.overline.admin", { name: targetUser!.displayName })
          : t("nickname.overline.self")
      }
      headline={
        isAdminFlow ? t("nickname.headline.admin") : t("nickname.headline.self")
      }
      submitLabel="Guardar"
      submitDisabled={!isValid || !hasChanged}
      saving={saving}
      onSubmit={handleSubmit}
    >
      <div
        className={[
          "flex items-center gap-2.5 rounded-md border bg-background px-4 py-3.5 transition-colors",
          showError ? "border-danger" : "border-us/40",
        ].join(" ")}
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
          className={[
            "font-display text-[11px] font-semibold",
            draft.length > 18 ? "text-warning" : "text-text-mute",
          ].join(" ")}
        >
          {draft.length}/20
        </span>
      </div>

      <p
        className={[
          "mt-2 font-serif text-[11px] italic",
          showError ? "text-danger" : "text-text-mute",
        ].join(" ")}
      >
        {error ?? t("nickname.hint")}
      </p>
    </BottomSheet>
  );
}
