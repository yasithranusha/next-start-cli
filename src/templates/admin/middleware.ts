import { NextRequest, NextResponse } from "next/server";
import { getAllAvailableRoutes } from "@/data/routes/admin-routes";
import {
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_NON_AUTHORIZED_REDIRECT,
  DEFAULT_NON_AUTH_REDIRECT,
  authRoutes,
} from "@/data/routes/default-routes";
import { UserRoles } from "@/enum/user";
import { middlewareRouteCheck } from "@/lib/role/functions";
import { getUserRole } from "@/lib/auth/session";

export default async function middleware(req: NextRequest) {
  // Get user role from session
  // IMPORTANT: Implement session management in @/lib/auth/session.ts
  // This will return null until you implement your authentication solution
  const role = await getUserRole();

  // For development: Uncomment to bypass auth (REMOVE IN PRODUCTION)
  // const role = UserRoles.ADMIN;
  const pathname = req.nextUrl.pathname;

  // If user has role and tries to access auth routes, redirect to dashboard
  if (role && authRoutes.some((route) => pathname === route.url)) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
  }

  // If trying to access /admin routes without a role, redirect to login
  if (!role && req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL(DEFAULT_NON_AUTH_REDIRECT, req.url));
  }

  // Skip other checks for auth routes (like /login)
  if (authRoutes.some((route) => pathname === route.url)) {
    return NextResponse.next();
  }

  // Only check available routes for /admin paths
  if (pathname.startsWith("/admin")) {
    const availableRoutes = getAllAvailableRoutes(role);

    if (!availableRoutes.some((route) => pathname.includes(route.url))) {
      return NextResponse.redirect(
        new URL(DEFAULT_NON_AUTHORIZED_REDIRECT, req.url)
      );
    }

    if (!middlewareRouteCheck(availableRoutes, pathname)) {
      return NextResponse.redirect(
        new URL(DEFAULT_NON_AUTHORIZED_REDIRECT, req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
