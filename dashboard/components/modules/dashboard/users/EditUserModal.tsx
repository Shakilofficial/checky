"use client";

import { DateTimePickerInput } from "@/components/core/form/DateTimePickerInput";
import { Form } from "@/components/core/form/Form";
import { ImageUploadInput } from "@/components/core/form/ImageUploadInput";
import { TextInput } from "@/components/core/form/TextInput";
import { ResponsiveModal } from "@/components/core/modal/ResponsiveModal";
import { updateUserById } from "@/services/user";
import { IAuthUser } from "@/types/auth";
import { Calendar, Image as ImageIcon, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

/* ----------------------------------
   Schema
---------------------------------- */
const editUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    dateOfBirth: z.date().nullable().optional(),
    photo: z.any().optional(),
});

export type EditUserValues = z.infer<typeof editUserSchema>;

/* ----------------------------------
   Props
---------------------------------- */
interface EditUserModalProps {
    user: IAuthUser;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

/* ----------------------------------
   Component
---------------------------------- */
export function EditUserModal({
    user,
    open,
    onOpenChange,
    onSuccess,
}: EditUserModalProps) {
    const [loading, setLoading] = useState(false);

    /* ----------------------------------
       Submit Handler
    ---------------------------------- */
    const onSubmit = async (data: EditUserValues) => {
        try {
            setLoading(true);

            const formData = new FormData();
            const payload = {
                name: data.name || undefined,
                dateOfBirth: data.dateOfBirth
                    ? new Date(data.dateOfBirth).toISOString()
                    : null,
            };

            formData.append("data", JSON.stringify(payload));

            if (data.photo instanceof File) {
                formData.append("photo", data.photo);
            }

            const res = await updateUserById(user.id, formData);

            if (!res?.success) {
                toast.error(res?.message || "Failed to update profile");
                return;
            }

            toast.success(res.message || "Profile updated successfully");
            onOpenChange(false);
            onSuccess?.();
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    /* ----------------------------------
       Render
    ---------------------------------- */
    return (
        <ResponsiveModal
            open={open}
            onOpenChange={onOpenChange}
            title="Edit Profile"
            description="Update your personal information"
            maxWidth="md"
            loading={loading}
        >
            <Form<EditUserValues>
                schema={editUserSchema}
                onSubmit={onSubmit}
                defaultValues={{
                    name: user.name ?? "",
                    dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null,
                    photo: undefined,
                }}
                isLoading={loading}
                submitButtonText="Save Changes"
                className="space-y-6"
            >
                {/* Profile Photo */}
                <ImageUploadInput
                    name="photo"
                    label="Profile Photo"
                    defaultImage={user.photo || ""}
                    previewClassName="h-28 w-28 rounded-full object-cover border"
                    containerClassName="flex flex-col items-center gap-4"
                    icon={<ImageIcon className="h-4 w-4" />}
                />

                {/* Full Name */}
                <TextInput
                    name="name"
                    label="Full Name"
                    placeholder="Enter your full name"
                    icon={<User className="h-4 w-4" />}
                />

                {/* Date of Birth */}
                <DateTimePickerInput
                    name="dateOfBirth"
                    label="Date of Birth"
                    placeholder="Select your birth date"
                    icon={<Calendar className="h-4 w-4" />}
                />
            </Form>
        </ResponsiveModal>
    );
}
