import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { QueryDto } from '../../common/dto/query.dto';

@Controller('audit-logs')
@UseGuards(AuthGuard)
@Roles(UserRole.ADMIN)
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  async getAllLogs(@Query() query: QueryDto) {
    return this.auditLogService.getAllLogs(query);
  }
}
