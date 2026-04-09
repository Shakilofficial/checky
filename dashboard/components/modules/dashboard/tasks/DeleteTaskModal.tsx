"use client";

import { ResponsiveModal } from "@/components/core/modal/ResponsiveModal";
import { deleteTask } from "@/services/task";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteTaskModalProps {
    taskId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export const DeleteTaskModal = ({
    taskId,
    open,
    onOpenChange,
    onSuccess,
}: DeleteTaskModalProps) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        try {
            setLoading(true);
            const res = await deleteTask(taskId);

            if (!res?.success) {
                toast.error(res?.message || "Failed to delete task");
                return;
            }

            toast.success("Task deleted successfully!");
            onSuccess?.();
            onOpenChange(false);
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ResponsiveModal
            open={open}
            onOpenChange={onOpenChange}
            title="Delete Task"
            description="Are you sure you want to delete this task? This action cannot be undone."
            maxWidth="sm"
            loading={loading}
        >
            <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                    Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                    {loading ? "Deleting..." : "Delete Task"}
                </Button>
            </div>
        </ResponsiveModal>
    );
};
