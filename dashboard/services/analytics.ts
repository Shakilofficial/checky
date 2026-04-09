"use server";

import { BASE_API } from "@/lib/baseApi";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { IAnalyticsData } from "@/types/analytics";
import { IResponse } from "@/types/common";

export const getDashboardAnalytics = async (): Promise<IResponse<IAnalyticsData>> => {
  return fetchWithAuth(`${BASE_API}/analytics/dashboard`, {
    method: "GET",
    next: { tags: ["ANALYTICS"] },
  });
};
