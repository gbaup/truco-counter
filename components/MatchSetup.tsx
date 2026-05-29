"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { PublicUser } from "@/types/database";
import { useUsers } from "@/hooks/useUsers";
import { useTranslation } from "react-i18next";
import Logo from "@/components/ui/Logo";
import { MenuIcon, SpinnerIcon, ArrowRightIcon } from "@/components/ui/icons";
import Suit, { SuitKind } from "@/components/ui/Suit";

interface MatchSetupProps {
  onStartMatch: (team1: PublicUser[], team2: PublicUser[], maxPoints: number) => void;
  isStarting: boolean;
  onMenuOpen?: () => void;
  freePlay?: boolean;
}

const POINTS_OPTIONS = [20, 30, 40, 50];

interface TeamConfig {
  team: 1 | 2;
  label: string;
  color: string;
  colorClass: string;
  suitKind: SuitKind;
  // static class strings — all pre-computed so Tailwind can detect them
  panelResting: string;
  panelActive: string;
  chipClass: string;
  sumarResting: string;
  sumarActive: string;
  poolChipActive: string;
}

const TEAM_CONFIGS: Omit<TeamConfig, "label" | "list">[] = [
  {
    team: 1,
    color: "#8B5CF6",
    colorClass: "text-us",
    suitKind: "espada",
    panelResting: "bg-surface border border-us/40",
    panelActive: "bg-us/[0.07] border-2 border-us ring-4 ring-us/[0.08]",
    chipClass: "bg-us/20 text-us",
    sumarResting: "border border-dashed border-us/60 text-us opacity-60",
    sumarActive: "bg-us/10 border border-us/60 text-us font-semibold",
    poolChipActive: "bg-us/10 border-us/35 text-us hover:bg-us/20 cursor-pointer",
  },
  {
    team: 2,
    color: "#34D399",
    colorClass: "text-them",
    suitKind: "basto",
    panelResting: "bg-surface border border-them/40",
    panelActive: "bg-them/[0.07] border-2 border-them ring-4 ring-them/[0.08]",
    chipClass: "bg-them/20 text-them",
    sumarResting: "border border-dashed border-them/60 text-them opacity-60",
    sumarActive: "bg-them/10 border border-them/60 text-them font-semibold",
    poolChipActive: "bg-them/10 border-them/35 text-them hover:bg-them/20 cursor-pointer",
  },
];

export default function MatchSetup({ onStartMatch, isStarting, onMenuOpen, freePlay }: MatchSetupProps) {
  const { data: users = [], isPending: loading } = useUsers();
  const [team1, setTeam1] = useState<PublicUser[]>([]);
  const [team2, setTeam2] = useState<PublicUser[]>([]);
  const [maxPoints, setMaxPoints] = useState<number>(40);
  const [activeTeam, setActiveTeam] = useState<1 | 2 | null>(null);
  const { t } = useTranslation();

  const getList = (team: 1 | 2) => (team === 1 ? team1 : team2);
  const setList = (team: 1 | 2, list: PublicUser[]) =>
    team === 1 ? setTeam1(list) : setTeam2(list);

  const removeFromTeam = (user: PublicUser, team: 1 | 2) =>
    setList(team, getList(team).filter((u) => u.id !== user.id));

  const addToActiveTeam = (user: PublicUser) => {
    if (!activeTeam) return;
    const list = getList(activeTeam);
    if (list.length < 3) setList(activeTeam, [...list, user]);
  };

  const toggleSumar = (team: 1 | 2) =>
    setActiveTeam((prev) => (prev === team ? null : team));

  const canStart = freePlay || (team1.length === team2.length && team1.length >= 2);
  const showWarning = !freePlay && team1.length !== team2.length && team1.length > 0 && team2.length > 0;

  const poolUsers = users.filter(
    (u) => !team1.find((p) => p.id === u.id) && !team2.find((p) => p.id === u.id) && !u.isPlaying
  );

  const teamConfigs: TeamConfig[] = TEAM_CONFIGS.map((c) => ({
    ...c,
    label: c.team === 1 ? t("matchSetup.team1") : t("matchSetup.team2"),
  }));

  if (!freePlay && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-us border-t-transparent" />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col min-h-screen bg-background text-text"
      onClick={() => setActiveTeam(null)}
    >
      {/* Header */}
      <div
        className={twMerge("flex items-center px-5 pt-14 pb-3", freePlay ? "justify-center gap-3" : "justify-between")}
        onClick={(e) => e.stopPropagation()}
      >
        <Logo size={18} />
        <span
          className="text-caption-italic text-text"
          style={{ fontFamily: "var(--font-crimson-pro), serif" }}
        >
          {t("sideDrawer.home")}
        </span>
        {!freePlay && (
          <button
            onClick={onMenuOpen}
            className="w-9 h-9 rounded-lg bg-surface border border-border text-text-dim flex items-center justify-center transition-colors hover:bg-surface-elevated"
            aria-label="Menú"
          >
            <MenuIcon size={16} />
          </button>
        )}
      </div>

      {/* Body */}
      <div
        className={twMerge("flex flex-col gap-3 px-5 flex-1", freePlay ? "justify-center pb-0" : "pb-6")}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Team panels — hidden in free play mode */}
        {!freePlay && (
          <>
            <div className="grid grid-cols-2 gap-2.5">
              {teamConfigs.map(({ team, label, color, colorClass, suitKind, panelResting, panelActive, chipClass, sumarResting, sumarActive }) => {
                const isActive = activeTeam === team;
                const list = getList(team);

                return (
                  <div
                    key={team}
                    className={twMerge(isActive ? panelActive : panelResting, "rounded-xl p-3 transition-all duration-200")}
                  >
                    {/* Panel header */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <Suit kind={suitKind} size={12} color={color} />
                        <span
                          className={twMerge("text-heading-sm", colorClass)}
                          style={{ fontFamily: "var(--font-crimson-pro), serif" }}
                        >
                          {label}
                        </span>
                      </div>
                      <span
                        className="text-caption-italic text-text-mute"
                        style={{ fontFamily: "var(--font-crimson-pro), serif", fontSize: 10 }}
                      >
                        {list.length}/3
                      </span>
                    </div>

                    {/* Selected chips */}
                    <div className="flex flex-col gap-1">
                      {list.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => removeFromTeam(user, team)}
                          className={twMerge("flex items-center justify-between px-2.5 py-1.5 rounded-sm text-xs font-semibold capitalize text-left transition-colors", chipClass)}
                        >
                          <span>{user.username}</span>
                          <span className="opacity-50 ml-1 text-[10px]">×</span>
                        </button>
                      ))}

                      {/* + sumar */}
                      {list.length < 3 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleSumar(team); }}
                          aria-pressed={isActive}
                          aria-label={`Sumar a ${label}`}
                          className={twMerge("px-2.5 py-1.5 rounded-sm text-[11px] italic text-center transition-all duration-200", isActive ? sumarActive : sumarResting)}
                        >
                          {isActive ? "↓ tocá un jugador" : "+ sumar"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pool */}
            {poolUsers.length > 0 && (
              <div onClick={(e) => e.stopPropagation()}>
                <p
                  className="text-caption-italic text-text-mute mb-2"
                  style={{ fontFamily: "var(--font-crimson-pro), serif", fontSize: 11 }}
                >
                  {t("matchSetup.pool")}
                  {activeTeam && (
                    <span className={activeTeam === 1 ? "text-us" : "text-them"}>
                      {" · "}sumando a {activeTeam === 1 ? t("matchSetup.team1") : t("matchSetup.team2")}
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {poolUsers.map((user) => {
                    const cfg = activeTeam ? teamConfigs.find((c) => c.team === activeTeam)! : null;
                    const chipClass = cfg
                      ? `border ${cfg.poolChipActive}`
                      : "bg-surface border border-border text-text cursor-default";

                    return (
                      <button
                        key={user.id}
                        onClick={() => addToActiveTeam(user)}
                        aria-disabled={!activeTeam}
                        className={twMerge("px-2.5 py-1.5 rounded-sm text-xs capitalize transition-all duration-200", chipClass)}
                      >
                        {user.username}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* Score selector */}
        <div className="bg-surface rounded-xl border border-border p-3">
          <p
            className="text-caption-italic text-text-dim mb-2.5"
            style={{ fontFamily: "var(--font-crimson-pro), serif" }}
          >
            {t("matchSetup.maxPoints")}
          </p>
          <div className="flex gap-1.5">
            {POINTS_OPTIONS.map((points) => (
              <button
                key={points}
                onClick={() => setMaxPoints(points)}
                className={twMerge(
                  "flex-1 py-3 rounded-lg text-center font-extrabold text-base transition-colors",
                  maxPoints === points
                    ? "bg-us text-white"
                    : "border border-border text-text hover:bg-surface-elevated",
                )}
                style={{ fontFamily: "var(--font-crimson-pro), serif" }}
              >
                {points}
              </button>
            ))}
          </div>
        </div>

        {/* Unequal teams warning */}
        {showWarning && (
          <p className="animate-pulse text-center text-sm font-medium text-warning">
            {t("matchSetup.equalPlayers")}
          </p>
        )}

        {/* CTA */}
        <button
          onClick={() => canStart && onStartMatch(team1, team2, maxPoints)}
          disabled={!canStart || isStarting}
          className={twMerge(
            "w-full bg-us text-white rounded-lg py-4 text-base font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]",
            !freePlay && "mt-auto",
            canStart
              ? "shadow-[0_8px_20px_-10px_#8B5CF6] opacity-100"
              : "opacity-40 cursor-not-allowed",
          )}
        >
          {isStarting ? (
            <SpinnerIcon className="h-5 w-5 animate-spin" />
          ) : (
            <>
              {!freePlay && !canStart && (team1.length < 2 || team2.length < 2)
                ? t("matchSetup.button.disabled")
                : t("matchSetup.button.start")}
              {canStart && <ArrowRightIcon size={16} />}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
