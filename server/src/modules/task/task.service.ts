import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus, UserRole, Prisma } from '@prisma/client';
import { QueryDto } from '../../common/dto/query.dto';

@Injectable()
export class TaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(createTaskDto: CreateTaskDto, adminId: string) {
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

  async findAll(query: QueryDto, userId: string, role: UserRole) {
    const {
      searchTerm,
      pageNum = 1,
      limitNum = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status,
    } = {
      ...query,
      pageNum: Number(query.page || 1),
      limitNum: Number(query.limit || 10),
    };
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.TaskWhereInput = {};

    if (role !== UserRole.ADMIN) {
      where.userId = userId;
    }

    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status as TaskStatus;
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

  async findOne(id: string, userId: string, role: UserRole) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    if (!task) throw new NotFoundException('Task not found');

    if (role !== UserRole.ADMIN && task.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return task;
  }

  async update(id: string, data: any, adminId: string) {
    const oldTask = await this.prisma.task.findUnique({ where: { id } });
    if (!oldTask) throw new NotFoundException('Task not found');

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

  async updateStatus(id: string, status: TaskStatus, userId: string) {
    const oldTask = await this.prisma.task.findUnique({ where: { id } });
    if (!oldTask) throw new NotFoundException('Task not found');

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

  async remove(id: string, adminId: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

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
}
