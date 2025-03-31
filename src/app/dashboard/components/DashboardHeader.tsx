'use client';

import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import { branding } from "@/config/branding";
import Link from "next/link";

export default function DashboardHeader() {
  return (
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
                organizationSwitcherTrigger: {
                  padding: "6px 12px",
                  borderRadius: "4px",
                  border: "1px solid #e0e0e0",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                },
                organizationSwitcherTriggerIcon: {
                  color: branding.primaryColor,
                }
              },
              variables: {
                colorPrimary: branding.primaryColor,
                colorText: "#333333",
              }
            }}
            createOrganizationUrl="/dashboard"
            // Remove the createOrganizationMode property
            organizationProfileUrl="/dashboard"
            // Remove the organizationProfileMode property
          />
          <UserButton afterSignOutUrl="/" />
        </Box>
      </Toolbar>
    </AppBar>
  );
}