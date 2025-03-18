"use client";

import { LCPDistribution, WebVitalsSummary } from "@/db/clickhouse-db/queries";
import { createContext, ReactNode, useContext } from "react";

interface DashboardContextStore {
  lcpDistribution: LCPDistribution[];
  webVitalsSummary: WebVitalsSummary[];
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
