import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { SidebarOptInForm } from "@/components/sidebar-opt-in-form";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Home",
      url: "#",
    },
    {
      title: "Products",
      url: "#",
    },
    {
      title: "Promo Code",
      url: "#",
    },
    {
      title: "Offers",
      url: "#",
    },
    {
      title: "Users",
      url: "#",
    },
    {
      title: "ads",
      url: "#",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="flex items-center justify-center">
        <img src="logo.webp" width={50} />
      </SidebarHeader>
      <SidebarSeparator className="bg-gray-400/20" />
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <div className="p-1">
          <SidebarOptInForm />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
