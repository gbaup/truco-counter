"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Logo from "@/components/ui/Logo";
import { getMe } from "@/services/auth";
import { fetchJSON } from "@/lib/fetchJSON";
import { INITIAL_USER_PASSWORD } from "@/lib/constants";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function check() {
      const me = await getMe();
      if (!me) {
        router.replace("/login");
        return;
      }
      if (me.passwordChanged) {
        router.replace("/");
      }
    }
    check();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPwd || !newPwd || !confirmPwd) {
      setError("Please fill in all fields");
      return;
    }
    if (newPwd !== confirmPwd) {
      setError("Passwords do not match");
      return;
    }
    if (newPwd.length < 6) {
      setError("Minimum 6 characters");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await fetchJSON("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current: currentPwd, next: newPwd }),
      });
      toast.success("Password updated! Welcome.");
      router.replace("/");
    } catch (e: unknown) {
      if (e instanceof Error && e.message === "wrong_password") {
        setError("Incorrect initial password");
      } else if (e instanceof Error && e.message === "too_short") {
        setError("Minimum 6 characters");
      } else {
        setError("Something went wrong · please try again");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-text flex flex-col items-center justify-center px-6">
      <div className="mb-8 flex flex-col items-center gap-3">
        <Logo size={22} />
        <div className="text-center">
          <p
            className="font-serif text-[11px] italic tracking-[0.18em] text-text-mute"
          >
            first login
          </p>
          <h1
            className="mt-1 font-serif text-[22px] font-bold text-text"
          >
            Choose your password
          </h1>
          <p className="mt-1 font-serif text-[13px] italic text-text-dim">
            Your initial password is temporary · set a new one now
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-3"
      >
        <PasswordField
          label={`Initial password (${INITIAL_USER_PASSWORD})`}
          value={currentPwd}
          onChange={setCurrentPwd}
        />
        <PasswordField
          label="New password"
          value={newPwd}
          onChange={setNewPwd}
        />
        <PasswordField
          label="Confirm password"
          value={confirmPwd}
          onChange={setConfirmPwd}
        />

        {error && (
          <p className="font-serif text-[12px] italic text-danger">{error}</p>
        )}

        <button
          type="submit"
          disabled={saving || !currentPwd || !newPwd || !confirmPwd}
          className="mt-1 w-full rounded-2xl bg-us py-4 text-sm font-bold text-white shadow-[0_8px_20px_-10px_theme(colors.us)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
        >
          {saving ? "Saving…" : "Change password"}
        </button>
      </form>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3 focus-within:border-us/60 transition-colors">
      <label className="block font-serif text-[10px] italic tracking-[0.1em] text-text-mute">
        {label}
      </label>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-transparent text-[15px] font-semibold text-text outline-none"
      />
    </div>
  );
}
