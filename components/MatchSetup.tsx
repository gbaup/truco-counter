"use client";

import { useEffect, useState } from "react";
import { PublicUser } from "@/types/database";
import { getUsers } from "@/services/userService";
import { useTranslation } from "react-i18next";
import Logo from "@/components/ui/Logo";
import Suit, { SuitKind } from "@/components/ui/Suit";

interface MatchSetupProps {
  onStartMatch: (team1: PublicUser[], team2: PublicUser[], maxPoints: number) => void;
  isStarting: boolean;
  onMenuOpen?: () => void;
}

const POINTS_OPTIONS = [20, 30, 40, 50];

interface TeamConfig {
  team: 1 | 2;
  label: string;
  color: string;
  colorClass: string;
  borderClass: string;
  chipBg: string;
  chipText: string;
  dashedBorder: string;
  suitKind: SuitKind;
  list: PublicUser[];
  otherList: PublicUser[];
}

export default function MatchSetup({
  onStartMatch,
  isStarting,
  onMenuOpen,
}: MatchSetupProps) {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [team1, setTeam1] = useState<PublicUser[]>([]);
  const [team2, setTeam2] = useState<PublicUser[]>([]);
  const [maxPoints, setMaxPoints] = useState<number>(40);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchUsers() {
      const data = await getUsers();
      setUsers(data);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  const toggleUserInTeam = (user: PublicUser, team: 1 | 2) => {
    if (team === 1) {
      if (team1.find((u) => u.id === user.id)) {
        setTeam1(team1.filter((u) => u.id !== user.id));
      } else if (team1.length < 3 && !team2.find((u) => u.id === user.id)) {
        setTeam1([...team1, user]);
      }
    } else {
      if (team2.find((u) => u.id === user.id)) {
        setTeam2(team2.filter((u) => u.id !== user.id));
      } else if (team2.length < 3 && !team1.find((u) => u.id === user.id)) {
        setTeam2([...team2, user]);
      }
    }
  };

  const canStart = team1.length === team2.length && team1.length >= 2;
  const showWarning =
    team1.length !== team2.length && team1.length > 0 && team2.length > 0;

  const availableUsers = users.filter(
    (u) =>
      !team1.find((t) => t.id === u.id) &&
      !team2.find((t) => t.id === u.id) &&
      !u.isPlaying
  );

  const teamConfigs: TeamConfig[] = [
    {
      team: 1,
      label: t("matchSetup.team1"),
      color: "#8B5CF6",
      colorClass: "text-us",
      borderClass: "border-us/40",
      chipBg: "bg-us/20",
      chipText: "text-us",
      dashedBorder: "border-us/60 text-us",
      suitKind: "espada",
      list: team1,
      otherList: team2,
    },
    {
      team: 2,
      label: t("matchSetup.team2"),
      color: "#34D399",
      colorClass: "text-them",
      borderClass: "border-them/40",
      chipBg: "bg-them/20",
      chipText: "text-them",
      dashedBorder: "border-them/60 text-them",
      suitKind: "basto",
      list: team2,
      otherList: team1,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-us border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-text">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-3">
        <Logo size={18} />
        <span
          className="text-caption-italic text-text"
          style={{ fontFamily: "var(--font-crimson-pro), serif" }}
        >
          {t("sideDrawer.home")}
        </span>
        <button
          onClick={onMenuOpen}
          className="w-9 h-9 rounded-lg bg-surface border border-border text-text-dim flex items-center justify-center transition-colors hover:bg-surface-elevated"
          aria-label="Menú"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 px-5 pb-6 flex-1">

        {/* Team panels — side by side */}
        <div className="grid grid-cols-2 gap-2.5">
          {teamConfigs.map(
            ({ team, label, color, colorClass, borderClass, chipBg, chipText, dashedBorder, suitKind, list, otherList }) => {
              const visibleUsers = users.filter((u) => {
                const inThis = !!list.find((t) => t.id === u.id);
                const inOther = !!otherList.find((t) => t.id === u.id);
                if (inThis) return true;
                if (inOther || u.isPlaying) return false;
                return true;
              });

              return (
                <div
                  key={team}
                  className={`bg-surface rounded-xl border ${borderClass} p-3`}
                >
                  {/* Panel header */}
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <Suit kind={suitKind} size={12} color={color} />
                    <span
                      className={`text-heading-sm ${colorClass}`}
                      style={{ fontFamily: "var(--font-crimson-pro), serif" }}
                    >
                      {label}
                    </span>
                  </div>

                  {/* Player chips */}
                  <div className="flex flex-col gap-1">
                    {visibleUsers.map((user) => {
                      const inThis = !!list.find((u2) => u2.id === user.id);
                      return (
                        <button
                          key={user.id}
                          onClick={() => toggleUserInTeam(user, team)}
                          className={[
                            "flex items-center justify-between px-2.5 py-1.5 rounded-sm text-xs font-semibold transition-colors capitalize text-left",
                            inThis
                              ? `${chipBg} ${chipText}`
                              : "border border-border text-text hover:bg-surface-elevated",
                          ].join(" ")}
                        >
                          <span>{user.username}</span>
                          {inThis && (
                            <span className="opacity-50 ml-1 text-[10px]">×</span>
                          )}
                        </button>
                      );
                    })}

                    {/* Dashed "+ sumar" placeholder */}
                    {list.length < 3 && (
                      <div
                        className={`border border-dashed ${dashedBorder} px-2.5 py-1.5 rounded-sm text-[11px] italic text-center opacity-50 pointer-events-none select-none`}
                      >
                        + sumar
                      </div>
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* Pool — "en el banco" */}
        {availableUsers.length > 0 && (
          <div>
            <p
              className="text-caption-italic text-text-mute mb-2"
              style={{ fontFamily: "var(--font-crimson-pro), serif", fontSize: 11 }}
            >
              {t("matchSetup.pool")}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {availableUsers.map((user) => (
                <span
                  key={user.id}
                  className="bg-surface border border-border text-text px-2.5 py-1.5 rounded-sm text-xs capitalize"
                >
                  {user.username}
                </span>
              ))}
            </div>
          </div>
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
                className={[
                  "flex-1 py-3 rounded-lg text-center font-extrabold text-base transition-colors",
                  maxPoints === points
                    ? "bg-us text-white"
                    : "border border-border text-text hover:bg-surface-elevated",
                ].join(" ")}
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
          className="mt-auto w-full bg-us text-white rounded-lg py-4 text-base font-bold flex items-center justify-center gap-2 disabled:opacity-40 active:scale-[0.98] transition-transform"
        >
          {isStarting ? (
            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <>
              {!canStart && (team1.length < 2 || team2.length < 2)
                ? t("matchSetup.button.disabled")
                : t("matchSetup.button.start")}
              {canStart && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
