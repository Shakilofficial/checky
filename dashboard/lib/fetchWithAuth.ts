/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { getValidToken } from "./token";

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
) {
  const token = await getValidToken();

  if (!token) {
    throw new Error("Unauthorized: No token found");
  }

  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    let message = res.statusText || "API Error";
    try {
      const errData = await res.json();
      message = errData?.message || message;
    } catch (e) {
      // Fallback if not JSON
    }
    throw new Error(message);
  }

  try {
    return await res.json();
  } catch (e) {
    throw new Error("Failed to parse server response");
  }
}