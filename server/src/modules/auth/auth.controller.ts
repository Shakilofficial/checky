import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { GetUser } from '../../common/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh-token')
  async refreshToken(@Body('token') token: string) {
    if (!token) {
      throw new UnauthorizedException('Refresh token is required');
    }
    return this.authService.refreshToken(token);
  }

  @UseGuards(AuthGuard)
  @Patch('change-password')
  async changePassword(
    @GetUser('userId') userId: string,
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    await this.authService.changePassword(userId, currentPassword, newPassword);
    return { message: 'Password changed successfully' };
  }
}
