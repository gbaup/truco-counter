interface PlayerChipProps {
    label: string;
    variant: "primary" | "secondary";
}

export default function PlayerChip({ label, variant }: PlayerChipProps) {
    const isPrimary = variant === "primary";

    const chipBg = isPrimary ? "bg-primary-500/15" : "bg-secondary-500/15";
    const chipBorder = isPrimary
        ? "border-primary-500/30"
        : "border-secondary-500/30";
    const chipText = isPrimary ? "text-primary-300" : "text-secondary-300";

    return (
        <span
            className={`inline-flex capitalize items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${chipBg} ${chipBorder} ${chipText}`}
        >
            {label}
        </span>
    );
}
