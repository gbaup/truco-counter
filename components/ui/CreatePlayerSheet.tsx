"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import BottomSheet from "@/components/ui/BottomSheet";
import Suit from "@/components/ui/Suit";
import { useCreatePlayer } from "@/hooks/useCreatePlayer";
import { toast } from "sonner";
import { USERNAME_RE, NAME_RE } from "@/lib/validators";
import { INITIAL_USER_PASSWORD } from "@/lib/constants";
import { twMerge } from "tailwind-merge";

interface CreatePlayerSheetProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreatePlayerSheet({
  open,
  onClose,
  onCreated,
}: CreatePlayerSheetProps) {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const createPlayerMutation = useCreatePlayer();

  const canSubmit =
    NAME_RE.test(firstName) && NAME_RE.test(lastName) && USERNAME_RE.test(username);
  const saving = createPlayerMutation.isPending;

  async function handleSubmit() {
    setErrors({});
    try {
      await createPlayerMutation.mutateAsync({ firstName, lastName, username });
      toast.success(t("create.savedToast", { name: username }));
      onCreated();
      onClose();
    } catch (e: unknown) {
      const err = e as Error & { field?: string };
      if (err.field === "username" && err.message === "taken") {
        setErrors({ username: t("create.usernameTaken", { name: username }) });
      } else {
        setErrors({ _: t("create.errorCreating") });
      }
    }
  }

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      overline={t("create.overline")}
      headline={t("create.headline")}
      submit={{
        label: t("create.submit"),
        onSubmit: handleSubmit,
        disabled: !canSubmit,
        saving,
      }}
    >
      {/* Live preview */}
      <div className="mb-4 flex items-center gap-3 rounded-lg bg-gradient-to-br from-paper to-paper-shade px-3.5 py-3 shadow-card">
        <div className="flex h-12 w-9 shrink-0 flex-col items-center justify-center rounded-sm bg-paper-ink">
          <span className="self-start ml-1 font-serif text-[13px] font-extrabold text-paper">
            1
          </span>
          <Suit kind="espada" size={14} color="#F4ECDB" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-serif text-[10px] italic tracking-[0.12em] text-paper-ink/60">
            {t("create.preview")}
          </p>
          <p className="font-serif text-base font-bold leading-tight text-paper-ink">
            {firstName || "Martín"} {lastName || "Pérez"}
          </p>
          <p className="mt-0.5 font-display text-[11px] text-paper-ink/60">
            @{username || "apodo"}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <FieldInput
          label={t("create.firstName")}
          value={firstName}
          onChange={(v) => setFirstName(v.toLowerCase())}
          placeholder="martín"
          maxLength={30}
        />
        <FieldInput
          label={t("create.lastName")}
          value={lastName}
          onChange={(v) => setLastName(v.toLowerCase())}
          placeholder="pérez"
          maxLength={30}
        />
        <FieldInput
          label={t("create.username")}
          value={username}
          onChange={(v) => setUsername(v.toLowerCase().replace(/\s/g, ""))}
          placeholder="tincho"
          prefix="@"
          maxLength={20}
          error={errors.username}
        />
      </div>

      <div className="mt-3.5 flex items-start gap-2.5 rounded-md border border-warning/40 bg-warning/[0.12] px-3 py-2.5">
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mt-0.5 shrink-0 text-warning"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <div>
          <p className="text-xs font-bold text-warning">
            {t("create.passwordInfo")}:{" "}
            <span className="font-display">{INITIAL_USER_PASSWORD}</span>
          </p>
          <p className="mt-0.5 font-serif text-[11px] italic text-text-dim">
            {t("create.passwordHint")}
          </p>
        </div>
      </div>

      {errors._ && (
        <p className="mt-2 font-serif text-xs italic text-danger">{errors._}</p>
      )}
    </BottomSheet>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  placeholder,
  prefix,
  maxLength,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  prefix?: string;
  maxLength?: number;
  error?: string;
}) {
  return (
    <div>
      <div
        className={twMerge(
          "rounded-md border bg-background px-4 py-2.5",
          error
            ? "border-danger"
            : "border-border focus-within:border-us/60",
        )}
      >
        <label className="block font-serif text-[10px] italic tracking-[0.1em] text-text-mute">
          {label}
        </label>
        <div className="mt-0.5 flex items-center">
          {prefix && (
            <span className="mr-1 text-base font-semibold text-text-mute">
              {prefix}
            </span>
          )}
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className="flex-1 bg-transparent text-[15px] font-semibold text-text outline-none placeholder:text-text-mute"
          />
        </div>
      </div>
      {error && (
        <p className="mt-1 font-serif text-[11px] italic text-danger">{error}</p>
      )}
    </div>
  );
}
