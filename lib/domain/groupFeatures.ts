import { z } from "zod";

export const GroupFeaturesSchema = z.object({
  liveMatch: z.boolean().default(false),
  pointsLogs: z.boolean().default(false),
  glickoRanking: z.boolean().default(false),
});

export type GroupFeatures = z.infer<typeof GroupFeaturesSchema>;

const DEFAULT_FEATURES: GroupFeatures = {
  liveMatch: false,
  pointsLogs: false,
  glickoRanking: false,
};

export const FREE_PLAY_FEATURES: GroupFeatures = {
  liveMatch: false,
  pointsLogs: true,
  glickoRanking: false,
};

export const FREE_PLAY_PAGES = new Set(["/", "/settings"]);

export function parseGroupFeatures(raw: unknown): GroupFeatures {
  const result = GroupFeaturesSchema.safeParse(raw);
  return result.success ? result.data : DEFAULT_FEATURES;
}

export function getGroupFeatures(context: {
  isFreePlay: boolean;
  activeGroup: { features: GroupFeatures } | null | undefined;
}): GroupFeatures {
  if (context.isFreePlay) return FREE_PLAY_FEATURES;
  return context.activeGroup?.features ?? DEFAULT_FEATURES;
}
