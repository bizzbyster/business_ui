"use client";

import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { branding } from '../config/branding';

export default function NavBar() {
  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
      <Toolbar>
        <Link href="/" style={{ textDecoration: 'none', flexGrow: 1 }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              color: 'primary.main', 
              fontWeight: 700,
              '&:hover': {
                opacity: 0.8
              }
            }}
          >
            {branding.companyName}
          </Typography>
        </Link>
        <Button 
          component={Link} 
          href="/sign-in" 
          variant="contained"
          color="primary"
        >
          SIGN IN
        </Button>
      </Toolbar>
    </AppBar>
  );
}