/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { getNewToken } from "@/services/auth";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export const isTokenExpired = async (token: string): Promise<boolean> => {
  if (!token) return true;

  try {
    const decoded: { exp: number } = jwtDecode(token);

    return !decoded.exp || decoded.exp * 1000 < Date.now();
  } catch (err: any) {
    console.error(err);
    return true;
  }
};

export const getValidToken = async (): Promise<string | null> => {
  try {
    const cookieStore = await cookies();

    const tokenCookie = cookieStore.get("accessToken");
    let token = tokenCookie?.value;

    if (!token || (await isTokenExpired(token))) {
      const result = await getNewToken();

      // Handle the case where getNewToken returns an Error object or fails
      if (
        result &&
        !(result instanceof Error) &&
        result.success &&
        result.data?.accessToken
      ) {
        token = result.data.accessToken;

        try {
          if (typeof token === "string") {
            cookieStore.set("accessToken", token);
          }
          if (typeof result.data.refreshToken === "string") {
            cookieStore.set("refreshToken", result.data.refreshToken);
          }
        } catch (cookieError) {
          // Failure to set cookies usually happens during Server Component renders.
          // We can't persist it now, but we'll return the new token so the current request can proceed.
          console.warn(
            "[Auth] Could not persist refreshed token in cookie during render context.",
          );
        }
      } else if (!token) {
        // No token and refresh failed
        return null;
      }
      // If token exists but is expired and refresh failed, we proceed with the expired token
      // (it will likely fail at the API level anyway).
    }

    return token || null;
  } catch (error: any) {
    if (error?.digest === "DYNAMIC_SERVER_USAGE" || error?.message?.includes("Dynamic server usage")) {
      // Re-throw for Next.js to handle dynamic fallback automatically
      throw error;
    }
    console.error("[Auth] getValidToken error:", error);
    return null;
  }
};

