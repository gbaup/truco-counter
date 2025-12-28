import { PublicUser } from "@/types/database";

interface UserDropdownProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    users: PublicUser[];
    disabledId?: string;
    labelColorClass?: string;
    ringColorClass?: string;
}

export default function UserDropdown({
    label,
    value,
    onChange,
    users,
    disabledId,
    labelColorClass = "text-blue-400",
    ringColorClass = "focus:ring-blue-500",
}: UserDropdownProps) {
    return (
        <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-md">
            <label className={`mb-2 block text-sm font-medium ${labelColorClass}`}>
                {label}
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full capitalize rounded-lg bg-black/20 p-3 text-white focus:outline-none focus:ring-2 ${ringColorClass}`}
            >
                <option value="">Seleccionar jugador</option>
                {users.map((user) => (
                    <option key={user.id} value={user.id} disabled={user.id === disabledId}>
                        {user.username}
                    </option>
                ))}
            </select>
        </div>
    );
}
