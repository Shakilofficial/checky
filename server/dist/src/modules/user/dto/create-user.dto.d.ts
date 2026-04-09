import { UserRole, UserStatus } from '@prisma/client';
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    photo?: string;
    dateOfBirth?: Date;
    role?: UserRole;
    status?: UserStatus;
}
