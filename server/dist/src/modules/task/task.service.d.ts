import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus, UserRole } from '@prisma/client';
import { QueryDto } from '../../common/dto/query.dto';
export declare class TaskService {
    private readonly prisma;
    private readonly auditLogService;
    constructor(prisma: PrismaService, auditLogService: AuditLogService);
    create(createTaskDto: CreateTaskDto, adminId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        userId: string | null;
    }>;
    findAll(query: QueryDto, userId: string, role: UserRole): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPage: number;
        };
        data: ({
            assignedTo: {
                id: string;
                email: string;
                name: string;
            } | null;
        } & {
            id: string;
            status: import("@prisma/client").$Enums.TaskStatus;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            userId: string | null;
        })[];
    }>;
    findOne(id: string, userId: string, role: UserRole): Promise<{
        assignedTo: {
            id: string;
            email: string;
            name: string;
        } | null;
    } & {
        id: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        userId: string | null;
    }>;
    update(id: string, data: any, adminId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        userId: string | null;
    }>;
    updateStatus(id: string, status: TaskStatus, userId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        userId: string | null;
    }>;
    remove(id: string, adminId: string): Promise<{
        message: string;
    }>;
}
