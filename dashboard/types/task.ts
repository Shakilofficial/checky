import { IAuthUser } from "./auth";

export enum TaskStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  DONE = "DONE",
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  userId: string | null;
  assignedTo?: IAuthUser | null;
  createdAt: string;
  updatedAt: string;
}
