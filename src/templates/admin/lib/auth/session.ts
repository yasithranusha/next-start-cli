/**
 * Session Management Utilities
 *
 * This file provides helper functions for managing user sessions.
 *
 * IMPLEMENTATION REQUIRED:
 * You need to implement your preferred authentication solution:
 * - NextAuth.js (recommended for OAuth and credential-based auth)
 * - Clerk (managed authentication service)
 * - Auth0 (enterprise authentication)
 * - Custom JWT-based authentication
 * - Iron Session (lightweight session management)
 *
 * Example implementations are provided below for common patterns.
 */

import { cookies } from "next/headers";
import { UserRoles } from "@/enum/user";

/**
 * Session data structure
 */
export interface SessionData {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRoles;
    profileImage?: string;
  };
  expiresAt: Date;
}

/**
 * Gets the current user session
 *
 * IMPLEMENT THIS: Replace with your authentication solution
 *
 * Example with NextAuth:
 * ```typescript
 * import { getServerSession } from "next-auth";
 * import { authOptions } from "@/lib/auth/config";
 *
 * const session = await getServerSession(authOptions);
 * if (!session?.user) return null;
 *
 * return {
 *   user: {
 *     id: session.user.id,
 *     email: session.user.email,
 *     name: session.user.name,
 *     role: session.user.role as UserRoles,
 *     profileImage: session.user.image,
 *   },
 *   expiresAt: new Date(session.expires),
 * };
 * ```
 *
 * Example with Iron Session:
 * ```typescript
 * import { getIronSession } from "iron-session";
 *
 * const cookieStore = await cookies();
 * const session = await getIronSession(cookieStore, {
 *   password: process.env.SESSION_SECRET!,
 *   cookieName: "app_session",
 * });
 *
 * if (!session.user) return null;
 * return session as SessionData;
 * ```
 */
export async function getSession(): Promise<SessionData | null> {
  // TODO: IMPLEMENT YOUR AUTH SOLUTION HERE
  // This is a placeholder that should be replaced with actual session retrieval

  // For development/testing only - returns null (unauthenticated)
  // Remove this and implement proper session retrieval
  return null;

  // Example: Check for a session cookie
  // const cookieStore = await cookies();
  // const sessionCookie = cookieStore.get("session");
  // if (!sessionCookie) return null;
  // return decodeAndValidateSession(sessionCookie.value);
}

/**
 * Gets the current user's role from session
 *
 * @returns The user's role or null if not authenticated
 */
export async function getUserRole(): Promise<UserRoles | null> {
  const session = await getSession();
  return session?.user?.role ?? null;
}

/**
 * Gets the current user from session
 *
 * @returns The user data or null if not authenticated
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

/**
 * Checks if the current user is authenticated
 *
 * @returns True if user is authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null && new Date(session.expiresAt) > new Date();
}

/**
 * Checks if the current user has a specific role
 *
 * @param role - The role to check against
 * @returns True if user has the specified role
 */
export async function hasRole(role: UserRoles): Promise<boolean> {
  const userRole = await getUserRole();
  return userRole === role;
}

/**
 * Checks if the current user has any of the specified roles
 *
 * @param roles - Array of roles to check against
 * @returns True if user has any of the specified roles
 */
export async function hasAnyRole(roles: UserRoles[]): Promise<boolean> {
  const userRole = await getUserRole();
  return userRole !== null && roles.includes(userRole);
}
