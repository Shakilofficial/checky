"use client";

import { Calendar, Image as ImageIcon, Mail, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { DateTimePickerInput } from "@/components/core/form/DateTimePickerInput";
import { Form } from "@/components/core/form/Form";
import { ImageUploadInput } from "@/components/core/form/ImageUploadInput";
import { TextInput } from "@/components/core/form/TextInput";

import { updateMyProfile } from "@/services/user";
import { IAuthUser } from "@/types/auth";

/* ----------------------------------
   Schema
---------------------------------- */
const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    dateOfBirth: z.date().nullable().optional(),
    photo: z.any().optional(), // File | undefined
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

/* ----------------------------------
   Props
---------------------------------- */
interface ProfileSettingsProps {
    user: IAuthUser;
    onSuccess?: () => void;
}

/* ----------------------------------
   Component
---------------------------------- */
export function ProfileSettings({ user, onSuccess }: ProfileSettingsProps) {
    const [loading, setLoading] = useState(false);

    /* ----------------------------------
       Submit Handler
    ---------------------------------- */
    const onSubmit = async (data: ProfileFormValues) => {
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

            const res = await updateMyProfile(formData);

            if (!res?.success) {
                toast.error(res?.message || "Failed to update profile");
                return;
            }

            toast.success(res.message || "Profile updated successfully");
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
        <div className="max-w-3xl mx-auto">
            <div className="bg-card/5 backdrop-blur-sm border border-border rounded-lg p-6 shadow-sm">
                <div className="mb-6 flex flex-col items-center gap-1">
                    <h2 className="text-2xl font-bold text-foreground">Profile Settings</h2>
                    <p className="text-sm text-muted-foreground">
                        Update your personal information and profile photo
                    </p>
                </div>

                <Form<ProfileFormValues>
                    schema={profileSchema}
                    onSubmit={onSubmit}
                    defaultValues={{
                        name: user.name ?? "",
                        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null,
                        photo: undefined,
                    }}
                    isLoading={loading}
                    hideSubmitButton
                    submitButtonText="Save Changes"
                    className="space-y-6"
                >
                    {/* Profile Photo */}
                    <ImageUploadInput
                        name="photo"
                        label="Profile Photo"
                        defaultImage={user.photo || ""}
                        previewClassName="h-32 w-32 rounded-full object-cover border-2 border-border"
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

                    {/* Email (read-only) */}
                    <TextInput
                        name="email"
                        label="Email Address"
                        placeholder={user.email}
                        icon={<Mail className="h-4 w-4" />}
                        value={user.email}
                        disabled
                        readOnly
                    />

                    {/* Date of Birth */}
                    <DateTimePickerInput
                        name="dateOfBirth"
                        label="Date of Birth"
                        placeholder="Select your birth date"
                        icon={<Calendar className="h-4 w-4" />}
                    />
                </Form>
            </div>
        </div>
    );
}