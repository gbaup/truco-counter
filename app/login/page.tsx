"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLogin } from "@/hooks/useLogin";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import Suit from "@/components/ui/Suit";
import Logo from "@/components/ui/Logo";
import { toast } from "sonner";
import { joinGroup } from "@/services/auth";
import OnboardingField from "@/components/onboarding/OnboardingField";
import PasswordField from "@/components/onboarding/PasswordField";
import Link from "next/link";

type LoginFields = {
  username: string;
  password: string;
};

function OAuthErrorToast() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (!error) return;
    const key = `login.errors.${error}`;
    const message = t(key, { defaultValue: t("login.errors.oauth_error") });
    toast.error(message);
    router.replace("/login");
  }, [searchParams, t, router]);

  return null;
}

function LoginForm() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isLoading, handleLogin } = useLogin();
  const { register, handleSubmit } = useForm<LoginFields>();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("token");

  const onSubmit = async ({ username, password }: LoginFields) => {
    const success = await handleLogin(username, password);
    if (!success) return;
    if (inviteToken) {
      const result = await joinGroup(inviteToken).catch(() => ({ success: false }));
      if (!result.success) toast.error(t("register.errors.joinFailed"));
    }
    router.push("/");
  };

  const registerHref = inviteToken ? `/register?token=${inviteToken}` : "/register";

  return (
    <div className="bg-background min-h-screen relative overflow-hidden flex flex-col">
      {/* felt glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 18% -5%, color-mix(in srgb, var(--color-them) 12%, transparent) 0%, transparent 60%), radial-gradient(ellipse 80% 45% at 85% 4%, color-mix(in srgb, var(--color-us) 13%, transparent) 0%, transparent 60%)",
        }}
      />

      {/* corner ace */}
      <div
        className="absolute bg-paper shadow-raised rounded-lg pointer-events-none"
        style={{
          top: 60,
          right: -28,
          width: 120,
          height: 172,
          transform: "rotate(16deg)",
          opacity: 0.62,
          padding: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          className="self-start text-paper-ink leading-none"
          style={{ fontFamily: "var(--font-crimson-pro), serif", fontSize: 26, fontWeight: 800 }}
        >
          1
        </span>
        <Suit kind="espada" size={42} color="#1A1410" />
        <span
          className="self-end text-paper-ink leading-none rotate-180"
          style={{ fontFamily: "var(--font-crimson-pro), serif", fontSize: 26, fontWeight: 800 }}
        >
          1
        </span>
      </div>

      <div className="relative mt-auto pb-12 px-6 flex flex-col items-center">
        <Logo size={42} />

        <p
          className="text-caption-italic text-text-dim mt-2"
          style={{ fontFamily: "var(--font-crimson-pro), serif" }}
        >
          {t("login.tagline")}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 w-full flex flex-col gap-2.5">
          <OnboardingField
            id="username"
            label={t("login.username")}
            {...register("username")}
            autoComplete="username"
            required
          />

          <PasswordField
            id="password"
            label={t("login.password")}
            {...register("password")}
            autoComplete="current-password"
            required
          />

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
                {t("login.button")}
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
              {t("login.orContinueWith")}
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <a
            href="/api/auth/google?action=login"
            className="w-full bg-surface border border-border rounded-lg py-3.5 text-text font-semibold text-[15px] flex items-center justify-center gap-2.5 active:scale-[0.98] transition-transform"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {t("login.googleButton")}
          </a>
          <p className="text-center text-sm text-text-dim mt-2">
            {t("login.noAccount")}{" "}
            <Link href={registerHref} className="text-us font-semibold">
              {t("login.registerLink")}
            </Link>
          </p>
        </form>
      </div>
      <Suspense>
        <OAuthErrorToast />
      </Suspense>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
