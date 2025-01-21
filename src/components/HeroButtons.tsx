"use client";
import { Button } from '@mui/material';
import Link from 'next/link';

export default function HeroButtons() {
  return (
    <>
      <Button 
        component={Link} 
        href="/sign-up" 
        variant="contained" 
        size="large" 
        sx={{ 
          mr: { xs: 1, sm: 2 },
          px: { xs: 3, sm: 4 },
          py: { xs: 1, sm: 1.5 }
        }}
      >
        Get Started
      </Button>
      <Button 
        component={Link} 
        href="#features" 
        variant="outlined" 
        size="large"
        sx={{ 
          px: { xs: 3, sm: 4 },
          py: { xs: 1, sm: 1.5 }
        }}
      >
        Learn More
      </Button>
    </>
  );
}
