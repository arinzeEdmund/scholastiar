import "server-only";

import { randomBytes } from "node:crypto";

import type { AuthRepository } from "@/data/repositories/auth";
import { hashPassword, verifyPassword } from "@/lib/password";

import { now, readSystem, write } from "./store";

const TOKEN_TTL_MS = { verify_email: 24 * 60 * 60 * 1000, reset_password: 60 * 60 * 1000 } as const;
const normalize = (email: string) => email.trim().toLowerCase();

export const mockAuthRepository: AuthRepository = {
  findAccountByEmail: (email) =>
    readSystem((db) => {
      const a = db.auth_accounts.find((acc) => acc.email === normalize(email));
      return a ? { user_id: a.user_id, email: a.email, email_verified_at: a.email_verified_at } : null;
    }),

  getAccount: (userId) =>
    readSystem((db) => {
      const a = db.auth_accounts.find((acc) => acc.user_id === userId);
      return a ? { user_id: a.user_id, email: a.email, email_verified_at: a.email_verified_at } : null;
    }),

  createAccount: ({ email, password }) => {
    const passwordHash = hashPassword(password);
    return write((db) => {
      const userId = `user-${crypto.randomUUID()}`;
      db.auth_accounts.push({
        user_id: userId,
        email: normalize(email),
        password_hash: passwordHash,
        email_verified_at: null,
        created_at: now(),
      });
      return userId;
    });
  },

  verifyCredentials: async (email, password) => {
    const account = await readSystem((db) => db.auth_accounts.find((a) => a.email === normalize(email)) ?? null);
    if (!account) return null;
    return verifyPassword(password, account.password_hash) ? account.user_id : null;
  },

  updatePassword: (userId, password) => {
    const passwordHash = hashPassword(password);
    return write((db) => {
      const account = db.auth_accounts.find((a) => a.user_id === userId);
      if (account) account.password_hash = passwordHash;
    });
  },

  deleteAccount: (userId) =>
    write((db) => {
      db.auth_accounts = db.auth_accounts.filter((a) => a.user_id !== userId);
      db.auth_tokens = db.auth_tokens.filter((t) => t.user_id !== userId);
    }),

  markEmailVerified: (userId) =>
    write((db) => {
      const account = db.auth_accounts.find((a) => a.user_id === userId);
      if (account && !account.email_verified_at) account.email_verified_at = now();
    }),

  issueToken: (userId, type) =>
    write((db) => {
      for (const t of db.auth_tokens) if (t.user_id === userId && t.type === type && !t.used_at) t.used_at = now();
      const token = randomBytes(24).toString("base64url");
      db.auth_tokens.push({
        id: `token-${crypto.randomUUID()}`,
        user_id: userId,
        type,
        token,
        expires_at: new Date(Date.now() + TOKEN_TTL_MS[type]).toISOString(),
        used_at: null,
        created_at: now(),
      });
      return token;
    }),

  peekToken: (token, type) =>
    readSystem((db) => {
      const t = db.auth_tokens.find((x) => x.token === token && x.type === type);
      return t && !t.used_at && new Date(t.expires_at) > new Date() ? t.user_id : null;
    }),

  consumeToken: (token, type) =>
    write((db) => {
      const t = db.auth_tokens.find((x) => x.token === token && x.type === type);
      if (!t || t.used_at || new Date(t.expires_at) <= new Date()) return null;
      t.used_at = now();
      return t.user_id;
    }),
};
