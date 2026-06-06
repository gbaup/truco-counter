"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchJSON } from "@/lib/fetchJSON";

interface ShareLinkData {
  success: boolean;
  tokenId: string;
  token: string;
  joinUrl: string;
}

export function useGroupShareLink(groupId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["groupShareLink", groupId],
    queryFn: () => fetchJSON<ShareLinkData>(`/api/groups/${groupId}/share-link`),
    enabled: !!groupId,
  });

  const revokeMutation = useMutation({
    mutationFn: (tokenId: string) =>
      fetchJSON(`/api/groups/${groupId}/invite/${tokenId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupShareLink", groupId] });
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    revoke: (tokenId: string) => revokeMutation.mutate(tokenId),
    isRevoking: revokeMutation.isPending,
  };
}
