"use client";

import { Form, SelectInput, TextInput, TextareaInput } from "@/components/core/form";
import { ResponsiveModal } from "@/components/core/modal/ResponsiveModal";
import { updateTask } from "@/services/task";
import { getAllUsers } from "@/services/user";
import { IAuthUser } from "@/types/auth";
import { ITask } from "@/types/task";
import { User, ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import type { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

/* -----------------------------
   Schema
----------------------------- */
const editTaskSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters long"),
    description: z.string().min(5, "Description must be at least 5 characters long"),
    userId: z.string().optional(),
});

export type EditTaskSchema = z.infer<typeof editTaskSchema>;

interface EditTaskModalProps {
    task: ITask;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

/* -----------------------------
   Component
----------------------------- */
export const EditTaskModal = ({
    task,
    open,
    onOpenChange,
    onSuccess,
}: EditTaskModalProps) => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<IAuthUser[]>([]);

    useEffect(() => {
        if (open) {
            const fetchUsers = async () => {
                try {
                    const res = await getAllUsers({ limit: 100 });
                    if (res?.success) {
                        setUsers(res.data || []);
                    }
                } catch (err) {
                    console.error("Failed to fetch users:", err);
                }
            };
            fetchUsers();
        }
    }, [open]);

    const onSubmit = async (data: EditTaskSchema | FieldValues) => {
        try {
            setLoading(true);
            const res = await updateTask(task.id, data);

            if (!res?.success) {
                toast.error(res?.message || "Failed to update task");
                return;
            }

            toast.success("Task updated successfully!");
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
            title="Edit Task"
            description="Update task details"
            maxWidth="md"
            loading={loading}
        >
            <Form<EditTaskSchema>
                schema={editTaskSchema}
                onSubmit={onSubmit}
                defaultValues={{
                    title: task.title,
                    description: task.description,
                    userId: task.userId || "",
                }}
                className="space-y-6"
                submitButtonText="Update Task"
                isLoading={loading}
            >
                <TextInput<EditTaskSchema>
                    name="title"
                    label="Title"
                    placeholder="Enter task title"
                    icon={<ClipboardList className="h-4 w-4" />}
                />

                <TextareaInput<EditTaskSchema>
                    name="description"
                    label="Description"
                    placeholder="Enter task description"
                />

                <SelectInput<EditTaskSchema>
                    name="userId"
                    label="Assign To"
                    placeholder="Select a user (optional)"
                    icon={<User className="h-4 w-4" />}
                    options={users.map((u) => ({
                        label: u.name,
                        value: u.id,
                    }))}
                />
            </Form>
        </ResponsiveModal>
    );
};
