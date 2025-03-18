'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';
import { branding } from "@/config/branding";

export default function DomainHandler() {
  const { user, isLoaded, isSignedIn } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const domain = searchParams.get('domain');
  const [status, setStatus] = useState('Connecting your domain...');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleDomain = async () => {
      if (!domain) {
        setError('No domain was provided.');
        return;
      }

      // Store domain in localStorage as a fallback
      try {
        localStorage.setItem('clippo_domain', domain);
        console.log("Stored domain in localStorage:", domain);
      } catch (err) {
        console.error("Failed to store domain in localStorage:", err);
      }

      if (isLoaded) {
        if (isSignedIn && user) {
          // User is signed in, update metadata
          try {
            setStatus(`Adding ${domain} to your account...`);
            await user.update({
              unsafeMetadata: {
                ...user.unsafeMetadata,
                domain: domain,
              },
            });
            setStatus('Success! Redirecting to dashboard...');
            setTimeout(() => {
              router.push('/dashboard');
            }, 1500);
          } catch (err) {
            console.error('Error updating user metadata:', err);
            // Even if metadata update fails, we've stored in localStorage
            setStatus('Continuing to dashboard...');
            setTimeout(() => {
              router.push('/dashboard');
            }, 1500);
          }
        } else {
          // User is not signed in, redirect to sign-in
          setStatus('Please sign in to continue...');
          setTimeout(() => {
            router.push(`/sign-in?redirect_url=${encodeURIComponent(`/domain-handler?domain=${domain}`)}`);
          }, 1500);
        }
      }
    };

    handleDomain();
  }, [domain, isLoaded, isSignedIn, user, router]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 3,
        backgroundColor: '#f8f9fa',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 500,
          width: '100%',
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          {error ? 'Something went wrong' : 'Setting up your dashboard'}
        </Typography>
        
        {!error && (
          <Box sx={{ display: 'flex', alignItems: 'center', marginY: 3 }}>
            <CircularProgress size={24} sx={{ marginRight: 2, color: branding.primaryColor }} />
            <Typography>{status}</Typography>
          </Box>
        )}
        
        {error && (
          <Box sx={{ marginY: 3 }}>
            <Typography color="error">{error}</Typography>
            <Box sx={{ marginTop: 2 }}>
              <Typography>
                Please return to the email and try clicking the link again, or contact support if the issue persists.
              </Typography>
            </Box>
          </Box>
        )}
        
        {domain && (
          <Typography variant="body2" color="text.secondary" sx={{ marginTop: 3 }}>
            Setting up dashboard for: <strong>{domain}</strong>
          </Typography>
        )}
      </Paper>
    </Box>
  );
}