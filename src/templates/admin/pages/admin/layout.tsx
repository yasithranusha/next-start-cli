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
      <AppSidebar role={userRole} />
      <main className="w-full">
        <AdminHeaderContent role={userRole} />
        <div className="p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
