"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={toggleMenu}
        className="fixed top-4 right-4 z-50 rounded-full bg-white/10 p-2 text-zinc-900 backdrop-blur-md transition-colors hover:bg-white/20 dark:text-white"
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

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 z-50 h-screen w-64 transform bg-white p-6 shadow-2xl transition-transform dark:bg-zinc-900 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <nav className="mt-16 flex flex-col space-y-4">
          <Link
            href="/"
            onClick={closeMenu}
            className={`text-lg font-medium transition-colors hover:text-primary-600 ${pathname === "/"
              ? "text-primary-600"
              : "text-zinc-600 dark:text-zinc-400"
              }`}
          >
            Home
          </Link>
          <Link
            href="/statistics"
            onClick={closeMenu}
            className={`text-lg font-medium transition-colors hover:text-primary-600 ${pathname === "/statistics"
              ? "text-primary-600"
              : "text-zinc-600 dark:text-zinc-400"
              }`}
          >
            Statistics
          </Link>
          <Link
            href="/versus"
            onClick={closeMenu}
            className={`text-lg font-medium transition-colors hover:text-primary-600 ${pathname === "/versus"
              ? "text-primary-600"
              : "text-zinc-600 dark:text-zinc-400"
              }`}
          >
            Versus
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
            className="text-left text-lg font-medium text-red-600 transition-colors hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
          >
            Logout
          </button>
        </nav>
      </div>
    </>
  );
}
