"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "react-i18next";
import Logo from "@/components/ui/Logo";
import Suit from "@/components/ui/Suit";
import PaperPanel from "@/components/ui/PaperPanel";
import { getMe } from "@/services/auth";

interface SideDrawerProps {
  /** When provided, activates controlled mode — the built-in toggle button is hidden. */
  isOpen?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}

export default function SideDrawer({
  isOpen: externalOpen,
  onToggle,
  onClose: externalClose,
}: SideDrawerProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const pathname = usePathname();
  const { t } = useTranslation();

  const isControlled = externalOpen !== undefined;
  const isOpen = isControlled ? externalOpen : internalOpen;
  const toggleMenu = onToggle ?? (() => setInternalOpen((v) => !v));
  const closeMenu = externalClose ?? (() => setInternalOpen(false));

  useEffect(() => {
    getMe().then((me) => {
      if (me) setUsername(me.username);
    });
  }, []);

  const navItems = [
    { href: "/", label: t("sideDrawer.home") },
    { href: "/profile", label: t("sideDrawer.profile") },
    { href: "/statistics", label: t("sideDrawer.statistics") },
    { href: "/versus", label: t("sideDrawer.versus") },
    { href: "/history", label: t("sideDrawer.history") },
  ];

  return (
    <>
      {/* Built-in toggle button — only shown in uncontrolled (self-managed) mode */}
      {!isControlled && (
        <button
          onClick={toggleMenu}
          className="fixed top-4 right-4 z-50 w-9 h-9 rounded-md bg-surface border border-border text-text flex items-center justify-center transition-colors hover:bg-surface-elevated"
          aria-label="Toggle menu"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={closeMenu}
        />
      )}

      {/* Drawer panel */}
      <div
        className={twMerge(
          "fixed top-0 right-0 z-50 h-screen flex flex-col border-l border-border shadow-2xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{
          width: 290,
          background: "linear-gradient(180deg, #111613 0%, #0D100E 100%)",
          padding: "60px 20px 28px",
        }}
      >
        {/* Header: logo + close button */}
        <div className="flex items-center justify-between mb-5">
          <Logo size={18} />
          <button
            onClick={closeMenu}
            className="w-8 h-8 rounded-full bg-surface border border-border text-text-dim flex items-center justify-center transition-colors hover:bg-surface-elevated"
            aria-label="Cerrar menú"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Player card */}
        <PaperPanel lines={false} className="mb-5">
          <div className="flex items-center gap-2.5">
            {/* Mini "1 de espada" card */}
            <div
              className="w-[38px] h-[50px] bg-paper-ink rounded-[6px] flex items-center justify-center shrink-0"
              style={{
                fontFamily: "var(--font-crimson-pro), serif",
                fontWeight: 800,
                fontSize: 18,
                color: "var(--color-paper)",
              }}
            >
              1
            </div>

            {/* Username + tagline */}
            <div className="flex-1 min-w-0">
              <div
                className="text-paper-ink font-bold truncate"
                style={{ fontFamily: "var(--font-crimson-pro), serif", fontSize: 15 }}
              >
                {username ?? "—"}
              </div>
              <div
                className="text-caption-italic mt-0.5"
                style={{ color: "rgba(26, 20, 16, 0.67)", fontSize: 11 }}
              >
                el de la mesa
              </div>
            </div>

            {/* Espada pip */}
            <Suit kind="espada" size={20} color="#1A1410" className="shrink-0" />
          </div>
        </PaperPanel>

        {/* Section label */}
        <p
          className="text-caption-italic text-text-mute mb-2.5"
          style={{ fontFamily: "var(--font-crimson-pro), serif", fontSize: 11 }}
        >
          en la mesa
        </p>

        {/* Nav items */}
        <nav className="flex flex-col gap-0.5">
          {navItems.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                className={twMerge(
                  "flex items-center justify-between px-3.5 py-3 rounded-md text-sm transition-colors",
                  isActive
                    ? "bg-us/20 border border-us/40 text-us font-bold"
                    : "border border-transparent text-text font-medium hover:bg-surface"
                )}
              >
                <span>{label}</span>
                {isActive && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* Logout */}
        <button
          onClick={async () => {
            try {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/login";
            } catch (error) {
              console.error("Logout failed", error);
            }
            closeMenu();
          }}
          className="w-full px-3.5 py-3 rounded-md border border-danger/30 text-danger text-[13px] italic text-center transition-colors hover:bg-danger/5"
          style={{ fontFamily: "var(--font-crimson-pro), serif" }}
        >
          {t("sideDrawer.logout")}
        </button>
      </div>
    </>
  );
}
