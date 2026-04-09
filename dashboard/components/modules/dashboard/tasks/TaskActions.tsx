"use client";

import { Button } from "@/components/ui/button";
import { ITask } from "@/types/task";
import { Edit, Eye, ShieldAlert, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteTaskModal } from "./DeleteTaskModal";
import { EditTaskModal } from "./EditTaskModal";
import { UpdateTaskStatusModal } from "./UpdateTaskStatusModal";
import { ViewTaskModal } from "./ViewTaskModal";

interface TaskActionsProps {
    task: ITask;
}

export function TaskActions({ task }: TaskActionsProps) {
    const router = useRouter();
    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);

    const handleSuccess = () => {
        router.refresh();
    };

    return (
        <>
            <div className="flex items-center justify-start gap-2">
                {/* View Action */}
                <Button
                    variant="secondary"
                    size="icon"
                    title="View Task"
                    className="h-8 w-8 text-white"
                    onClick={() => setViewOpen(true)}
                >
                    <Eye className="h-4 w-4" />
                </Button>

                {/* Edit Action */}
                <Button
                    variant="outline"
                    size="icon"
                    title="Edit Task"
                    className="h-8 w-8"
                    onClick={() => setEditOpen(true)}
                >
                    <Edit className="h-4 w-4" />
                </Button>

                {/* Status Action */}
                <Button
                    variant="ghost"
                    size="icon"
                    title="Update Status"
                    className="h-8 w-8 hover:bg-amber-100 hover:text-amber-600"
                    onClick={() => setStatusOpen(true)}
                >
                    <ShieldAlert className="h-4 w-4" />
                </Button>

                {/* Delete Action */}
                <Button
                    variant="destructive"
                    size="icon"
                    title="Delete Task"
                    className="h-8 w-8"
                    onClick={() => setDeleteOpen(true)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            <ViewTaskModal
                taskId={task.id}
                open={viewOpen}
                onOpenChange={setViewOpen}
            />

            <EditTaskModal
                task={task}
                open={editOpen}
                onOpenChange={setEditOpen}
                onSuccess={handleSuccess}
            />

            <UpdateTaskStatusModal
                task={task}
                open={statusOpen}
                onOpenChange={setStatusOpen}
                onSuccess={handleSuccess}
            />

            <DeleteTaskModal
                taskId={task.id}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onSuccess={handleSuccess}
            />
        </>
    );
}
