import { cookies } from "next/headers";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import AdminHeaderContent from "@/components/sidebar/sidebar-header";
import { UserRoles } from "@/enum/user";
import { getUserRole } from "@/lib/auth/session";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  // Get user role from session
  // IMPORTANT: Implement session management in @/lib/auth/session.ts
  // This will return null until you implement your authentication solution
  const userRole = await getUserRole();
  
  // For development: Use a default role if session not implemented
  // REMOVE THIS IN PRODUCTION once authentication is implemented
  const role = userRole ?? UserRoles.ADMIN;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex h-screen w-screen overflow-hidden">
        <AppSidebar role={role} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeaderContent role={role} />
          <div className="flex-1 overflow-auto p-4">
            <div className="container mx-auto">{children}</div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
