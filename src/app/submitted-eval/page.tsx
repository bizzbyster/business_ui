"use client";

import { Container, Typography, Box, Card, CardContent } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import SpeedIcon from '@mui/icons-material/Speed';
import BarChartIcon from '@mui/icons-material/BarChart';
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
            You're one step closer to unlocking your site's full potential.
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
                    Initial Analysis Email (1 minute)
                  </Typography>
                  <Typography color="text.secondary">
                    You'll receive an email shortly with your site's current performance metrics 
                    and Core Web Vitals scores.
                  </Typography>
                </div>
              </Box>

              <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                <SpeedIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                <div>
                  <Typography variant="h6" gutterBottom>
                    Detailed Performance Report
                  </Typography>
                  <Typography color="text.secondary">
                    A comprehensive analysis of your site's speed, including loading times, 
                    user experience metrics, and potential optimization opportunities.
                  </Typography>
                </div>
              </Box>

              <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                <BarChartIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                <div>
                  <Typography variant="h6" gutterBottom>
                    Get Ready to Boost Conversions
                  </Typography>
                  <Typography color="text.secondary">
                    After reviewing your analysis, you'll have access to actionable insights 
                    to improve your site's performance and drive better business results.
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