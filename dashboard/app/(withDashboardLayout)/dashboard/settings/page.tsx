import ManageSettings from "@/components/modules/dashboard/settings/ManageSettings";
import PageHeader from "@/components/shared/PageHeader";
import { getMe } from "@/services/user";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const SettingsPage = async () => {
    const response = await getMe();

    if (!response?.success || !response?.data) {
        redirect("/login");
    }

    const user = response.data;

    return (
        <div className="w-full mx-auto">
            <PageHeader
                title="Settings"
                subtitle="Manage your account settings and preferences"
            />
            <ManageSettings user={user} />
        </div>
    );
};

export default SettingsPage;