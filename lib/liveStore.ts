import { Hand } from "@/types/match";

// Process-scoped singleton: Next.js compiles each API route into its own bundle,
// so a module-level Map is not shared between routes. globalThis persists across
// bundles within the same Node.js process — the same pattern Prisma uses.
// NOTE: this breaks under multi-process deployments (serverless, horizontal scale).
declare global {
  var liveStore: Map<string, Hand[]> | undefined;
}

const store: Map<string, Hand[]> = (globalThis.liveStore ??= new Map());

export function getLog(matchId: string): Hand[] {
  return store.get(matchId) ?? [];
}

export function appendHand(matchId: string, hand: Hand): void {
  const existing = store.get(matchId) ?? [];
  store.set(matchId, [hand, ...existing]);
}

export function clearLog(matchId: string): void {
  store.delete(matchId);
}
