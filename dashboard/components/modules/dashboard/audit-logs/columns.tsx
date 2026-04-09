"use client";

import { IAuditLog } from "@/types/audit-log";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const columns: ColumnDef<IAuditLog>[] = [
    {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => (
            <span className="font-medium text-sm text-foreground/90 capitalize">
                {String(row.original.action).replace(/_/g, " ")}
            </span>
        ),
    },
    {
        accessorKey: "entity",
        header: "Entity",
        cell: ({ row }) => (
            <span className="text-xs font-medium text-muted-foreground/90">
                {row.original.entity} ({row.original.entityId})
            </span>
        ),
    },
    {
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => {
            const user = row.original.user;
            if (!user) return <span className="text-xs text-muted-foreground italic">System</span>;

            const initials = user.name?.charAt(0)?.toUpperCase() || "U";

            return (
                <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                        <AvatarImage src={user.photo || ""} alt={user.name} />
                        <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-muted-foreground/90">
                        {user.name}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "details",
        header: "Details",
        cell: ({ row }) => (
            <span className="truncate max-w-[200px] text-xs text-muted-foreground/80 font-normal">
                {row.original.details || "-"}
            </span>
        ),
    },
    {
        accessorKey: "createdAt",
        header: "Time",
        cell: ({ row }) => (
            <span className="text-xs text-muted-foreground font-mono">
                {format(new Date(row.original.createdAt), "MMM d, yyyy HH:mm")}
            </span>
        ),
    },
];
