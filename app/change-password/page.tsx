"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Logo from "@/components/ui/Logo";
import { getMe } from "@/services/auth";
import { fetchJSON } from "@/lib/fetchJSON";

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
      setError("Completá todos los campos");
      return;
    }
    if (newPwd !== confirmPwd) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (newPwd.length < 6) {
      setError("Mínimo 6 caracteres");
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
      toast.success("¡Contraseña actualizada! Bienvenido.");
      router.replace("/");
    } catch (e: unknown) {
      if (e instanceof Error && e.message === "wrong_password") {
        setError("Contraseña inicial incorrecta");
      } else if (e instanceof Error && e.message === "too_short") {
        setError("Mínimo 6 caracteres");
      } else {
        setError("Algo salió mal · probá de nuevo");
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
            primer ingreso
          </p>
          <h1
            className="mt-1 font-serif text-[22px] font-bold text-text"
          >
            Elegí tu contraseña
          </h1>
          <p className="mt-1 font-serif text-[13px] italic text-text-dim">
            La contraseña inicial es temporal · cambiala ahora
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-3"
      >
        <PasswordField
          label="Contraseña inicial (truco1234)"
          value={currentPwd}
          onChange={setCurrentPwd}
        />
        <PasswordField
          label="Nueva contraseña"
          value={newPwd}
          onChange={setNewPwd}
        />
        <PasswordField
          label="Confirmar contraseña"
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
          {saving ? "Guardando…" : "Cambiar contraseña"}
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
