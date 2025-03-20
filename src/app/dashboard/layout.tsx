import {
  getLCPDistribution,
  getSyntheticQuickStats,
  getWebVitalsSummary,
} from "@/db/clickhouse-db/queries";
import DashboardContextProvider from "./context";
import { cookies } from "next/headers";
import DashboardHeader from "./components/DashboardHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const c = await cookies();
  let domain = c.get("d")?.value;
  if (domain) domain = atob(domain);
  const [lcpDistribution, webVitalsSummary, syntheticQuickStats] =
    await Promise.all([
      getLCPDistribution(`${domain}`),
      getWebVitalsSummary(`${domain}`),
      getSyntheticQuickStats(`${domain}`),
    ]);
  return (
    <DashboardContextProvider
      data={{ lcpDistribution, webVitalsSummary, syntheticQuickStats, domain }}
    >
      <div>
        <DashboardHeader />
        {children}
      </div>
    </DashboardContextProvider>
  );
}
