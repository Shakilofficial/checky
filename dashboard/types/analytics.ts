export interface IAnalyticsData {
    meta?: {
        generatedAt: string;
        modelsTracked: number;
    };
    totals: {
        users: number;
        tasks: number;
        auditLogs: number;
    };
    status: {
        users: { _id: string; count: number }[];
        tasks: { _id: string; count: number }[];
    };
    featured: {
        users: number;
        tasks: number;
    };
    activity: {
        last7Days: {
            users: number;
            tasks: number;
        };
        last30Days: {
            users: number;
            tasks: number;
        };
    };
    highlights: {
        activeUsers: number;
        pendingTasks: number;
        completedTasks: number;
    };
    top: {
        recentUsers: { _id: string; name: string; email: string; createdAt: string }[];
    };
}
