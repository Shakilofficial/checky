"use client";

import { ResponsiveModal } from "@/components/core/modal/ResponsiveModal";
import { Button } from "@/components/ui/button";
import { deleteUser } from "@/services/user";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteUserModalProps {
    userId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function DeleteUserModal({
    userId,
    open,
    onOpenChange,
    onSuccess,
}: DeleteUserModalProps) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const res = await deleteUser(userId);

            if (res.success) {
                toast.success(res.message || "User deleted successfully");
                onOpenChange(false);
                onSuccess?.();
            } else {
                toast.error(res.message || "Failed to delete user");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ResponsiveModal
            open={open}
            onOpenChange={onOpenChange}
            title="Delete User"
            description={`Are you sure you want to delete this user?`}
            maxWidth="sm"
            loading={loading}
            footer={
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                        className="min-w-[100px]"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={loading}
                        className="min-w-[120px]"
                    >
                        {loading ? "Deleting..." : "Delete User"}
                    </Button>
                </div>
            }
        >
            <div className="text-sm text-muted-foreground">
                <p>
                    This action <span className="font-semibold text-destructive">cannot</span> be undone.
                </p>
                <p className="mt-1">
                    Please confirm that you want to permanently delete this user and remove all their data.
                </p>
            </div>
        </ResponsiveModal>
    );
}
