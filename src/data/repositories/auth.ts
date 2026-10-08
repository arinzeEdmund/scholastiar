import type { AuthTokenType } from "@/data/types";

export interface AccountSummary {
  user_id: string;
  email: string;
  email_verified_at: string | null;
}

/** Phase A stand-in for Supabase Auth. */
export interface AuthRepository {
  findAccountByEmail(email: string): Promise<AccountSummary | null>;
  getAccount(userId: string): Promise<AccountSummary | null>;
  /** Creates a sign-in account. Returns the new user id. */
  createAccount(input: { email: string; password: string }): Promise<string>;
  /** Returns the user id when the email and password match, otherwise null. */
  verifyCredentials(email: string, password: string): Promise<string | null>;
  updatePassword(userId: string, password: string): Promise<void>;
  markEmailVerified(userId: string): Promise<void>;
  /** Issues a one-time token and invalidates earlier unused ones of the same type. */
  issueToken(userId: string, type: AuthTokenType): Promise<string>;
  /** The user id a valid, unused, unexpired token belongs to, without using it up. */
  peekToken(token: string, type: AuthTokenType): Promise<string | null>;
  /** Uses up a valid token and returns its user id. */
  consumeToken(token: string, type: AuthTokenType): Promise<string | null>;
  /** Removes the sign-in account and its tokens (account deletion). */
  deleteAccount(userId: string): Promise<void>;
}
