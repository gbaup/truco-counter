"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
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
import { useActiveGroup } from "@/hooks/useActiveGroup";
import { useAdminDisplayList } from "@/hooks/useAdminDisplayList";
import { useUpdateUserUsername } from "@/hooks/useUpdateUserUsername";
import { AdminUser } from "@/types/database";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function AdminPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const { data: me, isPending: meLoading } = useCurrentUser();
  const { data: groups = [], isPending: groupsLoading } = useMyGroups();
  const { activeGroupId } = useActiveGroup();

  const adminedGroups = groups.filter((g) => g.admin_id === me?.userId);
  const isGroupAdmin = adminedGroups.length > 0;

  const selectedGroupId = adminedGroups.some((g) => g.id === activeGroupId)
    ? activeGroupId
    : (adminedGroups[0]?.id ?? null);

  const { list: filteredList, total, isLoading: isListLoading } = useAdminDisplayList(
    selectedGroupId,
    searchQuery,
    false
  );

  const updateOther = useUpdateUserUsername();

  useEffect(() => {
    if (meLoading || groupsLoading) return;
    if (!me) { router.replace("/login"); return; }
    if (!isGroupAdmin) { router.replace("/"); return; }
    if (activeGroupId && !adminedGroups.some((g) => g.id === activeGroupId)) {
      router.replace("/");
      return;
    }
  }, [me, meLoading, groupsLoading, isGroupAdmin, activeGroupId, adminedGroups, router]);

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
          aria-label={t("admin.menuAriaLabel")}
        >
          <MenuIcon size={16} />
        </button>
      </div>

      <main className="flex flex-col pb-5">

        {/* Group card (invite link, rename) */}
        <GroupAdminSection
          adminedGroups={adminedGroups}
          selectedGroupId={selectedGroupId}
        />

        {/* Player count + create button */}
        <AdminSubHeader
          count={total}
          onCreate={() => setCreating(true)}
        />

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
                onEdit={setEditingUser}
              />
            ))}
            {filteredList.length === 0 && searchQuery && (
              <p className="py-8 text-center font-serif text-sm italic text-text-mute">
                {t("admin.noResults", { query: searchQuery })}
              </p>
            )}
          </ul>
        )}
      </main>

      <CreatePlayerSheet
        open={creating}
        onClose={() => setCreating(false)}
        onCreated={() => { }}
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
    </div>
  );
}
