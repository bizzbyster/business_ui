"use client";

import {
  LCPDistribution,
  SyntheticQuickStat,
  WebVitalsSummary,
} from "@/db/clickhouse-db/queries";
import { createContext, ReactNode, useContext } from "react";

interface DashboardContextStore {
  lcpDistribution: LCPDistribution[];
  webVitalsSummary: WebVitalsSummary[];
  syntheticQuickStats: SyntheticQuickStat[];
  domain?: string;
}

const DashboardContext = createContext<DashboardContextStore | null>(null);

export default function DashboardContextProvider({
  children,
  data,
}: {
  data: DashboardContextStore;
  children: ReactNode;
}) {
  return <DashboardContext value={data}>{children}</DashboardContext>;
}

export function useDashboardContext() {
  const c = useContext(DashboardContext);
  if (!c)
    throw new Error("Only call useDashboardContext within DashboardContext");
  return c;
}
