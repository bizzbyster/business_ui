"use server";

import {
  getLCPDistribution,
  getMetricsSummary,
  getWebVitalsSummary,
} from "@/db/clickhouse-db/queries";

export async function getWebVitals() {
  const res = await Promise.all([
    getLCPDistribution(),
    getMetricsSummary(),
    getWebVitalsSummary(),
  ]);
  return res;
}
