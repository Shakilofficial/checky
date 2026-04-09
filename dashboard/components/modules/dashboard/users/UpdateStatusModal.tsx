"use client";

import { ResponsiveModal } from "@/components/core/modal/ResponsiveModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { updateUserStatus } from "@/services/user";
import { IAuthUser, UserStatus } from "@/types/auth";
import { Ban, CheckCircle2, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface UpdateStatusModalProps {
    user: IAuthUser;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function UpdateStatusModal({
    user,
    open,
    onOpenChange,
    onSuccess,
}: UpdateStatusModalProps) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string>(user.status);

    const handleUpdate = async () => {
        if (status === user.status) {
            onOpenChange(false);
            return;
        }

        setLoading(true);
        try {
            const res = await updateUserStatus(user.id, status);

            if (res.success) {
                toast.success("Account status updated", {
                    description: `Security protocols for ${user.name} have been reconfigured to ${status.toLowerCase()}.`,
                });
                onOpenChange(false);
                onSuccess?.();
            } else {
                toast.error("Operation failed", {
                    description: res.message || "Failed to update user authorization status.",
                });
            }
        } catch (error) {
            console.error(error);
            toast.error("System synchronization failure", {
                description: "The update request could not be processed at this time.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ResponsiveModal
            open={open}
            onOpenChange={onOpenChange}
            title="Update User Status"
            description={`Change status for ${user.name}`}
            maxWidth="sm"
            loading={loading}
            footer={
                <>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>

                    <Button className="text-white" onClick={handleUpdate} disabled={loading}>
                        {loading ? "Updating..." : "Update Status"}
                    </Button>
                </>
            }
        >
            <div className="space-y-6 py-4">
                <p className="text-sm text-muted-foreground">
                    Select the account status below.
                </p>

                <div className="grid grid-cols-2 gap-3">
                    {/* Active */}
                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => setStatus(UserStatus.ACTIVE)}
                        className={cn(
                            "flex items-center gap-3 rounded-xl border p-4 transition-all",
                            "hover:bg-accent/40",
                            status === UserStatus.ACTIVE
                                ? "border-green-500 bg-green-500/10"
                                : "border-border"
                        )}
                    >
                        <CheckCircle2 className="text-green-500 size-5" />
                        <div className="text-left">
                            <p className="font-medium">Active</p>
                            <p className="text-xs text-muted-foreground">
                                User can access system
                            </p>
                        </div>
                    </button>

                    {/* Blocked */}
                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => setStatus(UserStatus.BLOCKED)}
                        className={cn(
                            "flex items-center gap-3 rounded-xl border p-4 transition-all",
                            "hover:bg-accent/40",
                            status === UserStatus.BLOCKED
                                ? "border-red-500 bg-red-500/10"
                                : "border-border"
                        )}
                    >
                        <Ban className="text-red-500 size-5" />
                        <div className="text-left">
                            <p className="font-medium">Blocked</p>
                            <p className="text-xs text-muted-foreground">
                                User cannot login
                            </p>
                        </div>
                    </button>

                    {/* Inactive */}
                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => setStatus(UserStatus.INACTIVE)}
                        className={cn(
                            "flex items-center gap-3 rounded-xl border p-4 transition-all",
                            "hover:bg-accent/40",
                            status === UserStatus.INACTIVE
                                ? "border-amber-500 bg-amber-500/10"
                                : "border-border"
                        )}
                    >
                        <ShieldAlert className="text-amber-500 size-5" />
                        <div className="text-left">
                            <p className="font-medium">Inactive</p>
                            <p className="text-xs text-muted-foreground">
                                Logged out only
                            </p>
                        </div>
                    </button>
                </div>
            </div>
        </ResponsiveModal>
    );
}
