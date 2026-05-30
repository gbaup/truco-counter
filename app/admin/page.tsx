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
import { useGroupMembers } from "@/hooks/useGroupMembers";
import { useUpdateUserUsername } from "@/hooks/useUpdateUserUsername";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { UserRole } from "@/types/auth";
import { AdminUser } from "@/types/database";

export default function AdminPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedGroupOverride, setSelectedGroupOverride] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: me, isPending: meLoading } = useCurrentUser();
  const { data: groups = [], isPending: groupsLoading } = useMyGroups();

  const isSystemAdmin = me?.role === "admin";
  const adminedGroups = groups.filter((g) => g.admin_id === me?.userId);
  const isGroupAdmin = adminedGroups.length > 0;
  const selectedGroupId = selectedGroupOverride ?? adminedGroups[0]?.id ?? null;

  // Group-scoped members (used when a group is selected)
  const { data: groupMembers = [], isPending: membersLoading } = useGroupMembers(
    selectedGroupId
  );

  // All-users list (system admin only, used when no group is selected)
  const {
    players,
    creating,
    setCreating,
    editingUser,
    setEditingUser,
    isLoading: playersLoading,
    error,
  } = useAdminUsers(isSystemAdmin && !selectedGroupId);

  // Derive one unified display list
  const displayList: AdminUser[] = selectedGroupId
    ? groupMembers.map((m) => ({
        id: m.id,
        name: m.name,
        last_name: m.last_name,
        username: m.username,
        rating: m.rating,
        rating_deviation: m.rating_deviation,
        role: "user" as UserRole,
      }))
    : players;

  const filteredList = displayList.filter(
    (p) =>
      p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${p.name} ${p.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isListLoading = selectedGroupId ? membersLoading : playersLoading;

  const updateOther = useUpdateUserUsername();

  useEffect(() => {
    if (error) toast.error(t("admin.loadError"));
  }, [error, t]);

  useEffect(() => {
    if (meLoading || groupsLoading) return;
    if (!me) { router.replace("/login"); return; }
    if (!isSystemAdmin && !isGroupAdmin) { router.replace("/"); return; }
  }, [me, meLoading, groupsLoading, isSystemAdmin, isGroupAdmin, router]);

  if (meLoading || groupsLoading) return <LoadingScreen />;

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
        {/* Group management card (invite link, rename) — group admins only */}
        {isGroupAdmin && (
          <GroupAdminSection
            adminedGroups={adminedGroups}
            selectedGroupId={selectedGroupId}
            onSelectGroup={setSelectedGroupOverride}
          />
        )}

        {/* Player count + create button — system admins only */}
        {isSystemAdmin && (
          <AdminSubHeader
            count={displayList.length}
            onCreate={() => setCreating(true)}
          />
        )}

        <AdminSearchBar value={searchQuery} onChange={setSearchQuery} />

        {isListLoading ? (
          <div className="flex justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-us border-t-transparent" />
          </div>
        ) : (
          <ul className="px-5 flex flex-col gap-1.5">
            {filteredList.map((p) => (
              <AdminUserRow
                key={p.id}
                user={p}
                onEdit={isSystemAdmin ? setEditingUser : undefined}
              />
            ))}
            {filteredList.length === 0 && searchQuery && (
              <p className="py-8 text-center font-serif text-sm italic text-text-mute">
                Sin resultados para &quot;{searchQuery}&quot;
              </p>
            )}
          </ul>
        )}
      </main>

      {isSystemAdmin && (
        <>
          <CreatePlayerSheet
            open={creating}
            onClose={() => setCreating(false)}
            onCreated={() => {}}
          />

          <ChangeNicknameSheet
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
