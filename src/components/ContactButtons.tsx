"use client";
import { Button } from '@mui/material';
import Link from 'next/link';

export default function ContactButtons() {
  return (
    <Button 
      component={Link}
      href="/sign-up"
      variant="contained" 
      size="large" 
      sx={{ mt: 3 }}
    >
      Contact Sales Team
    </Button>
  );
}
