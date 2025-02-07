"use client";

import { useState } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent, Alert, Snackbar } from '@mui/material';
import { branding } from '../config/branding';

export default function DomainForm() {
  const [domain, setDomain] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain, email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send analysis request');
      }

      // Show success message
      setAlert({
        open: true,
        message: 'Analysis started! Check your email for updates.',
        severity: 'success'
      });

      // Reset form
      setDomain('');
      setEmail('');
    } catch (error) {
      // Show error message
      setAlert({
        open: true,
        message: 'Something went wrong. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert(prev => ({ ...prev, open: false }));
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom align="center">
          Evaluate your site's compatibility
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Website Domain"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Your Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={isSubmitting}
              size="large"
            >
              {isSubmitting ? 'Processing...' : 'Get Free Analysis in 10 mins'}
            </Button>
          </Box>
        </form>
      </CardContent>

      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}