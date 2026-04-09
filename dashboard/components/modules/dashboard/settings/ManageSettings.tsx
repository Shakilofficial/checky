"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IAuthUser } from "@/types/auth";
import { KeyRound, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangePassword } from "./ChangePassword";
import { ProfileSettings } from "./ProfileSettings";

interface ManageSettingsProps {
    user: IAuthUser;
}

export default function ManageSettings({ user }: ManageSettingsProps) {
    const router = useRouter();

    /* -----------------------------
       Success Handlers
    ----------------------------- */

    const handleProfileUpdated = () => {
        router.refresh();
    };

    const handlePasswordChanged = () => {
        router.refresh();
    };

    /* -----------------------------
       Render
    ----------------------------- */

    return (
        <div className="w-full">
            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="password" className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4" />
                        Password
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-6">
                    <ProfileSettings
                        user={user}
                        onSuccess={handleProfileUpdated}
                    />
                </TabsContent>

                <TabsContent value="password" className="mt-6">
                    <ChangePassword onSuccess={handlePasswordChanged} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
