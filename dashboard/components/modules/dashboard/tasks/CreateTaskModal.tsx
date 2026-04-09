"use client";

import { Form, SelectInput, TextInput, TextareaInput } from "@/components/core/form";
import { ResponsiveModal } from "@/components/core/modal/ResponsiveModal";
import { createTask } from "@/services/task";
import { getAllUsers } from "@/services/user";
import { IAuthUser } from "@/types/auth";
import { User, ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import type { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

/* -----------------------------
   Schema
----------------------------- */
const createTaskSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters long"),
    description: z.string().min(5, "Description must be at least 5 characters long"),
    userId: z.string().optional(),
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;

interface CreateTaskModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    submitButtonText?: string;
}

/* -----------------------------
   Component
----------------------------- */
export const CreateTaskModal = ({
    open,
    onOpenChange,
    onSuccess,
    submitButtonText = "Create Task",
}: CreateTaskModalProps) => {
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

    const onSubmit = async (data: CreateTaskSchema | FieldValues) => {
        try {
            setLoading(true);
            const res = await createTask(data);

            if (!res?.success) {
                toast.error(res?.message || "Failed to create task");
                return;
            }

            toast.success("Task created successfully!");
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
            title="Create New Task"
            description="Assign a new task to a user"
            maxWidth="md"
            loading={loading}
        >
            <Form<CreateTaskSchema>
                schema={createTaskSchema}
                onSubmit={onSubmit}
                defaultValues={{
                    title: "",
                    description: "",
                    userId: "",
                }}
                className="space-y-6"
                submitButtonText={submitButtonText}
                isLoading={loading}
            >
                <TextInput<CreateTaskSchema>
                    name="title"
                    label="Title"
                    placeholder="Enter task title"
                    icon={<ClipboardList className="h-4 w-4" />}
                />

                <TextareaInput<CreateTaskSchema>
                    name="description"
                    label="Description"
                    placeholder="Enter task description"
                />

                <SelectInput<CreateTaskSchema>
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
