interface VersusStats {
    total_matches: number;
    p1_wins: number;
    p2_wins: number;
    draws: number;
}

interface VersusResultsProps {
    stats: VersusStats | null;
    loading: boolean;
    p1Name?: string;
    p2Name?: string;
}

export default function VersusResults({
    stats,
    loading,
    p1Name,
    p2Name,
}: VersusResultsProps) {
    if (loading) {
        return (
            <div className="flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="mt-8 text-center text-gray-500">
                Selecciona dos jugadores para ver el historial
            </div>
        );
    }

    return (
        <div className="space-y-6 text-center animate-fade-in">
            <div className="grid grid-cols-3 gap-4 text-center">
                <div className="rounded-xl bg-primary-500/20 p-4">
                    <div className="text-3xl font-bold text-primary-400">{stats.p1_wins}</div>
                    <div className="text-sm capitalize text-primary-200">
                        Victorias {p1Name}
                    </div>
                </div>

                <div className="rounded-xl bg-white/10 p-4">
                    <div className="text-3xl font-bold text-white">{stats.draws}</div>
                    <div className="text-sm text-gray-300">Empates</div>
                </div>

                <div className="rounded-xl bg-secondary-500/20 p-4">
                    <div className="text-3xl font-bold text-secondary-400">{stats.p2_wins}</div>
                    <div className="text-sm capitalize text-secondary-200">
                        Victorias {p2Name}
                    </div>
                </div>
            </div>

            <div className="text-xl text-gray-400">
                Total Partidos:{" "}
                <span className="font-bold text-white">{stats.total_matches}</span>
            </div>
        </div>
    );
}
