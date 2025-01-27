// src/app/unauthorized/page.tsx
import { Container, Typography, Button, Box, Card, CardContent } from '@mui/material';
import Link from 'next/link';
import NavBar from '../../components/NavBar';
import { branding } from '../../config/branding';

export default function Unauthorized() {
  return (
    <>
      <NavBar />
      <Container maxWidth="lg">
        <Box sx={{ 
          textAlign: 'center', 
          mt: { xs: 8, md: 12 }, 
          mb: 8,
          px: { xs: 2, sm: 0 }
        }}>
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 700,
              mb: 2
            }}
          >
            Oops! Looks like you're not logged in.
          </Typography>

          <Card sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
            <CardContent>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                This page requires authentication to access. Please sign in to continue.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  component={Link}
                  href="/sign-in"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Sign In
                </Button>
                <Button
                  component={Link}
                  href="/"
                  variant="outlined"
                  color="primary"
                  size="large"
                >
                  Back to Home
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Typography variant="body2" color="text.secondary">
            Need help? Contact {branding.supportEmail}
          </Typography>
        </Box>
      </Container>
    </>
  );
}