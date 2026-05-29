"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "react-i18next";
import Logo from "@/components/ui/Logo";
import Suit from "@/components/ui/Suit";
import PaperPanel from "@/components/ui/PaperPanel";
import RoleBadge from "@/components/admin/RoleBadge";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useActiveGroup } from "@/hooks/useActiveGroup";
import { MenuIcon, CloseIcon, ArrowRightIcon, LockIcon } from "@/components/ui/icons";
import { UserRole } from "@/types/auth";

interface SideDrawerProps {
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
  const { data: me } = useCurrentUser();
  const { activeGroupId, activeGroup, setActiveGroup, groups, isFreePlay } = useActiveGroup();
  const username = me?.username ?? null;
  const role = (me?.role as UserRole) ?? null;
  const isGroupAdmin = groups.some((g) => g.admin_id === me?.userId);
  const pathname = usePathname();
  const { t } = useTranslation();

  const isControlled = externalOpen !== undefined;
  const isOpen = isControlled ? externalOpen : internalOpen;
  const toggleMenu = onToggle ?? (() => setInternalOpen((v) => !v));
  const closeMenu = externalClose ?? (() => setInternalOpen(false));

  const FREE_PLAY_ALLOWED = new Set(["/", "/settings"]);

  const navItems = [
    { href: "/", label: t("sideDrawer.home") },
    { href: "/profile", label: t("sideDrawer.profile") },
    { href: "/statistics", label: t("sideDrawer.statistics") },
    { href: "/versus", label: t("sideDrawer.versus") },
    { href: "/history", label: t("sideDrawer.history") },
    { href: "/settings", label: t("sideDrawer.settings") },
  ];

  return (
    <>
      {!isControlled && (
        <button
          onClick={toggleMenu}
          className="fixed top-4 right-4 z-50 w-9 h-9 rounded-md bg-surface border border-border text-text flex items-center justify-center transition-colors hover:bg-surface-elevated"
          aria-label="Toggle menu"
        >
          <MenuIcon size={16} />
        </button>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={closeMenu}
        />
      )}

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
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <Logo size={18} />
          <button
            onClick={closeMenu}
            className="w-8 h-8 rounded-full bg-surface border border-border text-text-dim flex items-center justify-center transition-colors hover:bg-surface-elevated"
            aria-label="Cerrar menú"
          >
            <CloseIcon size={14} />
          </button>
        </div>

        {/* Player card */}
        <PaperPanel lines={false} className="mb-5">
          <div className="flex items-center gap-2.5">
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

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <div
                  className="text-paper-ink font-bold truncate"
                  style={{ fontFamily: "var(--font-crimson-pro), serif", fontSize: 15 }}
                >
                  {username ?? "—"}
                </div>
                {role === UserRole.admin && (
                  <RoleBadge>{t("roleBadge.admin")}</RoleBadge>
                )}
              </div>
              <div
                className="text-caption-italic mt-0.5"
                style={{ color: "rgba(26, 20, 16, 0.67)", fontSize: 11 }}
              >
                el de la mesa
              </div>
            </div>

            <Suit kind="espada" size={20} color="#1A1410" className="shrink-0" />
          </div>
        </PaperPanel>

        {/* Group selector */}
        {groups.length > 0 && (
          <div className="mb-4">
            <p
              className="text-caption-italic text-text-mute mb-1.5"
              style={{ fontFamily: "var(--font-crimson-pro), serif", fontSize: 11 }}
            >
              {t("sideDrawer.group")}
            </p>
            {groups.length === 1 ? (
              <div
                className="px-3.5 py-2 rounded-md bg-surface border border-border text-sm text-text font-medium truncate"
              >
                {activeGroup?.name}
              </div>
            ) : (
              <select
                value={activeGroupId ?? ""}
                onChange={(e) => setActiveGroup(e.target.value)}
                className="w-full px-3.5 py-2 rounded-md bg-surface border border-border text-sm text-text font-medium appearance-none cursor-pointer"
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            )}
          </div>
        )}

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
            const isLocked = isFreePlay && !FREE_PLAY_ALLOWED.has(href);

            if (isLocked) {
              return (
                <div
                  key={href}
                  className="flex items-center justify-between px-3.5 py-3 rounded-md border border-transparent cursor-not-allowed select-none opacity-40"
                >
                  <span className="text-sm text-text font-medium">{label}</span>
                  <LockIcon size={12} className="text-text-mute" />
                </div>
              );
            }

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
                {isActive && <ArrowRightIcon size={14} />}
              </Link>
            );
          })}
        </nav>

        {/* Admin section */}
        {(role === UserRole.admin || isGroupAdmin) && (
          <div className="mt-4">
            <p
              className="text-caption-italic text-text-mute mb-1.5"
              style={{ fontFamily: "var(--font-crimson-pro), serif", fontSize: 10 }}
            >
              {t("sideDrawer.admin")}
            </p>
            <Link
              href="/admin"
              onClick={closeMenu}
              className={twMerge(
                "flex items-center justify-between px-3.5 py-3 rounded-md text-sm transition-colors",
                pathname === "/admin"
                  ? "bg-us/20 border border-us/40 text-us font-bold"
                  : "border border-transparent text-text font-medium hover:bg-surface"
              )}
            >
              <span>{t("sideDrawer.admin")}</span>
              <RoleBadge soft>{t("roleBadge.admin")}</RoleBadge>
            </Link>
          </div>
        )}

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
