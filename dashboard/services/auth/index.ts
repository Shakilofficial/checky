/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { BASE_API } from "@/lib/baseApi";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

/* ================= LOGIN ================= */
export const loginUser = async (userData: FieldValues) => {
  try {
    const res = await fetch(`${BASE_API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await res.json();

    if (result?.success) {
      const cookieStore = await cookies();
      if (result?.data?.accessToken) {
        cookieStore.set("accessToken", result?.data?.accessToken);
      }
      if (result?.data?.refreshToken) {
        cookieStore.set("refreshToken", result?.data?.refreshToken);
      }
    }

    return result;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Login failed",
    };
  }
};

/* ================= GET CURRENT USER ================= */
export const getCurrentUser = async () => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (accessToken) {
      return jwtDecode(accessToken);
    }
    return null;
  } catch (error) {
    console.error("[Auth] Failed to get current user:", error);
    return null;
  }
};

/* ================= REFRESH TOKEN ================= */
export const getNewToken = async () => {
  try {
    const cookieStore = await cookies();
    const refreshTokenCookie = cookieStore.get("refreshToken");

    if (!refreshTokenCookie) {
      return {
        success: false,
        message: "No refresh token found",
      };
    }

    const res = await fetch(`${BASE_API}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: refreshTokenCookie.value }),
    });

    let result: any = null;
    try {
      result = await res.json();
    } catch (e) {
      console.error("[Auth] Failed to parse refresh response JSON:", e);
    }

    if (!res.ok) {
      console.error("[Auth] Refresh token request failed:", res.status, result);
      try {
        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");
      } catch (e) {
        console.error("Failed to clear tokens on refresh failure:", e);
      }
      return (
        result || {
          success: false,
          message: `Refresh failed with status ${res.status}`,
        }
      );
    }

    // Persist new tokens when refresh succeeds
    if (result?.success && result?.data) {
      if (result.data.accessToken) {
        cookieStore.set("accessToken", result.data.accessToken);
      }
      if (result.data.refreshToken) {
        cookieStore.set("refreshToken", result.data.refreshToken);
      }
    }

    return result;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Token refresh failed",
    };
  }
};

/* ================= LOGOUT ================= */
export const logout = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
