import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserStatus } from '@prisma/client';
import { QueryDto } from '../../common/dto/query.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<{
        id: string;
        email: string;
        name: string;
        password: string;
        photo: string | null;
        dateOfBirth: Date | null;
        role: import("@prisma/client").$Enums.UserRole;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllUsers(query: QueryDto): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPage: number;
        };
        data: {
            id: string;
            email: string;
            name: string;
            password: string;
            photo: string | null;
            dateOfBirth: Date | null;
            role: import("@prisma/client").$Enums.UserRole;
            status: import("@prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    getMyProfile(userId: string): Promise<{
        id: string;
        email: string;
        name: string;
        password: string;
        photo: string | null;
        dateOfBirth: Date | null;
        role: import("@prisma/client").$Enums.UserRole;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        password: string;
        photo: string | null;
        dateOfBirth: Date | null;
        role: import("@prisma/client").$Enums.UserRole;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateMyProfile(userId: string, data: any): Promise<{
        id: string;
        email: string;
        name: string;
        password: string;
        photo: string | null;
        dateOfBirth: Date | null;
        role: import("@prisma/client").$Enums.UserRole;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        email: string;
        name: string;
        password: string;
        photo: string | null;
        dateOfBirth: Date | null;
        role: import("@prisma/client").$Enums.UserRole;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateStatus(id: string, status: UserStatus): Promise<{
        id: string;
        email: string;
        name: string;
        password: string;
        photo: string | null;
        dateOfBirth: Date | null;
        role: import("@prisma/client").$Enums.UserRole;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        password: string;
        photo: string | null;
        dateOfBirth: Date | null;
        role: import("@prisma/client").$Enums.UserRole;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
