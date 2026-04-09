import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryDto } from '../../common/dto/query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  createLog(data: {
    action: string;
    details?: string;
    entity: string;
    entityId: string;
    userId: string;
  }) {
    return this.prisma.auditLog.create({
      data,
    });
  }

  async getAllLogs(query: QueryDto) {
    const {
      searchTerm,
      pageNum = 1,
      limitNum = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = {
      ...query,
      pageNum: Number(query.page || 1),
      limitNum: Number(query.limit || 10),
    };
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.AuditLogWhereInput = searchTerm
      ? {
          OR: [
            { action: { contains: searchTerm, mode: 'insensitive' } },
            { entity: { contains: searchTerm, mode: 'insensitive' } },
            { details: { contains: searchTerm, mode: 'insensitive' } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      this.prisma.auditLog.count({ where }),
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
}
