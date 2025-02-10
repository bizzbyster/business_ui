"use client";

import { Container, Typography, Box, Card, CardContent } from '@mui/material';
import NavBar from '@/components/NavBar';
import DomainForm from '@/components/DomainForm';
import SpeedIcon from '@mui/icons-material/Speed';
import SyncIcon from '@mui/icons-material/Sync';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function BetaAccess() {
  return (
    <div>
      <NavBar />
      <Container maxWidth="md">
        <Box sx={{ 
          mt: { xs: 8, md: 12 }, 
          mb: 8,
          px: { xs: 2, sm: 0 }
        }}>
          <Typography 
            variant="h1" 
            component="h1"
            align="center"
            sx={{ 
              fontSize: { xs: '2rem', sm: '2.5rem' },
              fontWeight: 700,
              mb: 4
            }}
          >
            How to Join Our Beta Program
          </Typography>

          <Typography 
            variant="body1"
            align="center"
            sx={{ 
              fontSize: '1.2rem',
              mb: 8,
              color: 'text.secondary'
            }}
          >
            We&apos;re taking a unique approach to ensure every business gets the most value from our platform. Here&apos;s how it works:
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mb: 8 }}>
            <Card>
              <CardContent sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', p: 4 }}>
                <SpeedIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <div>
                  <Typography variant="h6" gutterBottom>
                    1. Quick Site Assessment
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Start by submitting your domain for a free performance analysis. Our system will evaluate your site&apos;s current performance and optimization potential. You&apos;ll receive detailed insights within 10 minutes.
                  </Typography>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', p: 4 }}>
                <SyncIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <div>
                  <Typography variant="h6" gutterBottom>
                    2. Review Your Analysis
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    We&apos;ll send you a comprehensive report showing your site&apos;s performance metrics and potential improvements. If your site is a good fit for our beta program, you&apos;ll receive an exclusive invitation to join.
                  </Typography>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', p: 4 }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <div>
                  <Typography variant="h6" gutterBottom>
                    3. Complete Beta Onboarding
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Once invited, you&apos;ll get access to our full platform. We&apos;ll guide you through a simple setup process to start monitoring and optimizing your site&apos;s performance in real-time.
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ 
            backgroundColor: 'background.paper',
            borderRadius: 2,
            p: 4,
            mb: 6,
            textAlign: 'center'
          }}>
            <Typography 
              variant="h4" 
              gutterBottom
              sx={{ mb: 3 }}
            >
              Ready to transform your website&apos;s performance?
            </Typography>
            <Box sx={{ maxWidth: '600px', mx: 'auto' }}>
              <DomainForm />
            </Box>
          </Box>
        </Box>
      </Container>
    </div>
  );
}