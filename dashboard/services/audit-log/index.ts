
"use server";

import { BASE_API } from "@/lib/baseApi";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { IQueryParams, IResponse } from "@/types/common";
import { IAuditLog } from "@/types/audit-log";

/* ------------------------------
   Get All Audit Logs
------------------------------- */
export const getAllAuditLogs = async (query: IQueryParams = {}): Promise<IResponse<IAuditLog[]>> => {
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

  const url = `${BASE_API}/audit-logs?${params.toString()}`;

  return fetchWithAuth(url, {
    method: "GET",
    cache: "no-store",
  });
};
