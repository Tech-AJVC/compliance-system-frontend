import { AppSidebar } from "@/components/Dashboard/app-sidebar";
import DashbardBreadcum from "@/components/Dashboard/includes/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAppSelector } from "@/store/hooks";
import { GalleryVerticalEnd } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

const PATH_PREFIX = "/dashboard";

export default function DashboardLayout() {
  const menu = [
    {
      title: "Overview",
      url: PATH_PREFIX,
      items: [
        {
          title: "Dashboard",
          url: PATH_PREFIX,
          icon: GalleryVerticalEnd,
        },
        {
          title: "Tasks",
          url: PATH_PREFIX + "/task",
          icon: GalleryVerticalEnd,
        },
        {
          title: "Documents",
          url: PATH_PREFIX + "/documents",
          icon: GalleryVerticalEnd,
        },
        {
          title: "Activity Log",
          url: PATH_PREFIX + "/activity-log",
          icon: GalleryVerticalEnd,
        },
      ],
    },
    {
      title: "Compliance",
      url: PATH_PREFIX,
      items: [
        {
          title: "Limited Partners",
          url: PATH_PREFIX + "/limited-partners",
          icon: GalleryVerticalEnd,
        },
        {
          title: "Portfolio Companies",
          url: PATH_PREFIX + "/portfolio-companies",
          icon: GalleryVerticalEnd,
        },
      ],
      hiddenIcon: true,
    },
  ];

  const { isAuthenticated, user } = useAppSelector((state) => state.user);
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  console.log(user);

  return (
    <SidebarProvider>
      <AppSidebar menu={menu} user={user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DashbardBreadcum menu={menu} prefix={PATH_PREFIX} />
          </div>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
