"use client";

import { useUser } from "@/components/providers/UserProvider";
import Logo from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./NavItems";

/* ---------------------------------------------
   Types
--------------------------------------------- */

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

/* ---------------------------------------------
   Component
--------------------------------------------- */

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const pathname = usePathname();
  const { logoutUser } = useUser();

  /* ---------------------------------------------
     Active Link Logic (FIXED)
  --------------------------------------------- */

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleLogout = async () => {
    await logoutUser();
  };

  const handleLinkClick = () => {
    // Auto close on mobile
    if (window.innerWidth < 1024) {
      onToggle();
    }
  };

  /* ---------------------------------------------
     Render
  --------------------------------------------- */

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm lg:hidden z-30"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40",
          "w-64 shrink-0 flex flex-col",
          "bg-card/95 backdrop-blur-md",
          "border-r border-border/40",
          "transition-transform duration-300 ease-in-out",
          !isOpen && "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Header */}
        <div className="p-4">
          <Logo size={28} textSize="text-2xl" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  "relative group flex items-center gap-3",
                  "px-4 py-3.5 rounded-xl text-sm font-semibold",
                  "transition-all duration-300",
                  active
                    ? "bg-primary/15 text-primary shadow-[0_4px_12px_rgba(var(--primary-rgb),0.12)] border-l-4 border-primary pl-3.5"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-primary/40 blur-[2px] -z-10" />
                )}

                <Icon className={cn("h-5 w-5 transition-all duration-300", active ? "scale-110 opacity-100" : "opacity-70 group-hover:opacity-100")} />

                <span className={cn("truncate transition-all duration-300", active ? "font-bold tracking-tight" : "font-medium")}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-5 border-t border-border/60 bg-card/10">
          <Button
            variant="destructive"
            size="lg"
            className="w-full justify-start gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
