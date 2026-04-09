"use client";

import { ResponsiveModal } from "@/components/core/modal/ResponsiveModal";
import { getTaskById } from "@/services/task";
import { ITask } from "@/types/task";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ViewTaskModalProps {
    taskId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ViewTaskModal = ({
    taskId,
    open,
    onOpenChange,
}: ViewTaskModalProps) => {
    const [task, setTask] = useState<ITask | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && taskId) {
            const fetchTask = async () => {
                try {
                    setLoading(true);
                    const res = await getTaskById(taskId);
                    if (res?.success) {
                        setTask(res.data || null);
                    }
                } catch (err) {
                    console.error("Failed to fetch task details:", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchTask();
        }
    }, [open, taskId]);

    return (
        <ResponsiveModal
            open={open}
            onOpenChange={onOpenChange}
            title="Task Details"
            description="View full information about this task"
            maxWidth="md"
            loading={loading}
        >
            {task && (
                <div className="space-y-6 py-4">
                    <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-1">Title</h4>
                        <p className="text-base font-medium">{task.title}</p>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-1">Description</h4>
                        <p className="text-sm border p-3 rounded-md bg-muted/30">{task.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-semibold text-muted-foreground mb-1">Status</h4>
                            <Badge variant="outline" className="capitalize">
                                {task.status}
                            </Badge>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-muted-foreground mb-1">Created At</h4>
                            <p className="text-sm font-mono">{format(new Date(task.createdAt), "MMM d, yyyy HH:mm")}</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-1">Assigned To</h4>
                        {task.assignedTo ? (
                            <div className="flex items-center gap-3 p-3 border rounded-md">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={task.assignedTo.photo || ""} />
                                    <AvatarFallback>{task.assignedTo.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">{task.assignedTo.name}</p>
                                    <p className="text-xs text-muted-foreground">{task.assignedTo.email}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm italic text-muted-foreground">Unassigned</p>
                        )}
                    </div>
                </div>
            )}
        </ResponsiveModal>
    );
};
