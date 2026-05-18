"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/useLogin";
import { useTranslation } from "react-i18next";
import Suit from "@/components/ui/Suit";
import Logo from "@/components/ui/Logo";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState<"username" | "password" | null>(null);

  const router = useRouter();
  const { t } = useTranslation();
  const { isLoading, handleLogin } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleLogin(username, password);
    if (success) {
      router.push("/");
    }
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

        <form onSubmit={handleSubmit} className="mt-10 w-full flex flex-col gap-2.5">
          <div
            className={[
              "bg-surface rounded-lg px-4 py-3 border transition-colors",
              focused === "username" ? "border-us/50" : "border-border",
            ].join(" ")}
          >
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setFocused("username")}
              onBlur={() => setFocused(null)}
              className="w-full bg-transparent text-text font-semibold text-[15px] mt-0.5 focus:outline-none"
              autoComplete="username"
              required
            />
          </div>

          <div
            className={[
              "bg-surface rounded-lg px-4 py-3 border transition-colors",
              focused === "password" ? "border-us/50" : "border-border",
            ].join(" ")}
          >
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
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
            {
              isLoading ? (
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
              )
            }
          </button >
        </form >
      </div >
    </div >
  );
}
