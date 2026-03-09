"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "react-i18next";

export default function SideDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={toggleMenu}
        className="fixed top-4 right-4 z-50 rounded-full bg-white/10 p-2 text-white backdrop-blur-md transition-colors hover:bg-white/20"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={closeMenu}
        />
      )}

      <div
        className={twMerge("fixed top-0 right-0 z-50 h-screen w-64 transform bg-zinc-900 p-6 shadow-2xl transition-transform", isOpen ? "translate-x-0" : "translate-x-full")}
      >
        <nav className="mt-16 flex flex-col space-y-4">
          <Link
            href="/"
            onClick={closeMenu}
            className={twMerge("text-lg font-medium transition-colors hover:text-primary-600", pathname === "/" ? "text-primary-600" : "text-zinc-400")}
          >
            {t("sideDrawer.home")}
          </Link>
          <Link
            href="/statistics"
            onClick={closeMenu}
            className={twMerge("text-lg font-medium transition-colors hover:text-primary-600", pathname === "/statistics" ? "text-primary-600" : "text-zinc-400")}
          >
            {t("sideDrawer.statistics")}
          </Link>
          <Link
            href="/versus"
            onClick={closeMenu}
            className={twMerge("text-lg font-medium transition-colors hover:text-primary-600", pathname === "/versus" ? "text-primary-600" : "text-zinc-400")}
          >
            {t("sideDrawer.versus")}
          </Link>
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
            className="text-left text-lg font-medium text-red-500 transition-colors hover:text-red-400"
          >
            {t("sideDrawer.logout")}
          </button>
        </nav>
      </div>
    </>
  );
}
