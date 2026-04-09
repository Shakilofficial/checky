import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboardAnalytics(): Promise<{
        meta: {
            generatedAt: string;
            modelsTracked: number;
        };
        totals: {
            users: number;
            tasks: number;
            auditLogs: number;
        };
        status: {
            tasks: {
                _id: import("@prisma/client").$Enums.TaskStatus;
                count: number;
            }[];
            users: {
                _id: import("@prisma/client").$Enums.UserStatus;
                count: number;
            }[];
        };
        featured: {
            tasks: number;
            users: number;
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
            recentUsers: {
                _id: string;
                name: string;
                email: string;
                createdAt: string;
            }[];
        };
    }>;
}
