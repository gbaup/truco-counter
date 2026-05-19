import { MatchState } from "@/types/game";

const STORAGE_KEY = "truco-match-state";

export function loadMatch(): MatchState | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as MatchState) : null;
    } catch {
        return null;
    }
}

export function saveMatch(state: MatchState): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearMatch(): void {
    localStorage.removeItem(STORAGE_KEY);
}
