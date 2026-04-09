import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole, UserStatus } from '@prisma/client';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetUser } from '../../common/decorators/user.decorator';
import { QueryDto } from '../../common/dto/query.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async getAllUsers(@Query() query: QueryDto) {
    return this.userService.getAllUsers(query);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMyProfile(@GetUser('userId') userId: string) {
    return this.userService.findById(userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Patch('me')
  @UseGuards(AuthGuard)
  async updateMyProfile(@GetUser('userId') userId: string, @Body() data: any) {
    return this.userService.update(userId, data);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() data: any) {
    return this.userService.update(id, data);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: UserStatus,
  ) {
    return this.userService.toggleStatus(id, status);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
