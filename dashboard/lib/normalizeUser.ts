/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAuthUser, UserRoleType, UserStatusType } from "@/types/auth";

export function normalizeAuthUser(data: any): IAuthUser {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid user data");
  }

  return {
    id: String(data.id || data._id || ""),
    name: String(data.name || ""),
    email: String(data.email || ""),
    photo: (data.photo as string) ?? null,
    dateOfBirth: (data.dateOfBirth as string) ?? null,
    role: data.role as UserRoleType,
    status: data.status as UserStatusType,
    createdAt: String(data.createdAt || ""),
    updatedAt: String(data.updatedAt || ""),
  };
}
