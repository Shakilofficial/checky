
"use server";

import { BASE_API } from "@/lib/baseApi";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { IQueryParams, IResponse } from "@/types/common";
import { ITask } from "@/types/task";
import { FieldValues } from "react-hook-form";

/* ------------------------------
   Get All Tasks
------------------------------- */
export const getAllTasks = async (query: IQueryParams = {}): Promise<IResponse<ITask[]>> => {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v.toString()));
      } else {
        params.append(key, value.toString());
      }
    }
  });

  const url = `${BASE_API}/tasks?${params.toString()}`;

  return fetchWithAuth(url, {
    method: "GET",
    cache: "no-store",
  });
};

/* ------------------------------
   Get Task By Id
------------------------------- */
export const getTaskById = async (id: string): Promise<IResponse<ITask>> => {
  return fetchWithAuth(`${BASE_API}/tasks/${id}`, {
    method: "GET",
    next: { tags: ["TASK"] },
  });
};

/* ------------------------------
   Create Task
------------------------------- */
export const createTask = async (data: FieldValues): Promise<IResponse> => {
  return fetchWithAuth(`${BASE_API}/tasks`, {
    method: "POST",
    body: JSON.stringify(data),
    next: { tags: ["TASK"] },
  });
};

/* ------------------------------
   Update Task
------------------------------- */
export const updateTask = async (
  id: string,
  data: FieldValues
): Promise<IResponse> => {
  return fetchWithAuth(`${BASE_API}/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    next: { tags: ["TASK"] },
  });
};

/* ------------------------------
   Update Task Status
------------------------------- */
export const updateTaskStatus = async (
  id: string,
  status: string
): Promise<IResponse> => {
  return fetchWithAuth(`${BASE_API}/tasks/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
    next: { tags: ["TASK"] },
  });
};

/* ------------------------------
   Delete Task
------------------------------- */
export const deleteTask = async (id: string): Promise<IResponse> => {
  return fetchWithAuth(`${BASE_API}/tasks/${id}`, {
    method: "DELETE",
    next: { tags: ["TASK"] },
  });
};
