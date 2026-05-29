"use client";

import { AdminUser } from "@/types/database";
import PlayerAvatar from "@/components/ui/PlayerAvatar";
import { PencilIcon } from "@/components/ui/icons";

interface AdminUserRowProps {
  user: AdminUser;
  onEdit: (user: AdminUser) => void;
}

export default function AdminUserRow({ user, onEdit }: AdminUserRowProps) {
  return (
    <li className="flex items-center gap-3 rounded-lg bg-surface px-3 py-2.5 border border-border">
      <PlayerAvatar
        name={user.name || user.username}
        lastName={user.last_name}
        style={{
          border: "1px solid transparent",
          background:
            "linear-gradient(var(--color-surface-elevated), var(--color-surface-elevated)) padding-box, linear-gradient(135deg, var(--color-us), var(--color-them)) border-box",
        }}
      />

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
        <PencilIcon size={14} />
      </button>
    </li>
  );
}
