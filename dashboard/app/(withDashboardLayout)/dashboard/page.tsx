import DashboardOverview from "@/components/modules/dashboard/overview/DashboardOverview";
import { getDashboardAnalytics } from "@/services/analytics";
import { getAllTasks } from "@/services/task";
import { IAnalyticsData } from "@/types/analytics";
import { ITask } from "@/types/task";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const DashboardPage = async (props: PageProps) => {
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
    limit: searchParams.limit ? Number(searchParams.limit) : 5,
    searchTerm: searchParams.searchTerm as string,
    status: searchParams.status !== "all" ? (searchParams.status as string) : undefined,
    sortBy,
    sortOrder,
  };

  const [analyticsRes, tasksRes] = await Promise.all([
    getDashboardAnalytics(),
    getAllTasks(query)
  ]);

  const analyticsData: IAnalyticsData = analyticsRes?.success && analyticsRes?.data 
    ? analyticsRes.data 
    : {
        totals: { users: 0, tasks: 0, auditLogs: 0 },
        highlights: { activeUsers: 0, pendingTasks: 0, completedTasks: 0 },
        status: { users: [], tasks: [] },
        featured: { users: 0, tasks: 0 },
        activity: { 
            last7Days: { users: 0, tasks: 0 }, 
            last30Days: { users: 0, tasks: 0 } 
        },
        top: { recentUsers: [] }
      };

  const tasksData = (tasksRes?.data as ITask[]) || [];
  const tasksMeta = tasksRes?.meta || {
    page: 1,
    limit: 5,
    total: 0,
    totalPage: 1,
  };

  return (
    <div className="w-full mx-auto">
      <DashboardOverview
        data={analyticsData}
        tasks={tasksData}
        tasksMeta={tasksMeta}
        loading={!analyticsRes?.success}
      />
    </div>
  );
};

export default DashboardPage;
