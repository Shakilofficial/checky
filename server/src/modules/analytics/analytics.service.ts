import { Injectable } from '@nestjs/common';
import { subDays } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardAnalytics() {
    const now = new Date();
    const last7Days = subDays(now, 7);
    const last30Days = subDays(now, 30);

    // 1. Totals
    const [userCount, taskCount, auditLogCount] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.task.count(),
      this.prisma.auditLog.count(),
    ]);

    // 2. Status Distributions
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

    // 3. Activity (7 days)
    const recentUsers7d = await this.prisma.user.count({
      where: { createdAt: { gte: last7Days } },
    });
    const recentTasks7d = await this.prisma.task.count({
      where: { createdAt: { gte: last7Days } },
    });

    // 4. Activity (30 days)
    const recentUsers30d = await this.prisma.user.count({
      where: { createdAt: { gte: last30Days } },
    });
    const recentTasks30d = await this.prisma.task.count({
      where: { createdAt: { gte: last30Days } },
    });

    // 5. Recent Users
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
        activeUsers:
          userStatusDist.find((s) => s.status === 'ACTIVE')?._count.status || 0,
        pendingTasks:
          taskStatusDist.find((s) => s.status === 'PENDING')?._count.status ||
          0,
        completedTasks:
          taskStatusDist.find((s) => s.status === 'DONE')?._count.status || 0,
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
}
