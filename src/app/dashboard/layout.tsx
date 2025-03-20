import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import { branding } from "@/config/branding";
import Link from "next/link";
import {
  getLCPDistribution,
  getSyntheticQuickStats,
  getWebVitalsSummary,
} from "@/db/clickhouse-db/queries";
import DashboardContextProvider from "./context";
import { cookies } from "next/headers";

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
        <AppBar
          position="static"
          color="transparent"
          elevation={0}
          sx={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}
        >
          <Toolbar>
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
              <Link href="/" style={{ textDecoration: "none" }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    color: "primary.main",
                    fontWeight: 700,
                    "&:hover": {
                      opacity: 0.8,
                    },
                  }}
                >
                  {branding.companyName}
                </Typography>
              </Link>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  color: "text.secondary",
                  ml: 1,
                }}
              >
                Dashboard
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <OrganizationSwitcher
                hidePersonal
                afterCreateOrganizationUrl="/dashboard"
                afterLeaveOrganizationUrl="/dashboard"
                afterSelectOrganizationUrl="/dashboard"
                appearance={{
                  elements: {
                    rootBox: {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  },
                }}
              />
              <UserButton afterSignOutUrl="/" />
            </Box>
          </Toolbar>
        </AppBar>
        {children}
      </div>
    </DashboardContextProvider>
  );
}
