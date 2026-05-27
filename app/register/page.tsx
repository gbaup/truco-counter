"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRegister } from "@/hooks/useRegister";
import { useTranslation } from "react-i18next";
import Suit from "@/components/ui/Suit";
import Logo from "@/components/ui/Logo";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { joinGroup } from "@/services/auth";

type FocusedField = "name" | "lastName" | "username" | "email" | "password" | "confirmPassword" | null;

function RegisterForm() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [focused, setFocused] = useState<FocusedField>(null);

  const router = useRouter();
  const { t } = useTranslation();
  const { isLoading, handleRegister } = useRegister();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error(t("register.errors.passwordMismatch"));
      return;
    }

    if (password.length < 6) {
      toast.error(t("register.errors.passwordTooShort"));
      return;
    }

    const success = await handleRegister({
      name,
      lastName,
      username: username.trim().toLowerCase(),
      email: email.trim() || undefined,
      password,
    });

    if (!success) return;

    if (inviteToken) {
      const joinResult = await joinGroup(inviteToken);
      if (!joinResult.success) {
        toast.error(t("register.errors.joinFailed"));
      }
    }

    router.push("/groups/new");
  };

  const usernameHint = username.length > 0
    ? (/^[a-z0-9_]{3,20}$/.test(username.trim().toLowerCase()) ? null : t("register.usernameHint"))
    : t("register.usernameHint");

  return (
    <div className="bg-background min-h-screen relative overflow-hidden flex flex-col">
      <div
        className="absolute top-0 left-0 w-80 h-80 bg-them opacity-20 rounded-full pointer-events-none"
        style={{ filter: "blur(120px)", transform: "translate(-30%, -30%)" }}
      />
      <div
        className="absolute bottom-0 right-0 w-80 h-80 bg-us opacity-20 rounded-full pointer-events-none"
        style={{ filter: "blur(120px)", transform: "translate(30%, 30%)" }}
      />

      {/* Decorative card — 1 de espada */}
      <div
        className="absolute bg-paper shadow-raised rounded-lg pointer-events-none"
        style={{
          top: 90,
          right: -40,
          width: 140,
          height: 200,
          transform: "rotate(18deg)",
          padding: 14,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          className="self-start text-paper-ink leading-none"
          style={{ fontFamily: "var(--font-crimson-pro), serif", fontSize: 30, fontWeight: 800 }}
        >
          1
        </span>
        <Suit kind="espada" size={50} color="#1A1410" />
        <span
          className="self-end text-paper-ink leading-none rotate-180"
          style={{ fontFamily: "var(--font-crimson-pro), serif", fontSize: 30, fontWeight: 800 }}
        >
          1
        </span>
      </div>

      {/* Decorative card — 7 de copa */}
      <div
        className="absolute bg-paper shadow-raised rounded-lg pointer-events-none opacity-70"
        style={{
          top: 130,
          left: -50,
          width: 140,
          height: 200,
          transform: "rotate(-15deg)",
          padding: 14,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          className="self-start text-paper-ink leading-none"
          style={{ fontFamily: "var(--font-crimson-pro), serif", fontSize: 30, fontWeight: 800 }}
        >
          7
        </span>
        <Suit kind="copa" size={50} color="#1A1410" />
        <span
          className="self-end text-paper-ink leading-none rotate-180"
          style={{ fontFamily: "var(--font-crimson-pro), serif", fontSize: 30, fontWeight: 800 }}
        >
          7
        </span>
      </div>

      <div className="relative mt-auto pb-12 px-6 flex flex-col items-center">
        <Logo size={42} />

        <p
          className="text-caption-italic text-text-dim mt-2"
          style={{ fontFamily: "var(--font-crimson-pro), serif" }}
        >
          {t("register.tagline")}
        </p>

        <form onSubmit={handleSubmit} className="mt-10 w-full flex flex-col gap-2.5">
          <div className="flex gap-2.5">
            <div
              className={twMerge(
                "flex-1 bg-surface rounded-lg px-4 py-3 border transition-colors",
                focused === "name" ? "border-us/50" : "border-border"
              )}
            >
              <label
                htmlFor="name"
                className="text-caption-italic text-text-dim block cursor-pointer"
                style={{ fontFamily: "var(--font-crimson-pro), serif" }}
              >
                {t("register.name")}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused(null)}
                className="w-full bg-transparent text-text font-semibold text-[15px] mt-0.5 focus:outline-none"
                autoComplete="given-name"
                required
              />
            </div>

            <div
              className={twMerge(
                "flex-1 bg-surface rounded-lg px-4 py-3 border transition-colors",
                focused === "lastName" ? "border-us/50" : "border-border"
              )}
            >
              <label
                htmlFor="lastName"
                className="text-caption-italic text-text-dim block cursor-pointer"
                style={{ fontFamily: "var(--font-crimson-pro), serif" }}
              >
                {t("register.lastName")}
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onFocus={() => setFocused("lastName")}
                onBlur={() => setFocused(null)}
                className="w-full bg-transparent text-text font-semibold text-[15px] mt-0.5 focus:outline-none"
                autoComplete="family-name"
                required
              />
            </div>
          </div>

          <div
            className={twMerge(
              "bg-surface rounded-lg px-4 py-3 border transition-colors",
              focused === "username" ? "border-us/50" : "border-border"
            )}
          >
            <label
              htmlFor="username"
              className="text-caption-italic text-text-dim block cursor-pointer"
              style={{ fontFamily: "var(--font-crimson-pro), serif" }}
            >
              {t("register.username")}
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              onFocus={() => setFocused("username")}
              onBlur={() => setFocused(null)}
              className="w-full bg-transparent text-text font-semibold text-[15px] mt-0.5 focus:outline-none"
              autoComplete="username"
              required
            />
            {usernameHint && (
              <p className="text-xs text-text-dim mt-1">{usernameHint}</p>
            )}
          </div>

          <div
            className={twMerge(
              "bg-surface rounded-lg px-4 py-3 border transition-colors",
              focused === "email" ? "border-us/50" : "border-border"
            )}
          >
            <label
              htmlFor="email"
              className="text-caption-italic text-text-dim block cursor-pointer"
              style={{ fontFamily: "var(--font-crimson-pro), serif" }}
            >
              {t("register.email")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              className="w-full bg-transparent text-text font-semibold text-[15px] mt-0.5 focus:outline-none"
              autoComplete="email"
            />
          </div>

          <div
            className={twMerge(
              "bg-surface rounded-lg px-4 py-3 border transition-colors",
              focused === "password" ? "border-us/50" : "border-border"
            )}
          >
            <label
              htmlFor="password"
              className="text-caption-italic text-text-dim block cursor-pointer"
              style={{ fontFamily: "var(--font-crimson-pro), serif" }}
            >
              {t("register.password")}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              className="w-full bg-transparent text-text font-semibold text-[15px] mt-0.5 tracking-widest focus:outline-none"
              autoComplete="new-password"
              required
            />
          </div>

          <div
            className={twMerge(
              "bg-surface rounded-lg px-4 py-3 border transition-colors",
              focused === "confirmPassword" ? "border-us/50" : "border-border"
            )}
          >
            <label
              htmlFor="confirmPassword"
              className="text-caption-italic text-text-dim block cursor-pointer"
              style={{ fontFamily: "var(--font-crimson-pro), serif" }}
            >
              {t("register.confirmPassword")}
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setFocused("confirmPassword")}
              onBlur={() => setFocused(null)}
              className="w-full bg-transparent text-text font-semibold text-[15px] mt-0.5 tracking-widest focus:outline-none"
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-1 w-full bg-us text-white rounded-lg py-4 text-base font-bold flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] transition-transform"
          >
            {isLoading ? (
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <>
                {t("register.button")}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>

          <div className="flex items-center gap-3 mt-2">
            <div className="flex-1 h-px bg-border" />
            <span
              className="text-caption-italic text-text-dim"
              style={{ fontFamily: "var(--font-crimson-pro), serif" }}
            >
              {t("register.orContinueWith")}
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <a
            href="/api/auth/google?action=register"
            className="w-full bg-surface border border-border rounded-lg py-3.5 text-text font-semibold text-[15px] flex items-center justify-center gap-2.5 active:scale-[0.98] transition-transform"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {t("register.googleButton")}
          </a>

          <p className="text-center text-sm text-text-dim mt-2">
            {t("register.alreadyHaveAccount")}{" "}
            <Link href="/login" className="text-us font-semibold">
              {t("register.loginLink")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
