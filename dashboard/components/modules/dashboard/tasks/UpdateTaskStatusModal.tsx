"use client";

import { Form, SelectInput } from "@/components/core/form";
import { ResponsiveModal } from "@/components/core/modal/ResponsiveModal";
import { updateTaskStatus } from "@/services/task";
import { ITask, TaskStatus } from "@/types/task";
import { ShieldAlert } from "lucide-react";
import { useState } from "react";
import type { FieldValues } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

/* -----------------------------
   Schema
----------------------------- */
const updateStatusSchema = z.object({
    status: z.nativeEnum(TaskStatus, {
        required_error: "Status is required",
    }),
});

export type UpdateStatusSchema = z.infer<typeof updateStatusSchema>;

interface UpdateTaskStatusModalProps {
    task: ITask;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

/* -----------------------------
   Component
----------------------------- */
export const UpdateTaskStatusModal = ({
    task,
    open,
    onOpenChange,
    onSuccess,
}: UpdateTaskStatusModalProps) => {
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: UpdateStatusSchema | FieldValues) => {
        try {
            setLoading(true);
            const res = await updateTaskStatus(task.id, data.status);

            if (!res?.success) {
                toast.error(res?.message || "Failed to update status");
                return;
            }

            toast.success("Task status updated successfully!");
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
            title="Update Task Status"
            description="Change the current progress of this task"
            maxWidth="sm"
            loading={loading}
        >
            <Form<UpdateStatusSchema>
                schema={updateStatusSchema}
                onSubmit={onSubmit}
                defaultValues={{
                    status: task.status,
                }}
                className="space-y-6"
                submitButtonText="Update Status"
                isLoading={loading}
            >
                <SelectInput<UpdateStatusSchema>
                    name="status"
                    label="Status"
                    placeholder="Select status"
                    required
                    icon={<ShieldAlert className="h-4 w-4" />}
                    options={Object.values(TaskStatus).map((status) => ({
                        label: status,
                        value: status,
                    }))}
                />
            </Form>
        </ResponsiveModal>
    );
};
