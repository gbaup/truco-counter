"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import SideDrawer from "@/components/SideDrawer";
import Logo from "@/components/ui/Logo";
import MenuIcon from "@/components/ui/MenuIcon";
import BottomSheet from "@/components/ui/BottomSheet";
import ChangeNicknameSheet from "@/components/ui/ChangeNicknameSheet";
import SettingsSection from "@/components/settings/SettingsSection";
import SettingsRow from "@/components/settings/SettingsRow";
import { fetchJSON } from "@/lib/fetchJSON";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUnlinkGoogle } from "@/hooks/useUnlinkGoogle";
import { useUpdateMyUsername } from "@/hooks/useUpdateMyUsername";

function getPref(key: string, defaultValue: boolean): boolean {
  if (typeof window === "undefined") return defaultValue;
  const raw = localStorage.getItem(`prefs.${key}`);
  return raw === null ? defaultValue : raw === "true";
}

function setPref(key: string, value: boolean) {
  localStorage.setItem(`prefs.${key}`, String(value));
}

export default function SettingsPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const { data: me, isPending: meLoading } = useCurrentUser();
  const unlinkMutation = useUnlinkGoogle();
  const updateMine = useUpdateMyUsername();

  const [drawerOpen, setDrawerOpen] = useState(false);

  // Sheets
  const [nicknameSheetOpen, setNicknameSheetOpen] = useState(false);
  const [passwordSheetOpen, setPasswordSheetOpen] = useState(false);

  // Password form
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [changingPwd, setChangingPwd] = useState(false);

  // Preferences
  const [haptics, setHaptics] = useState(true);
  const [sound, setSound] = useState(false);

  useEffect(() => {
    setHaptics(getPref("haptics", true));
    setSound(getPref("sound", false));
  }, []);

  useEffect(() => {
    if (!meLoading && !me) router.replace("/login");
  }, [me, meLoading, router]);

  const username = me?.username ?? "";
  const googleLinked = me?.googleLinked ?? false;
  const unlinking = unlinkMutation.isPending;

  async function handleUnlink() {
    const result = await unlinkMutation.mutateAsync();
    if (result.success) {
      toast.success(t("settings.googleUnlinkSuccess"));
    } else {
      toast.error(t("settings.googleUnlinkError"));
    }
  }

  async function handleChangePassword() {
    if (!currentPwd || !newPwd || !confirmPwd) {
      setPwdError(t("settings.password.errors.required"));
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdError(t("settings.password.errors.mismatch"));
      return;
    }
    if (newPwd.length < 6) {
      setPwdError(t("settings.password.errors.tooShort"));
      return;
    }
    setChangingPwd(true);
    setPwdError(null);
    try {
      await fetchJSON("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current: currentPwd, next: newPwd }),
      });
      toast.success(t("settings.password.savedToast"));
      setPasswordSheetOpen(false);
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
    } catch (e: unknown) {
      if (e instanceof Error && e.message === "wrong_password") {
        setPwdError(t("settings.password.errors.wrong"));
      } else {
        setPwdError(t("common.errorTryAgain"));
      }
    } finally {
      setChangingPwd(false);
    }
  }

  const localeLabel =
    process.env.NEXT_PUBLIC_APP_LANG === "es-coloquial"
      ? t("settings.locale.coloquial")
      : t("settings.locale.formal");

  return (
    <div className="min-h-screen bg-background text-text">
      <SideDrawer
        isOpen={drawerOpen}
        onToggle={() => setDrawerOpen((v) => !v)}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-3">
        <Logo size={18} />
        <span
          className="text-caption-italic text-text"
          style={{ fontFamily: "var(--font-crimson-pro), serif" }}
        >
          {t("sideDrawer.settings")}
        </span>
        <button
          onClick={() => setDrawerOpen(true)}
          className="w-9 h-9 rounded-lg bg-surface border border-border text-text-dim flex items-center justify-center transition-colors hover:bg-surface-elevated"
          aria-label="Menú"
        >
          <MenuIcon />
        </button>
      </div>

      <main className="px-5 pb-[18px] flex flex-col gap-4">
        {/* Cuenta */}
        <SettingsSection title={t("settings.account.title")}>
          <SettingsRow
            label={t("settings.account.nickname")}
            value={`@${username}`}
            isMono
            action={t("settings.change")}
            onAction={() => setNicknameSheetOpen(true)}
          />
          <SettingsRow
            label={t("settings.account.password")}
            value="••••••••"
            action={t("settings.change")}
            onAction={() => {
              setCurrentPwd("");
              setNewPwd("");
              setConfirmPwd("");
              setPwdError(null);
              setPasswordSheetOpen(true);
            }}
          />
          {/* Google row — custom layout for icon */}
          <div className="flex items-center justify-between bg-surface px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <div>
                <p className="text-sm font-medium text-text">{t("settings.account.google")}</p>
                <p className="mt-0.5 text-xs text-text-dim">
                  {googleLinked ? t("profile.google.linked") : t("profile.google.notLinked")}
                </p>
              </div>
            </div>
            {googleLinked ? (
              <button
                onClick={handleUnlink}
                disabled={unlinking}
                className="ml-3 shrink-0 text-xs font-semibold text-danger disabled:opacity-50"
              >
                {t("settings.unlink")}
              </button>
            ) : (
              <a
                href="/api/auth/google?action=link"
                className="ml-3 shrink-0 text-xs font-semibold text-us"
              >
                {t("settings.change")}
              </a>
            )}
          </div>
        </SettingsSection>

        {/* Preferencias */}
        <SettingsSection title={t("settings.preferences.title")}>
          <SettingsRow
            label={t("settings.preferences.language")}
            value={localeLabel}
            action="→"
            onAction={() => toast.info(t("common.comingSoon"))}
          />
          <SettingsRow
            label={t("settings.preferences.haptics")}
            toggle
            on={haptics}
            onChange={(v) => {
              setHaptics(v);
              setPref("haptics", v);
            }}
          />
          <SettingsRow
            label={t("settings.preferences.sound")}
            toggle
            on={sound}
            onChange={(v) => {
              setSound(v);
              setPref("sound", v);
            }}
            isLastInGroup
          />
        </SettingsSection>

        {/* Peligroso */}
        <SettingsSection title={t("settings.danger.title")} danger>
          <SettingsRow
            label={t("settings.danger.logout")}
            value={t("settings.danger.logoutHint")}
            action={t("settings.danger.logoutAction")}
            danger
            onAction={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/login";
            }}
            isLastInGroup
          />
        </SettingsSection>
      </main>

      {/* Nickname sheet */}
      <ChangeNicknameSheet
        key={nicknameSheetOpen ? "open" : "closed"}
        open={nicknameSheetOpen}
        currentNickname={username}
        overline={t("nickname.overline.self")}
        headline={t("nickname.headline.self")}
        onSave={(draft) => updateMine.mutateAsync(draft)}
        onClose={() => setNicknameSheetOpen(false)}
        onSaved={() => setNicknameSheetOpen(false)}
      />

      {/* Password change sheet */}
      <BottomSheet
        open={passwordSheetOpen}
        onClose={() => setPasswordSheetOpen(false)}
        overline={t("settings.password.overline")}
        headline={t("settings.password.headline")}
        submit={{
          label: t("common.save"),
          onSubmit: handleChangePassword,
          disabled: !currentPwd || !newPwd || !confirmPwd,
          saving: changingPwd,
        }}
      >
        <div className="flex flex-col gap-2.5">
          <PasswordInput
            label={t("settings.password.fields.current")}
            value={currentPwd}
            onChange={setCurrentPwd}
          />
          <PasswordInput
            label={t("settings.password.fields.new")}
            value={newPwd}
            onChange={setNewPwd}
          />
          <PasswordInput
            label={t("settings.password.fields.confirm")}
            value={confirmPwd}
            onChange={setConfirmPwd}
          />
        </div>
        {pwdError && (
          <p className="mt-2 font-serif text-[11px] italic text-danger">{pwdError}</p>
        )}
      </BottomSheet>
    </div>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-md border border-border bg-background px-4 py-2.5 focus-within:border-us/60">
      <label className="block font-serif text-[10px] italic tracking-[0.1em] text-text-mute">
        {label}
      </label>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-0.5 w-full bg-transparent text-[15px] font-semibold text-text outline-none"
      />
    </div>
  );
}
