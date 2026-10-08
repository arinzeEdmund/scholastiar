// Phase A stand-in for Supabase Auth (auth.users + email/reset tokens).
// Phase B replaces these with Supabase Auth; the screens keep the same flows.

/** auth.users equivalent. Passwords are only ever stored as scrypt hashes. */
export interface AuthAccount {
  user_id: string;
  email: string;
  password_hash: string;
  email_verified_at: string | null;
  created_at: string;
}

export type AuthTokenType = "verify_email" | "reset_password";

/** One-time links sent by email (verification, password reset). */
export interface AuthToken {
  id: string;
  user_id: string;
  type: AuthTokenType;
  token: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
}
