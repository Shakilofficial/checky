"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const date_fns_1 = require("date-fns");
const prisma_service_1 = require("../../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardAnalytics() {
        const now = new Date();
        const last7Days = (0, date_fns_1.subDays)(now, 7);
        const last30Days = (0, date_fns_1.subDays)(now, 30);
        const [userCount, taskCount, auditLogCount] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.task.count(),
            this.prisma.auditLog.count(),
        ]);
        const taskStatusDist = await this.prisma.task.groupBy({
            by: ['status'],
            _count: {
                status: true,
            },
        });
        const userStatusDist = await this.prisma.user.groupBy({
            by: ['status'],
            _count: {
                status: true,
            },
        });
        const recentUsers7d = await this.prisma.user.count({
            where: { createdAt: { gte: last7Days } },
        });
        const recentTasks7d = await this.prisma.task.count({
            where: { createdAt: { gte: last7Days } },
        });
        const recentUsers30d = await this.prisma.user.count({
            where: { createdAt: { gte: last30Days } },
        });
        const recentTasks30d = await this.prisma.task.count({
            where: { createdAt: { gte: last30Days } },
        });
        const recentUsersList = await this.prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });
        return {
            meta: {
                generatedAt: now.toISOString(),
                modelsTracked: 3,
            },
            totals: {
                users: userCount,
                tasks: taskCount,
                auditLogs: auditLogCount,
            },
            status: {
                tasks: taskStatusDist.map((item) => ({
                    _id: item.status,
                    count: item._count.status,
                })),
                users: userStatusDist.map((item) => ({
                    _id: item.status,
                    count: item._count.status,
                })),
            },
            featured: {
                tasks: taskCount,
                users: userCount,
            },
            activity: {
                last7Days: {
                    users: recentUsers7d,
                    tasks: recentTasks7d,
                },
                last30Days: {
                    users: recentUsers30d,
                    tasks: recentTasks30d,
                },
            },
            highlights: {
                activeUsers: userStatusDist.find((s) => s.status === 'ACTIVE')?._count.status || 0,
                pendingTasks: taskStatusDist.find((s) => s.status === 'PENDING')?._count.status ||
                    0,
                completedTasks: taskStatusDist.find((s) => s.status === 'DONE')?._count.status || 0,
            },
            top: {
                recentUsers: recentUsersList.map((u) => ({
                    _id: u.id,
                    name: u.name,
                    email: u.email,
                    createdAt: u.createdAt.toISOString(),
                })),
            },
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map