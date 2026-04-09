"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ITask, TaskStatus } from "@/types/task";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { TaskActions } from "./TaskActions";

export const columns: ColumnDef<ITask>[] = [
    {
        accessorKey: "title",
        header: "Task",
        cell: ({ row }) => {
            const task = row.original;
            return (
                <div className="flex flex-col">
                    <span className="font-medium text-sm text-foreground/90">
                        {task.title}
                    </span>
                    <span className="truncate max-w-[200px] text-xs text-muted-foreground/80 font-normal">
                        {task.description}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "assignedTo",
        header: "Assigned To",
        cell: ({ row }) => {
            const assignedTo = row.original.assignedTo;
            if (!assignedTo) return <span className="text-xs text-muted-foreground italic">Unassigned</span>;

            const initials = assignedTo.name?.charAt(0)?.toUpperCase() || "U";

            return (
                <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                        <AvatarImage src={assignedTo.photo || ""} alt={assignedTo.name} />
                        <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-muted-foreground/90">
                        {assignedTo.name}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            const isDone = status === TaskStatus.DONE;
            const isProcessing = status === TaskStatus.PROCESSING;

            return (
                <Badge
                    variant={isDone ? "default" : isProcessing ? "secondary" : "outline"}
                    className="capitalize font-medium text-[10px] px-2 py-0.5 rounded-md"
                >
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => (
            <span className="text-xs text-muted-foreground font-mono">
                {format(new Date(row.original.createdAt), "MMM d, yyyy")}
            </span>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <TaskActions task={row.original} />,
    },
];
