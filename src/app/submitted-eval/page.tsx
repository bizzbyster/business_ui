"use client";

import { Container, Typography, Box, Card, CardContent } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import SpeedIcon from '@mui/icons-material/Speed';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import NavBar from '@/components/NavBar';

export default function SubmittedEvalPage() {
  return (
    <div>
      <NavBar />
      <Container maxWidth="md">
        <Box sx={{ mt: 8, mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 500 }}>
            Thank you for requesting your site evaluation!
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Let's unlock your website's full performance potential.
          </Typography>
        </Box>

        <Card sx={{ mb: 6 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 500 }}>
              What Happens Next?
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                <EmailIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                <div>
                  <Typography variant="h6" gutterBottom>
                    Receive Your Performance Analysis (in up to 24 hrs)
                  </Typography>
                  <Typography color="text.secondary">
                    Check your inbox for a detailed analysis of your website's current performance metrics,
                    including Core Web Vitals and potential optimizations.
                  </Typography>
                </div>
              </Box>

              <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                <SpeedIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                <div>
                  <Typography variant="h6" gutterBottom>
                    Access Your Performance Dashboard
                  </Typography>
                  <Typography color="text.secondary">
                    We'll provide a comprehensive dashboard showing synthetic test data 
                    to demonstrate your site's optimization potential.
                  </Typography>
                </div>
              </Box>

              <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                <RocketLaunchIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                <div>
                  <Typography variant="h6" gutterBottom>
                    Start Your Beta Trial
                  </Typography>
                  <Typography color="text.secondary">
                    Begin your optimization journey and track real-world performance improvements
                    as we enhance your website's speed and user experience.
                  </Typography>
                </div>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="body1" color="text.secondary">
            Keep an eye on your inbox for your performance analysis.
            If you don't see it within a few minutes, please check your spam folder.
          </Typography>
        </Box>
      </Container>
    </div>
  );
}