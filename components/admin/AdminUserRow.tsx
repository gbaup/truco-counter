"use client";

import { AdminUser } from "@/types/database";

interface AdminUserRowProps {
  user: AdminUser;
  onEdit: (user: AdminUser) => void;
}

function PencilIcon() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

export default function AdminUserRow({ user, onEdit }: AdminUserRowProps) {
  const nameInitial = (user.name?.[0] ?? user.username?.[0] ?? "").toUpperCase();
  const lastnameInitial = (user.last_name?.[0] ?? "").toUpperCase();

  return (
    <li className="flex items-center gap-3 rounded-lg bg-surface px-3 py-2.5 border border-border">
      {/* Avatar */}
      <div
        className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full"
        style={{
          background: "linear-gradient(135deg, var(--color-us), var(--color-them))",
        }}
      >
        <span
          className="text-white"
          style={{
            fontFamily: "var(--font-crimson-pro), serif",
            fontWeight: 800,
            fontSize: 16,
          }}
        >
          {nameInitial + lastnameInitial}
        </span>
      </div>

      {/* Name + username */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] capitalize font-semibold text-text">
          {user.name} {user.last_name}
        </p>
        <p className="font-display text-[11px] font-medium text-text-dim">
          @{user.username}
        </p>
      </div>

      {/* Rating */}
      <div className="shrink-0 text-right">
        <p
          className="font-serif text-[9px] italic text-text-mute"
        >
          glicko
        </p>
        <p className="font-display text-[14px] font-extrabold text-text">
          {Math.round(user.rating)}
        </p>
      </div>

      {/* Edit button */}
      <button
        onClick={() => onEdit(user)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-text-dim transition-colors hover:bg-surface-elevated active:scale-95"
        aria-label={`Editar @${user.username}`}
      >
        <PencilIcon />
      </button>
    </li>
  );
}
