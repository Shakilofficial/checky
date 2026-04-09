"use client";

import { Button } from "@/components/ui/button";
import { IAuthUser } from "@/types/auth";
import { Edit, Eye, ShieldAlert, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteUserModal } from "./DeleteUserModal";
import { EditUserModal } from "./EditUserModal";
import { UpdateStatusModal } from "./UpdateStatusModal";
import { ViewUserModal } from "./ViewUserModal";

interface UserActionsProps {
    user: IAuthUser;
}

export function UserActions({ user }: UserActionsProps) {
    const router = useRouter();
    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);

    const handleSuccess = () => {
        router.refresh();
    };

    return (
        <>
            <div className="flex items-center justify-start gap-2">
                {/* View Action */}
                <Button
                    variant="secondary"
                    size="icon"
                    title="View User"
                    className="h-8 w-8 text-white"
                    onClick={() => setViewOpen(true)}
                >
                    <Eye className="h-4 w-4" />
                </Button>

                {/* Edit Action */}
                <Button
                    variant="outline"
                    size="icon"
                    title="Edit User"
                    className="h-8 w-8"
                    onClick={() => setEditOpen(true)}
                >
                    <Edit className="h-4 w-4" />
                </Button>

                {/* Status Action */}
                <Button
                    variant="ghost"
                    size="icon"
                    title="Update Status"
                    className="h-8 w-8 hover:bg-amber-100 hover:text-amber-600"
                    onClick={() => setStatusOpen(true)}
                >
                    <ShieldAlert className="h-4 w-4" />
                </Button>

                {/* Delete Action */}
                <Button
                    variant="destructive"
                    size="icon"
                    title="Delete User"
                    className="h-8 w-8"
                    onClick={() => setDeleteOpen(true)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            <ViewUserModal
                userId={user.id}
                open={viewOpen}
                onOpenChange={setViewOpen}
            />

            <EditUserModal
                user={user}
                open={editOpen}
                onOpenChange={setEditOpen}
                onSuccess={handleSuccess}
            />

            <UpdateStatusModal
                user={user}
                open={statusOpen}
                onOpenChange={setStatusOpen}
                onSuccess={handleSuccess}
            />

            <DeleteUserModal
                userId={user.id}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onSuccess={handleSuccess}
            />
        </>
    );
}
