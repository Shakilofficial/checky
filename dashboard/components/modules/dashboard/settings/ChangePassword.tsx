"use client";

import { Form } from "@/components/core/form/Form";
import { PasswordInput } from "@/components/core/form/PasswordInput";
import { logout } from "@/services/auth";
import { changePassword } from "@/services/user";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

/* ----------------------------------
   Schema
---------------------------------- */
const changePasswordSchema = z
    .object({
        currentPassword: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                "Must include upper, lower, number & special character",
            ),
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                "Must include upper, lower, number & special character",
            ),
        confirmPassword: z.string().min(1, "Confirm your password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

/* ----------------------------------
   Props
---------------------------------- */
interface ChangePasswordProps {
    onSuccess?: () => void;
    submitButtonText?: string;
    passwordIcon?: ReactNode;
}

/* ----------------------------------
   Component
---------------------------------- */
export function ChangePassword({
    onSuccess,
    submitButtonText = "Update Password",
    passwordIcon = <Lock className="h-4 w-4" />,
}: ChangePasswordProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onSubmit = async (data: ChangePasswordValues) => {
        try {
            setLoading(true);

            const res = await changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });

            if (!res?.success) {
                toast.error(res?.message || "Failed to change password");
                return;
            }

            toast.success(
                "Password updated! You'll be logged out",
                {
                    duration: 2000,
                    id: "password-changed",
                }
            );

            onSuccess?.();

            await new Promise((resolve) => setTimeout(resolve, 1800));

            await logout();
            router.push("/login");
            router.refresh();
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-card/5 backdrop-blur-sm border border-border rounded-lg p-6 shadow-sm">
                <div className="mb-6 flex flex-col items-center gap-1">
                    <h2 className="text-2xl font-bold text-foreground">Change Password</h2>
                    <p className="text-sm text-muted-foreground">
                        Update your account password
                    </p>
                </div>

                <Form<ChangePasswordValues>
                    schema={changePasswordSchema}
                    onSubmit={onSubmit}
                    defaultValues={{
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                    }}
                    isLoading={loading}
                    hideSubmitButton
                    submitButtonText={submitButtonText}
                    className="space-y-6"
                >
                    <PasswordInput<ChangePasswordValues>
                        name="currentPassword"
                        label="Current Password"
                        placeholder="Enter current password"
                        required
                        icon={passwordIcon}
                    />

                    <PasswordInput<ChangePasswordValues>
                        name="newPassword"
                        label="New Password"
                        placeholder="Enter new password"
                        required
                        icon={passwordIcon}
                    />

                    <PasswordInput<ChangePasswordValues>
                        name="confirmPassword"
                        label="Confirm New Password"
                        placeholder="Confirm new password"
                        required
                        icon={passwordIcon}
                    />
                </Form>
            </div>
        </div>
    );
}