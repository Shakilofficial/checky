import { IAuthUser } from "./auth";

export interface IAuditLog {
  id: string;
  action: string;
  details: string | null;
  entity: string;
  entityId: string;
  userId: string;
  user: IAuthUser;
  createdAt: string;
}
