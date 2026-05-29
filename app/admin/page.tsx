"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import SideDrawer from "@/components/SideDrawer";
import Logo from "@/components/ui/Logo";
import { MenuIcon } from "@/components/ui/icons";
import AdminSubHeader from "@/components/admin/AdminSubHeader";
import AdminSearchBar from "@/components/admin/AdminSearchBar";
import AdminUserRow from "@/components/admin/AdminUserRow";
import ChangeNicknameSheet from "@/components/ui/ChangeNicknameSheet";
import CreatePlayerSheet from "@/components/ui/CreatePlayerSheet";
import GroupAdminSection from "@/components/admin/GroupAdminSection";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useMyGroups } from "@/hooks/useMyGroups";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useUpdateUserUsername } from "@/hooks/useUpdateUserUsername";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function AdminPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: me, isPending: meLoading } = useCurrentUser();
  const { data: groups = [], isPending: groupsLoading } = useMyGroups();

  const isSystemAdmin = me?.role === "admin";
  const adminedGroups = groups.filter((g) => g.admin_id === me?.userId);
  const isGroupAdmin = adminedGroups.length > 0;

  const updateOther = useUpdateUserUsername();
  const {
    players,
    filtered,
    query,
    setQuery,
    creating,
    setCreating,
    editingUser,
    setEditingUser,
    isLoading: playersLoading,
    error,
  } = useAdminUsers(isSystemAdmin);

  useEffect(() => {
    if (error) toast.error(t("admin.loadError"));
  }, [error, t]);

  useEffect(() => {
    if (meLoading || groupsLoading) return;
    if (!me) { router.replace("/login"); return; }
    if (!isSystemAdmin && !isGroupAdmin) { router.replace("/"); return; }
  }, [me, meLoading, groupsLoading, isSystemAdmin, isGroupAdmin, router]);

  if (meLoading || groupsLoading) return <LoadingScreen />;
  if (isSystemAdmin && playersLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-background text-text">
      <SideDrawer
        isOpen={drawerOpen}
        onToggle={() => setDrawerOpen((v) => !v)}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-3">
        <Logo size={18} />
        <span
          className="text-caption-italic text-text"
          style={{ fontFamily: "var(--font-crimson-pro), serif" }}
        >
          {t("sideDrawer.admin")}
        </span>
        <button
          onClick={() => setDrawerOpen(true)}
          className="w-9 h-9 rounded-lg bg-surface border border-border text-text-dim flex items-center justify-center transition-colors hover:bg-surface-elevated"
          aria-label="Menú"
        >
          <MenuIcon size={16} />
        </button>
      </div>

      <main className="flex flex-col pb-5">
        {/* Group admin section — visible to any group admin */}
        {isGroupAdmin && <GroupAdminSection adminedGroups={adminedGroups} />}

        {/* System admin section */}
        {isSystemAdmin && (
          <>
            <AdminSubHeader count={players.length} onCreate={() => setCreating(true)} />
            <AdminSearchBar value={query} onChange={setQuery} />

            <ul className="px-5 flex flex-col gap-1.5">
              {filtered.map((p) => (
                <AdminUserRow key={p.id} user={p} onEdit={setEditingUser} />
              ))}
              {filtered.length === 0 && query && (
                <p className="py-8 text-center font-serif text-sm italic text-text-mute">
                  Sin resultados para &quot;{query}&quot;
                </p>
              )}
            </ul>
          </>
        )}
      </main>

      {isSystemAdmin && (
        <>
          <CreatePlayerSheet
            key={creating ? "open" : "closed"}
            open={creating}
            onClose={() => setCreating(false)}
            onCreated={() => {}}
          />

          <ChangeNicknameSheet
            key={editingUser?.id ?? "no-user"}
            open={!!editingUser}
            currentNickname={editingUser?.username ?? ""}
            overline={t("nickname.overline.admin", { name: editingUser?.username ?? "" })}
            headline={t("nickname.headline.admin")}
            onSave={(draft) => updateOther.mutateAsync({ userId: editingUser!.id, username: draft })}
            onClose={() => setEditingUser(null)}
            onSaved={() => setEditingUser(null)}
          />
        </>
      )}
    </div>
  );
}
