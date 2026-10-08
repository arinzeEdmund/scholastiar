import type { PlatformRole, PrimaryRole, UserProfile } from "@/data/types";

export type UserProfileUpdate = Partial<Pick<UserProfile, "full_name" | "headline" | "timezone">>;

export interface UsersRepository {
  listProfiles(): Promise<UserProfile[]>;
  getProfile(userId: string): Promise<UserProfile | null>;
  getRoles(userId: string): Promise<PlatformRole[]>;
  updateProfile(userId: string, update: UserProfileUpdate): Promise<UserProfile>;
  createProfile(input: {
    userId: string;
    fullName: string;
    email: string;
    primaryRole: PrimaryRole;
    organizationName: string | null;
    headline: string | null;
    countryCode: string;
  }): Promise<UserProfile>;
  addRole(userId: string, role: PlatformRole): Promise<void>;
  /** Removes the profile and roles (account deletion). */
  deleteUser(userId: string): Promise<void>;
}
