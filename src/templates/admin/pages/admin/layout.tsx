import { cookies } from "next/headers";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import AdminHeaderContent from "@/components/sidebar/sidebar-header";
import { UserRoles } from "@/enum/user";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  //Todo: Get the user role from session
  const userRole = UserRoles.ADMIN;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex h-screen w-screen overflow-hidden">
        <AppSidebar role={userRole} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeaderContent role={userRole} />
          <div className="flex-1 overflow-auto p-4">
            <div className="container mx-auto">{children}</div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
