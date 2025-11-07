import { getDocByPath } from "./db";
import type { UserProfile } from "@/types/entities";

const USER_PROFILE_COLLECTION = "users";
const USER_PROFILE_DOC_PATH = (userId: string) => `${USER_PROFILE_COLLECTION}/${userId}`;

export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const profile = await getDocByPath<UserProfile>(USER_PROFILE_DOC_PATH(userId));
    return profile;
  } catch (error) {
    console.error("[userProfile] Failed to fetch profile:", error);
    return null;
  }
}

export async function createUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
  const { upsertById } = await import("./db");
  await upsertById<Partial<UserProfile>>(USER_PROFILE_COLLECTION, userId, {
    id: userId,
    name: data.name ?? "",
    email: data.email ?? "",
    roles: data.roles ?? [],
    entityId: data.entityId ?? null,
    subEntryId: data.subEntryId ?? null,
    primaryRole: data.primaryRole ?? data.roles?.[0],
    ...data,
  });
}

