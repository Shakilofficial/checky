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
exports.TaskService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const client_1 = require("@prisma/client");
let TaskService = class TaskService {
    prisma;
    auditLogService;
    constructor(prisma, auditLogService) {
        this.prisma = prisma;
        this.auditLogService = auditLogService;
    }
    async create(createTaskDto, adminId) {
        const task = await this.prisma.task.create({
            data: createTaskDto,
        });
        await this.auditLogService.createLog({
            action: 'TASK_CREATED',
            details: `Task titled "${task.title}" created and assigned to ${task.userId || 'none'}`,
            entity: 'TASK',
            entityId: task.id,
            userId: adminId,
        });
        return task;
    }
    async findAll(query, userId, role) {
        const { searchTerm, pageNum = 1, limitNum = 10, sortBy = 'createdAt', sortOrder = 'desc', status, } = {
            ...query,
            pageNum: Number(query.page || 1),
            limitNum: Number(query.limit || 10),
        };
        const skip = (pageNum - 1) * limitNum;
        const where = {};
        if (role !== client_1.UserRole.ADMIN) {
            where.userId = userId;
        }
        if (searchTerm) {
            where.OR = [
                { title: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } },
            ];
        }
        if (status) {
            where.status = status;
        }
        const [data, total] = await Promise.all([
            this.prisma.task.findMany({
                where,
                skip,
                take: limitNum,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    assignedTo: { select: { id: true, name: true, email: true } },
                },
            }),
            this.prisma.task.count({ where }),
        ]);
        return {
            meta: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPage: Math.ceil(total / limitNum),
            },
            data,
        };
    }
    async findOne(id, userId, role) {
        const task = await this.prisma.task.findUnique({
            where: { id },
            include: {
                assignedTo: { select: { id: true, name: true, email: true } },
            },
        });
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        if (role !== client_1.UserRole.ADMIN && task.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return task;
    }
    async update(id, data, adminId) {
        const oldTask = await this.prisma.task.findUnique({ where: { id } });
        if (!oldTask)
            throw new common_1.NotFoundException('Task not found');
        const task = await this.prisma.task.update({
            where: { id },
            data,
        });
        await this.auditLogService.createLog({
            action: 'TASK_UPDATED',
            details: `Task updated. Changes: ${JSON.stringify(data)}`,
            entity: 'TASK',
            entityId: task.id,
            userId: adminId,
        });
        return task;
    }
    async updateStatus(id, status, userId) {
        const oldTask = await this.prisma.task.findUnique({ where: { id } });
        if (!oldTask)
            throw new common_1.NotFoundException('Task not found');
        const task = await this.prisma.task.update({
            where: { id },
            data: { status },
        });
        await this.auditLogService.createLog({
            action: 'TASK_STATUS_CHANGED',
            details: `Status changed from ${oldTask.status} to ${status}`,
            entity: 'TASK',
            entityId: task.id,
            userId,
        });
        return task;
    }
    async remove(id, adminId) {
        const task = await this.prisma.task.findUnique({ where: { id } });
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        await this.prisma.task.delete({ where: { id } });
        await this.auditLogService.createLog({
            action: 'TASK_DELETED',
            details: `Task titled "${task.title}" was deleted`,
            entity: 'TASK',
            entityId: task.id,
            userId: adminId,
        });
        return { message: 'Task deleted successfully' };
    }
};
exports.TaskService = TaskService;
exports.TaskService = TaskService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_log_service_1.AuditLogService])
], TaskService);
//# sourceMappingURL=task.service.js.map