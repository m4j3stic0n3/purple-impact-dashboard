import { Home, FolderOpen, Brain, Newspaper, Search, Lightbulb, CreditCard } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: FolderOpen, label: "Portfolio", href: "/portfolio" },
  { icon: Brain, label: "PeakAI", href: "/peakai" },
  { icon: Newspaper, label: "News", href: "/news" },
  { icon: Search, label: "Explore", href: "/explore" },
  { icon: Lightbulb, label: "Learn", href: "/learn" },
  { icon: CreditCard, label: "Billing", href: "/billing" },
];

export function DashboardSidebar() {
  return (
    <Sidebar className="bg-dashboard-background border-r border-gray-800">
      <SidebarContent>
        <div className="px-3 py-4">
          <img src="/lovable-uploads/57a38a35-6ea4-42c7-bd1a-54fef1960bd0.png" alt="Peak Logo" className="w-24" />
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-dashboard-highlight/10 rounded-lg transition-colors"
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}