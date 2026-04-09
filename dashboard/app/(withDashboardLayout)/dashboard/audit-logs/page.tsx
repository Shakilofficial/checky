import ManageAuditLogs from "@/components/modules/dashboard/audit-logs/ManageAuditLogs";
import PageHeader from "@/components/shared/PageHeader";
import { getAllAuditLogs } from "@/services/audit-log";
import { IAuditLog } from "@/types/audit-log";

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const AuditLogsPage = async (props: PageProps) => {
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
        sortBy,
        sortOrder,
    };

    const { data, meta } = await getAllAuditLogs(query);

    return (
        <div className="w-full mx-auto">
            <PageHeader
                title="Audit Logs"
                subtitle="Track system activities and changes."
            />
            <ManageAuditLogs
                data={(data as IAuditLog[]) || []}
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

export default AuditLogsPage;
