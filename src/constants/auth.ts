import { AppRoles } from "tg-sdk";

export const PREDEFINED_ROLES: Record<string, AppRoles[]> = {
  GUIDE_ONLY: ["guide", "user_manager"],
  TRAVELER_ONLY: ["guide", "user_manager"],
  ALL: ["guide", "traveler", "user_manager"]
} as const;
