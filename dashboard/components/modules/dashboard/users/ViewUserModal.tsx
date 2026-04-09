"use client";

import { ResponsiveModal } from "@/components/core/modal/ResponsiveModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserById } from "@/services/user";
import { IAuthUser } from "@/types/auth";
import { format } from "date-fns";
import { Calendar, Mail, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

/* ======================================================
   Types
====================================================== */

interface ViewUserModalProps {
    userId?: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/* ======================================================
   Component
====================================================== */

export function ViewUserModal({
    userId,
    open,
    onOpenChange,
}: ViewUserModalProps) {
    const [user, setUser] = useState<IAuthUser | null>(null);
    const [loading, setLoading] = useState(false);

    /* ======================================================
       Fetch User
    ====================================================== */

    useEffect(() => {
        if (!open || !userId) return;

        const fetchUser = async () => {
            setLoading(true);

            try {
                const res = await getUserById(userId);

                if (res?.success && res?.data) {
                    setUser(res.data);
                } else {
                    toast.error("Failed to load user");
                    onOpenChange(false);
                }
            } catch {
                toast.error("Something went wrong");
                onOpenChange(false);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();

        return () => setUser(null);
    }, [open, userId, onOpenChange]);

    /* ======================================================
       Render
    ====================================================== */

    return (
        <ResponsiveModal
            open={open}
            onOpenChange={onOpenChange}
            title="User Details"
            description="Complete profile information"
            maxWidth="lg"
            loading={loading}
            footer={
                <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="rounded-xl px-8 font-semibold border-2"
                >
                    Close Profile
                </Button>
            }
        >
            {/* Loading */}
            {loading && <UserSkeleton />}

            {/* User Info */}
            {!loading && user && <UserProfile user={user} />}

            {/* Empty */}
            {!loading && !user && (
                <div className="py-10 text-center text-muted-foreground">
                    User not found
                </div>
            )}
        </ResponsiveModal>
    );
}

/* ======================================================
   Skeleton
====================================================== */

function UserSkeleton() {
    return (
        <div className="space-y-5">
            <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>

            <Skeleton className="h-32 w-full rounded-xl" />
        </div>
    );
}

/* ======================================================
   Profile
====================================================== */

function UserProfile({ user }: { user: IAuthUser }) {
    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-3 duration-500">
            {/* Header */}
            <div className="relative p-6 rounded-4xl bg-zinc-50 dark:bg-zinc-900/50 border border-border/40 overflow-hidden shadow-sm flex flex-col md:flex-row items-center gap-6">
                <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                    <AvatarImage src={user.photo || ""} />
                    <AvatarFallback className="text-2xl font-black bg-primary/10 text-primary">
                        {user.name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="text-center md:text-left space-y-2">
                    <h3 className="text-2xl md:text-3xl font-black tracking-tight">{user.name}</h3>
                    <p className="text-base text-muted-foreground font-medium">{user.email}</p>

                    <div className="flex justify-center md:justify-start gap-2.5 mt-2">
                        <Badge className="px-4 py-1 text-[10px] font-black tracking-widest text-white rounded-full bg-emerald-500 border-0 shadow-sm uppercase">
                            {user.status}
                        </Badge>
                        <Badge className="px-4 py-1 text-[10px] font-black tracking-widest text-white rounded-full bg-primary border-0 shadow-sm uppercase">
                            {user.role.replace("_", " ")}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="space-y-4 px-1">
                <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">
                        Identity Profile
                    </Label>
                    <div className="h-px flex-1 mx-4 bg-linear-to-r from-border/80 to-transparent" />
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem
                        label="SYSTEM ROLE"
                        value={user.role.replace("_", " ")}
                        icon={<Shield className="h-4 w-4 text-primary" />}
                    />

                    <InfoItem
                        label="ONBOARDED"
                        value={format(new Date(user.createdAt), "MMM d, yyyy")}
                        icon={<Calendar className="h-4 w-4 text-primary" />}
                    />

                    <InfoItem
                        label="SECURE EMAIL"
                        value={user.email}
                        icon={<Mail className="h-4 w-4 text-primary" />}
                    />

                    {user.dateOfBirth && (
                        <InfoItem
                            label="BIRTH DATE"
                            value={format(new Date(user.dateOfBirth), "MMM d, yyyy")}
                            icon={<User className="h-4 w-4 text-primary" />}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

/* ======================================================
   Info Item
====================================================== */

function InfoItem({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 space-y-2 group transition-all hover:bg-muted/50">
            <div className="flex items-center justify-between">
                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">
                    {label}
                </Label>
                <div className="opacity-30 group-hover:opacity-100 transition-opacity">
                    {icon}
                </div>
            </div>

            <p className="text-sm font-bold text-foreground truncate">{value}</p>
        </div>
    );
}
