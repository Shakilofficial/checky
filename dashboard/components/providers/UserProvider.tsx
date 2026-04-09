"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { normalizeAuthUser } from "@/lib/normalizeUser";
import { logout } from "@/services/auth";
import { getMe } from "@/services/user";
import { IAuthUser } from "@/types/auth";

/* ======================================================
   Config
====================================================== */

const USER_CACHE_KEY = "craftline_auth_user";
const CACHE_TTL = 1000 * 60 * 10; // 10 min

/* ======================================================
   Types
====================================================== */

interface IUserCache {
  data: IAuthUser;
  expires: number;
}

interface IUserContext {
  user: IAuthUser | null;
  isLoading: boolean;
  error: string | null;

  refreshUser: (force?: boolean) => Promise<void>;
  logoutUser: () => Promise<void>;
  setUser: (user: IAuthUser | null) => void;
}

/* ======================================================
   Context
====================================================== */

const UserContext = createContext<IUserContext | null>(null);

/* ======================================================
   Cache Helpers
====================================================== */

function loadCache(): IUserCache | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(USER_CACHE_KEY);
    if (!raw) return null;

    const parsed: IUserCache = JSON.parse(raw);

    if (Date.now() > parsed.expires) {
      localStorage.removeItem(USER_CACHE_KEY);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function saveCache(user: IAuthUser) {
  if (typeof window === "undefined") return;

  const payload: IUserCache = {
    data: user,
    expires: Date.now() + CACHE_TTL,
  };

  localStorage.setItem(USER_CACHE_KEY, JSON.stringify(payload));
}

function clearCache() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_CACHE_KEY);
}

/* ======================================================
   Provider
====================================================== */

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<IAuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initializedRef = useRef(false);

  const setUser = useCallback((user: IAuthUser | null) => {
    setUserState(user);
    if (user) saveCache(user);
    else clearCache();
  }, []);

  const refreshUser = useCallback(
    async (force = false) => {
      if (typeof window === "undefined") return;

      try {
        setError(null);

        if (!force) {
          const cache = loadCache();
          if (cache?.data) {
            setUserState(cache.data);
            setIsLoading(false);
            return;
          }
        }

        setIsLoading(true);

        const res = await getMe();
        if (!res?.success || !res?.data) {
          setUser(null);
          return;
        }

        const normalized = normalizeAuthUser(res.data);
        setUser(normalized);
      } catch (err) {
        console.error("Auth refresh failed:", err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    },
    [setUser],
  );

  const logoutUser = useCallback(async () => {
    if (typeof window === "undefined") return;

    try {
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      clearCache();
      setUser(null);
      setError(null);
      setIsLoading(false);
      window.location.href = "/login";
    }
  }, [setUser]);

  /* --------------------------------------------
     Initial Load
  --------------------------------------------- */

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;

      if (typeof window === "undefined") return;

      const cache = loadCache();
      if (cache?.data) {
        setUserState(cache.data);
        setIsLoading(false);
      }

      refreshUser(false);
    }
  }, [refreshUser]);

  /* --------------------------------------------
     Cross-tab Sync
  --------------------------------------------- */

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = (e: StorageEvent) => {
      if (e.key !== USER_CACHE_KEY) return;

      if (!e.newValue) {
        setUserState(null);
        return;
      }

      try {
        const parsed: IUserCache = JSON.parse(e.newValue);
        setUserState(parsed.data);
      } catch {
        setUserState(null);
      }
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  /* --------------------------------------------
     Auto Refresh on Focus
  --------------------------------------------- */

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onFocus = () => refreshUser(false);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refreshUser]);

  const value = useMemo<IUserContext>(
    () => ({ user, isLoading, error, refreshUser, logoutUser, setUser }),
    [user, isLoading, error, refreshUser, logoutUser, setUser],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}
