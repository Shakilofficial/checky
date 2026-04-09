
"use client";

import Link from "next/link";
import { memo, useMemo, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOut, Settings, User } from "lucide-react";
import { useUser } from "../providers/UserProvider";

/* ======================================================
   Types
====================================================== */

export type UserInfo = {
  name?: string | null;
  email?: string | null;
  photo?: string | null;
  role?: string | null;
};

/* ======================================================
   Avatar Trigger
====================================================== */

type AvatarTriggerProps = {
  user: UserInfo | null;
  isLoading: boolean;
};

const AvatarTrigger = memo(function AvatarTrigger({
  user,
  isLoading,
}: AvatarTriggerProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const avatarUrl = useMemo(() => user?.photo || null, [user?.photo]);
  const key = useMemo(() => user?.photo || "default", [user?.photo]);
  const fallbackLetter = useMemo(
    () => user?.name?.charAt(0)?.toUpperCase() || "U",
    [user?.name],
  );

  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={!user || isLoading}
      className="group relative h-10 w-10 rounded-full focus-visible:ring-0"
    >
      <span className="avatar-ring pointer-events-none" />

      <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background">
        <Avatar
          key={key}
          className={cn(
            "relative h-full w-full overflow-hidden",
            "transition-all duration-300",
            "group-hover:scale-105 group-hover:shadow-xl",
          )}
        >
          {(isLoading || (avatarUrl && !loaded && !error)) && (
            <span className="avatar-shimmer" />
          )}

          {avatarUrl && !error && (
            <AvatarImage
              src={avatarUrl}
              alt={user?.name || "User"}
              referrerPolicy="no-referrer"
              onLoad={() => setLoaded(true)}
              onError={() => {
                setError(true);
                setLoaded(true);
              }}
              className={cn(
                "h-full w-full object-cover transition-opacity duration-500",
                loaded ? "opacity-100" : "opacity-0",
              )}
            />
          )}

          <AvatarFallback className="bg-muted text-sm font-semibold">
            {fallbackLetter}
          </AvatarFallback>

          {user && !isLoading && <span className="avatar-status" />}
        </Avatar>
      </span>
    </Button>
  );
});

/* ======================================================
   Menu Content
====================================================== */

function MenuContent({
  user,
  onLogout,
}: {
  user: UserInfo;
  onLogout: () => void;
}) {
  return (
    <DropdownMenuContent
      align="end"
      className="w-48 rounded-xl shadow-xl bg-card/30 backdrop-blur-lg border border-border"
    >
      <DropdownMenuLabel className="flex flex-col gap-1 px-3 py-2">
        <span className="truncate font-medium leading-none">
          {user.name || "User"}
        </span>

        {user.email && (
          <span className="truncate text-xs text-muted-foreground">
            {user.email}
          </span>
        )}

        {user.role && (
          <span className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
            {user.role}
          </span>
        )}
      </DropdownMenuLabel>

      <DropdownMenuSeparator />

      <DropdownMenuItem asChild>
        <Link href="/dashboard/profile" className="flex items-center gap-2">
          <User className="size-4" />
          Profile
        </Link>
      </DropdownMenuItem>

      <DropdownMenuItem asChild>
        <Link href="/dashboard/settings" className="flex items-center gap-2">
          <Settings className="size-4" />
          Settings
        </Link>
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem
        onClick={onLogout}
        className="flex items-center gap-2 text-destructive hover:bg-destructive hover:text-background"
      >
        <LogOut className="size-4" />
        Logout
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}

/* ======================================================
   Main Component
====================================================== */

export function UserMenu() {
  const { user, isLoading, logoutUser } = useUser();

  if (!user && !isLoading) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <AvatarTrigger
            user={user}
            isLoading={isLoading}
          />
        </div>
      </DropdownMenuTrigger>

      {user && !isLoading && (
        <MenuContent
          user={user}
          onLogout={logoutUser}
        />
      )}
    </DropdownMenu>
  );
}
