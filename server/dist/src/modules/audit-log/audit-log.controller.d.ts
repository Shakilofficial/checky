import { AuditLogService } from './audit-log.service';
import { QueryDto } from '../../common/dto/query.dto';
export declare class AuditLogController {
    private readonly auditLogService;
    constructor(auditLogService: AuditLogService);
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
