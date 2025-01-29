"use client";

import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { UserButton } from "@clerk/nextjs";
import { branding } from "@/config/branding";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 700 }}>
            {branding.companyName} Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <UserButton afterSignOutUrl="/" />
          </Box>
        </Toolbar>
      </AppBar>
      {children}
    </div>
  );
}