# Authentication Setup Guide

This template includes a basic session management structure that **requires implementation**. Follow this guide to set up authentication in your project.

## 🔐 What Needs to be Implemented

The following files contain TODOs and placeholders that need your attention:

1. **`src/lib/auth/session.ts`** - Session management utilities
2. **`src/app/admin/middleware.ts`** - Route protection middleware
3. **`src/app/admin/layout.tsx`** - Admin layout with role-based access

## 📋 Authentication Options

Choose one of the following authentication solutions:

### Option 1: NextAuth.js (Recommended)

**Best for:** OAuth providers, credentials-based auth, and flexible session management

```bash
yarn add next-auth
```

**Setup:**
1. Create `src/lib/auth/config.ts`:
```typescript
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserRoles } from "@/enum/user";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // TODO: Validate credentials against your database
        // const user = await validateUser(credentials);
        // return user;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as UserRoles;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  }
};
```

2. Update `src/lib/auth/session.ts`:
```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "./config";

export async function getSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role as UserRoles,
      profileImage: session.user.image,
    },
    expiresAt: new Date(session.expires),
  };
}
```

3. Create API route `src/app/api/auth/[...nextauth]/route.ts`:
```typescript
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/config";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### Option 2: Iron Session

**Best for:** Lightweight, encrypted session cookies without external dependencies

```bash
yarn add iron-session
```

**Setup:**
1. Create `.env.local`:
```env
SESSION_SECRET=your-secret-key-at-least-32-characters-long
```

2. Update `src/lib/auth/session.ts`:
```typescript
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession(cookieStore, {
    password: process.env.SESSION_SECRET!,
    cookieName: "app_session",
  });

  if (!session.user) return null;
  return session as SessionData;
}
```

### Option 3: Clerk

**Best for:** Managed authentication with minimal setup

```bash
yarn add @clerk/nextjs
```

**Setup:**
1. Follow [Clerk's documentation](https://clerk.com/docs/quickstarts/nextjs)
2. Update `src/lib/auth/session.ts`:
```typescript
import { currentUser } from "@clerk/nextjs/server";

export async function getSession() {
  const user = await currentUser();
  if (!user) return null;

  return {
    user: {
      id: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: user.fullName || "",
      role: user.publicMetadata.role as UserRoles,
      profileImage: user.imageUrl,
    },
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  };
}
```

## 🚀 Implementation Checklist

- [ ] Choose an authentication solution
- [ ] Install required packages
- [ ] Implement `getSession()` in `src/lib/auth/session.ts`
- [ ] Remove development fallbacks in `middleware.ts` and `layout.tsx`
- [ ] Set up environment variables
- [ ] Implement login form submission logic
- [ ] Test authentication flow
- [ ] Implement logout functionality
- [ ] Add password reset flow (if needed)

## 🔧 Development Mode

During development, the template uses fallback values:
- **Middleware**: Falls back to `UserRoles.ADMIN` if no session
- **Admin Layout**: Uses `UserRoles.ADMIN` as default

**⚠️ IMPORTANT:** Remove these fallbacks before deploying to production!

## 📝 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Iron Session Documentation](https://github.com/vvo/iron-session)
- [Clerk Documentation](https://clerk.com/docs)
- [Next.js Authentication Best Practices](https://nextjs.org/docs/authentication)

## 🛡️ Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Use HTTPS in production** - Cookies should be secure
3. **Implement CSRF protection** - NextAuth includes this
4. **Rate limit login attempts** - Prevent brute force attacks
5. **Hash passwords properly** - Use bcrypt (already implemented in mock API)
6. **Validate all inputs** - Server-side validation is crucial
7. **Implement session expiration** - Refresh tokens when needed

## 🔒 Password Security

The mock API (`src/app/(server)/api/user/route.ts`) now generates secure random passwords instead of hardcoded ones. Remember to:

1. Send generated passwords via email
2. Force password change on first login
3. Implement "forgot password" flow
4. Set password complexity requirements

## ❓ Need Help?

- Check the official documentation for your chosen auth solution
- Review the example implementations above
- Test thoroughly in development before deploying
