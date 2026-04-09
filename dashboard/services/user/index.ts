
"use server";

import { BASE_API } from "@/lib/baseApi";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { getValidToken } from "@/lib/token";
import { IQueryParams, IResponse } from "@/types/common";
import { IAuthUser } from "@/types/auth";
import { FieldValues } from "react-hook-form";

/* ------------------------------
   Get Me
------------------------------- */
export const getMe = async (): Promise<IResponse<IAuthUser>> => {
  const token = await getValidToken();

  if (!token) {
    return {
      success: false,
      message: "Not authenticated",
      data: undefined,
    };
  }

  return fetchWithAuth(`${BASE_API}/users/me`, {
    method: "GET",
    next: { tags: ["USER"] },
  });
};

/* ------------------------------
   Change Password
------------------------------- */
export const changePassword = async (data: FieldValues): Promise<IResponse> => {
  return fetchWithAuth(`${BASE_API}/auth/change-password`, {
    method: "PATCH",
    body: JSON.stringify(data),
    next: { tags: ["USER"] },
  });
};

/* ------------------------------
   Get All Users
------------------------------- */
export const getAllUsers = async (query: IQueryParams = {}): Promise<IResponse<IAuthUser[]>> => {
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

  const url = `${BASE_API}/users?${params.toString()}`;

  return fetchWithAuth(url, {
    method: "GET",
    cache: "no-store",
  });
};

/* ------------------------------
   Get User By Id
------------------------------- */
export const getUserById = async (id: string): Promise<IResponse<IAuthUser>> => {
  return fetchWithAuth(`${BASE_API}/users/${id}`, {
    method: "GET",
    next: { tags: ["USER"] },
  });
};

/* ------------------------------
   Create User
------------------------------- */
export const createUser = async (data: FieldValues): Promise<IResponse> => {
  return fetchWithAuth(`${BASE_API}/users`, {
    method: "POST",
    body: JSON.stringify(data),
    next: { tags: ["USER"] },
  });
};

/* ------------------------------
   Update User (Admin)
------------------------------- */
export const updateUserById = async (
  id: string,
  data: FieldValues | FormData
): Promise<IResponse> => {
  const isFormData = data instanceof FormData;

  return fetchWithAuth(`${BASE_API}/users/${id}`, {
    method: "PATCH",
    body: isFormData ? data : JSON.stringify(data),
    next: { tags: ["USER"] },
  });
};

/* ------------------------------
   Update My Profile
------------------------------- */
export const updateMyProfile = async (
  data: FieldValues | FormData
): Promise<IResponse> => {
  const isFormData = data instanceof FormData;

  return fetchWithAuth(`${BASE_API}/users/me`, {
    method: "PATCH",
    body: isFormData ? data : JSON.stringify(data),
    next: { tags: ["USER"] },
  });
};

/* ------------------------------
   Update Profile Image
------------------------------- */
export const updateProfileImage = async (data: FormData): Promise<IResponse> => {
  return fetchWithAuth(`${BASE_API}/users/profile-image`, {
    method: "PATCH",
    body: data,
    next: { tags: ["USER"] },
  });
};

/* ------------------------------
   Update User Status
------------------------------- */
export const updateUserStatus = async (
  id: string,
  status: string
): Promise<IResponse> => {
  return fetchWithAuth(`${BASE_API}/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
    next: { tags: ["USER"] },
  });
};

/* ------------------------------
   Delete User
------------------------------- */
export const deleteUser = async (id: string): Promise<IResponse> => {
  return fetchWithAuth(`${BASE_API}/users/${id}`, {
    method: "DELETE",
    next: { tags: ["USER"] },
  });
};
