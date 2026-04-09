"use client";

import { Form, PasswordInput, SelectInput, TextInput } from "@/components/core/form";
import { ResponsiveModal } from "@/components/core/modal/ResponsiveModal";
import { createUser } from "@/services/user";
import { UserRole } from "@/types/auth";
import { Mail, SquareAsterisk } from "lucide-react";
import { useState } from "react";
import type { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

/* -----------------------------
   Schema
----------------------------- */
const createUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Please provide a valid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
    role: z.enum([UserRole.USER, UserRole.ADMIN], {
        required_error: "Role is required",
    }),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

interface CreateUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    submitButtonText?: string;
}

/* -----------------------------
   Component
----------------------------- */
export const CreateUserModal = ({
    open,
    onOpenChange,
    onSuccess,
    submitButtonText = "Create User",
}: CreateUserModalProps) => {
    const [loading, setLoading] = useState(false);

    const defaultPassword = "Temp@1234"; // ← Default password

    const onSubmit = async (data: CreateUserSchema | FieldValues) => {
        try {
            setLoading(true);
            const res = await createUser(data);

            if (!res?.success) {
                toast.error(res?.message || "Failed to create user");
                return;
            }

            toast.success("User created successfully!");
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
            title="Create New User"
            description="Add a new team member"
            maxWidth="md"
            loading={loading}
        >
            <Form<CreateUserSchema>
                schema={createUserSchema}
                onSubmit={onSubmit}
                defaultValues={{
                    name: "",
                    email: "",
                    password: defaultPassword,
                    role: UserRole.ADMIN,
                }}
                className="space-y-6"
                submitButtonText={submitButtonText}
                isLoading={loading}
            >
                <TextInput<CreateUserSchema>
                    name="name"
                    label="Name"
                    placeholder="Enter name"
                    icon={<SquareAsterisk className="h-4 w-4" />}
                />

                <TextInput<CreateUserSchema>
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="Enter email"
                    required
                    icon={<Mail className="h-4 w-4" />}
                />

                <PasswordInput<CreateUserSchema>
                    name="password"
                    label="Password"
                    placeholder="Enter password"
                    required
                    icon={<SquareAsterisk className="h-4 w-4" />}
                />

                <SelectInput<CreateUserSchema>
                    name="role"
                    label="Role"
                    placeholder="Select role"
                    required
                    icon={<SquareAsterisk className="h-4 w-4" />}
                    options={[
                        { label: "Admin", value: UserRole.ADMIN },
                        { label: "User", value: UserRole.USER },
                    ]}
                />
            </Form>
        </ResponsiveModal>
    );
};
