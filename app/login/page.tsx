"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLogin } from "@/hooks/useLogin";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import Suit from "@/components/ui/Suit";
import Logo from "@/components/ui/Logo";
import { toast } from "sonner";

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

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isLoading, handleLogin } = useLogin();
  const { register, handleSubmit } = useForm<LoginFields>();

  const onSubmit = async ({ username, password }: LoginFields) => {
    const success = await handleLogin(username, password);
    if (success) router.push("/");
  };

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

      {/* Decorative card — 1 de espada (right, front) */}
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

      {/* Decorative card — 7 de copa (left, back) */}
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
          {t("login.tagline")}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 w-full flex flex-col gap-2.5">
          <div className="bg-surface rounded-lg px-4 py-3 border border-border focus-within:border-us/50 transition-colors">
            <label
              htmlFor="username"
              className="text-caption-italic text-text-dim block cursor-pointer"
              style={{ fontFamily: "var(--font-crimson-pro), serif" }}
            >
              {t("login.username")}
            </label>
            <input
              id="username"
              type="text"
              {...register("username")}
              className="w-full bg-transparent text-text font-semibold text-[15px] mt-0.5 focus:outline-none"
              autoComplete="username"
              required
            />
          </div>

          <div className="bg-surface rounded-lg px-4 py-3 border border-border focus-within:border-us/50 transition-colors">
            <label
              htmlFor="password"
              className="text-caption-italic text-text-dim block cursor-pointer"
              style={{ fontFamily: "var(--font-crimson-pro), serif" }}
            >
              {t("login.password")}
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="w-full bg-transparent text-text font-semibold text-[15px] mt-0.5 tracking-widest focus:outline-none"
              autoComplete="current-password"
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
                {t("login.button")}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
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
        </form>
      </div>
      <Suspense>
        <OAuthErrorToast />
      </Suspense>
    </div>
  );
}
