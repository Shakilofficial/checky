import { PrismaService } from '../../prisma/prisma.service';
import { QueryDto } from '../../common/dto/query.dto';
import { Prisma } from '@prisma/client';
export declare class AuditLogService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createLog(data: {
        action: string;
        details?: string;
        entity: string;
        entityId: string;
        userId: string;
    }): Prisma.Prisma__AuditLogClient<{
        id: string;
        createdAt: Date;
        userId: string;
        action: string;
        details: string | null;
        entity: string;
        entityId: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    getAllLogs(query: QueryDto): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPage: number;
        };
        data: ({
            user: {
                id: string;
                email: string;
                name: string;
                role: import("@prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            action: string;
            details: string | null;
            entity: string;
            entityId: string;
        })[];
    }>;
}
