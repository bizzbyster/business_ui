"use client";
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function NavBar() {
  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 700 }}>
          Enterprise Solutions Inc.
        </Typography>
        <Button component={Link} href="/sign-in" color="primary" sx={{ mr: 2 }}>
          Sign In
        </Button>
        <Button component={Link} href="/sign-up" color="primary" variant="contained">
          Sign Up
        </Button>
      </Toolbar>
    </AppBar>
  );
}
