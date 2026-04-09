import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

interface JwtPayload {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordMatched = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userId: user.id, role: user.role };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('config.jwt.accessSecret'),
      expiresIn: this.configService.get<string>(
        'config.jwt.accessExpires',
      ) as any,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('config.jwt.refreshSecret'),
      expiresIn: this.configService.get<string>(
        'config.jwt.refreshExpires',
      ) as any,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get<string>('config.jwt.refreshSecret'),
      });

      const user = await this.userService.findById(payload.userId);

      const newPayload = { userId: user.id, role: user.role };
      const accessToken = await this.jwtService.signAsync(newPayload, {
        secret: this.configService.get<string>('config.jwt.accessSecret'),
        expiresIn: this.configService.get<string>(
          'config.jwt.accessExpires',
        ) as any,
      });

      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.userService.findById(userId);

    const isMatched = await bcrypt.compare(currentPassword, user.password);
    if (!isMatched) {
      throw new UnauthorizedException('Wrong password');
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      this.configService.get<number>('config.bcryptSaltRounds') || 10,
    );

    await this.userService.update(userId, {
      password: hashedPassword,
    });
  }
}
