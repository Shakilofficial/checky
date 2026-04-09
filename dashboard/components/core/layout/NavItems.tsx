/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BarChart3,
  ClipboardList,
  Settings,
  User2Icon,
  Users
} from "lucide-react";

export interface NavItem {
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  exact?: boolean;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Overviews", icon: BarChart3, href: "/dashboard" },
  { label: "Users", icon: Users, href: "/dashboard/users" },
  { label: "Audit Logs", icon: ClipboardList, href: "/dashboard/audit-logs" },
  { label: "Profile", icon: User2Icon, href: "/dashboard/profile" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
] as const;
