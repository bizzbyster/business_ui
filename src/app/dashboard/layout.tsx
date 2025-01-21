// src/app/dashboard/layout.tsx
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { UserButton } from "@clerk/nextjs";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Enterprise Solutions Dashboard
          </Typography>
          <Button
            color="inherit"
            startIcon={<HelpOutlineIcon />}
            sx={{ mr: 2 }}
            component={Link}
            href="/support"
          >
            Support
          </Button>
          <UserButton afterSignOutUrl="/"/>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}
