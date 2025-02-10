"use client";
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { branding } from '../config/branding';

export default function NavBar() {
  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 700 }}>
          {branding.companyName}
        </Typography>
        <Button 
          component={Link} 
          href="/sign-in" 
          color="primary" 
          sx={{ mr: 2 }}
        >
          SIGN IN
        </Button>
        <Button 
          component={Link} 
          href="/sign-up" 
          color="primary" 
          variant="contained"
        >
          SIGN UP
        </Button>
      </Toolbar>
    </AppBar>
  );
}