import { twMerge } from "tailwind-merge";

interface SettingsSectionProps {
  title: string;
  danger?: boolean;
  children: React.ReactNode;
}

export default function SettingsSection({ title, danger, children }: SettingsSectionProps) {
  return (
    <div>
      <p
        className="mb-2 font-serif text-[11px] italic tracking-[0.14em] text-text-mute"
      >
        {title}
      </p>
      <div
        className={twMerge(
          "overflow-hidden rounded-xl border",
          danger ? "border-danger/30" : "border-border",
        )}
      >
        {children}
      </div>
    </div>
  );
}
