import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetUser } from '../../common/decorators/user.decorator';
import { UserRole } from '@prisma/client';
import { QueryDto } from '../../common/dto/query.dto';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser('userId') adminId: string,
  ) {
    return this.taskService.create(createTaskDto, adminId);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
    @GetUser('userId') userId: string,
    @GetUser('role') role: UserRole,
  ) {
    return this.taskService.findAll(query, userId, role);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
    @GetUser('role') role: UserRole,
  ) {
    return this.taskService.findOne(id, userId, role);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() data: any,
    @GetUser('userId') adminId: string,
  ) {
    return this.taskService.update(id, data, adminId);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser('userId') userId: string,
  ) {
    return this.taskService.updateStatus(
      id,
      updateTaskStatusDto.status,
      userId,
    );
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string, @GetUser('userId') adminId: string) {
    return this.taskService.remove(id, adminId);
  }
}
