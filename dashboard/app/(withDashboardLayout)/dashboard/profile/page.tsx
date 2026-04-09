import UserProfileCard from "@/components/modules/dashboard/profile/UserProfileCard";
import PageHeader from "@/components/shared/PageHeader";
import { getMe } from "@/services/user";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const ProfilePage = async () => {
    const response = await getMe();

    if (!response?.success || !response?.data) {
        redirect("/login");
    }

    const user = response.data;

    return (
        <div className="w-full mx-auto">
            <PageHeader
                title="My Profile"
                subtitle="View and manage your personal information"
            />
            <UserProfileCard user={user} />
        </div>
    );
};

export default ProfilePage;