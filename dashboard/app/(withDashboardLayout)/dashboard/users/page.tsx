import ManageUsers from "@/components/modules/dashboard/users/ManageUsers";
import PageHeader from "@/components/shared/PageHeader";
import { getAllUsers } from "@/services/user";
import { IAuthUser } from "@/types/auth";

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const UsersPage = async (props: PageProps) => {
    const searchParams = await props.searchParams;

    let sortBy;
    let sortOrder;
    if (searchParams.sort) {
        const sortString = searchParams.sort as string;
        if (sortString.startsWith("-")) {
            sortOrder = "desc";
            sortBy = sortString.substring(1);
        } else {
            sortOrder = "asc";
            sortBy = sortString;
        }
    }

    const query = {
        page: searchParams.page ? Number(searchParams.page) : 1,
        limit: searchParams.limit ? Number(searchParams.limit) : 10,
        searchTerm: searchParams.searchTerm as string,
        role: searchParams.role !== "all" ? (searchParams.role as string) : undefined,
        status: searchParams.status !== "all" ? (searchParams.status as string) : undefined,
        sortBy,
        sortOrder,
    };

    const { data, meta } = await getAllUsers(query);

    return (
        <div className="w-full mx-auto">
            <PageHeader
                title="Users Management"
                subtitle="Manage users and their permissions."
            />
            <ManageUsers
                data={(data as IAuthUser[]) || []}
                meta={
                    meta || {
                        page: 1,
                        limit: 10,
                        total: 0,
                        totalPage: 1,
                    }
                }
            />
        </div>
    );
};

export default UsersPage;