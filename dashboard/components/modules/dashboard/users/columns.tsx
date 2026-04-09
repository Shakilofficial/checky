/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IAuthUser, UserRole, UserStatus } from "@/types/auth";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { UserActions } from "./UserActions";

export const columns: ColumnDef<IAuthUser>[] = [
    {
        accessorKey: "name",
        header: "User",
        cell: ({ row }) => {
            const user = row.original;
            const initials = user.name?.charAt(0)?.toUpperCase() || "U";

            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user.photo || ""} alt={user.name} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="truncate font-medium text-sm text-foreground/90">
                            {user.name}
                        </span>
                        <span className="truncate text-xs text-muted-foreground/80 font-normal">
                            {user.email}
                        </span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const role = row.original.role;
            const isSuperAdmin = (role as any) === "SUPER_ADMIN";
            const isAdmin = role === UserRole.ADMIN;

            return (
                <Badge
                    variant={isSuperAdmin ? "default" : isAdmin ? "secondary" : "outline"}
                    className="capitalize font-medium text-[10px] px-2 py-0.5 rounded-md"
                >
                    {String(role).replace("_", " ")}
                </Badge>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            const isActive = status === UserStatus.ACTIVE;
            const isBlocked = status === UserStatus.BLOCKED;

            return (
                <div className="flex items-center gap-2">
                    <span
                        className={`h-2 w-2 rounded-full ${isActive
                            ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                            : isBlocked
                                ? "bg-red-500"
                                : "bg-gray-400"
                            }`}
                    />
                    <span className="capitalize text-xs font-medium text-muted-foreground/90">
                        {status}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "dateOfBirth",
        header: "Date of Birth",
        cell: ({ row }) => (
            <span className="text-xs text-muted-foreground font-mono">
                {row.original.dateOfBirth ? format(new Date(row.original.dateOfBirth), "MMM d, yyyy") : "-"}
            </span>
        ),
    },
    {
        accessorKey: "createdAt",
        header: "Joined",
        cell: ({ row }) => (
            <span className="text-xs text-muted-foreground font-mono">
                {format(new Date(row.original.createdAt), "MMM d, yyyy")}
            </span>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <UserActions user={row.original} />,
    },
];
