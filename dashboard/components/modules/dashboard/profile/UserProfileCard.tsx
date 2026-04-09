"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { IAuthUser } from "@/types/auth";
import { format } from "date-fns";
import {
    Calendar,
    CheckCircle2,
    Mail,
    Shield,
    User,
    XCircle,
} from "lucide-react";
import Link from "next/link";

interface UserProfileCardProps {
    user: IAuthUser;
}

export default function UserProfileCard({ user }: UserProfileCardProps) {
    return (
        <div className="w-full max-w-3xl mx-auto space-y-6">
            {/* Main Profile Card */}
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl shadow-sm overflow-hidden">
                {/* Header Section */}
                <div className="p-8 space-y-6">
                    {/* Avatar and Basic Info */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        <Avatar className="h-24 w-24 border-2 border-border shadow-sm">
                            <AvatarImage src={user.photo || ""} alt={user.name} />
                            <AvatarFallback className="text-3xl font-bold">
                                {user.name?.[0]?.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 text-center sm:text-left space-y-3">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">
                                    {user.name}
                                </h1>
                                <p className="text-muted-foreground mt-1 flex items-center justify-center sm:justify-start gap-2">
                                    <Mail className="h-4 w-4" />
                                    {user.email}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                <Badge variant="outline" className="capitalize">
                                    {user.status}
                                </Badge>
                                <Badge variant="destructive" className="capitalize">
                                    {user.role.replace("_", " ")}
                                </Badge>

                            </div>
                        </div>

                        {/* Edit Button - Desktop */}
                        <div className="hidden sm:block">
                            <Link href="/dashboard/settings">
                                <Button className="text-white">
                                    Edit Profile
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Details Section */}
                <div className="p-8">
                    <h2 className="text-lg font-semibold text-foreground mb-6">
                        Account Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoItem
                            label="Full Name"
                            value={user.name}
                            icon={<User className="h-4 w-4 text-primary" />}
                        />

                        <InfoItem
                            label="Email Address"
                            value={user.email}
                            icon={<Mail className="h-4 w-4 text-primary" />}
                        />

                        <InfoItem
                            label="Role"
                            value={user.role.replace("_", " ")}
                            icon={<Shield className="h-4 w-4 text-primary" />}
                        />

                        <InfoItem
                            label="Account Status"
                            value={user.status}
                            icon={
                                user.status === "ACTIVE" ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                    <XCircle className="h-4 w-4 text-red-500" />
                                )
                            }
                        />

                        <InfoItem
                            label="Member Since"
                            value={format(new Date(user.createdAt), "PPP")}
                            icon={<Calendar className="h-4 w-4 text-primary" />}
                        />

                        {user.dateOfBirth && (
                            <InfoItem
                                label="Date of Birth"
                                value={format(new Date(user.dateOfBirth), "PPP")}
                                icon={<Calendar className="h-4 w-4 text-primary" />}
                            />
                        )}
                    </div>
                </div>



                {/* Edit Button - Mobile */}
                <div className="sm:hidden p-8 pt-0">
                    <Link href="/dashboard/settings" className="block">
                        <Button className="w-full text-white">
                            Edit Profile
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

/* ======================================================
   Info Item Component
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
        <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                {label}
            </Label>
            <div className="flex items-center gap-2 font-medium">
                {icon}
                <span className="capitalize">{value}</span>
            </div>
        </div>
    );
}
