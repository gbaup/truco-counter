import { twMerge } from "tailwind-merge";
import { PublicUser } from "@/types/database";

interface UserDropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  users: PublicUser[];
  disabledId?: string;
  variant?: "us" | "them";
  placeholder?: string;
}

export default function UserDropdown({
  label,
  value,
  onChange,
  users,
  disabledId,
  variant = "us",
  placeholder = "Seleccionar",
}: UserDropdownProps) {
  const accentBorder = variant === "us" ? "border-us/40" : "border-them/40";
  const accentText = variant === "us" ? "text-us" : "text-them";

  return (
    <div className={twMerge("bg-surface rounded-xl border p-3", accentBorder)}>
      <p
        className={twMerge("text-caption-italic mb-2", accentText)}
        style={{ fontFamily: "var(--font-crimson-pro), serif", fontSize: 11, letterSpacing: "0.12em" }}
      >
        {label}
      </p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full capitalize bg-background border border-border rounded-lg px-3 py-2.5 text-text text-[13px] focus:outline-none focus:border-us/50 appearance-none"
        style={{ fontFamily: "var(--font-inter), system-ui" }}
      >
        <option value="">{placeholder}</option>
        {users.map((user) => (
          <option key={user.id} value={user.id} disabled={user.id === disabledId}>
            {user.username}
          </option>
        ))}
      </select>
    </div>
  );
}
