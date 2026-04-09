export const UserRole = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export const UserStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  BLOCKED: "BLOCKED",
} as const;

export type UserStatusType = (typeof UserStatus)[keyof typeof UserStatus];


export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  photo: string | null;
  dateOfBirth: string | null;
  role: UserRoleType;
  status: UserStatusType;
  createdAt: string;
  updatedAt: string;
}