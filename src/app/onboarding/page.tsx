'use client';

import { useState, useEffect } from 'react';
import { Container, Typography, Box, Stepper, Step, StepLabel, Card, CardContent, Button, FormControlLabel, Checkbox, Link as MuiLink } from '@mui/material';
import { branding } from '@/config/branding';
import CompanyDetailsForm from '@/components/CompanyDetailsForm';
import CodeSnippet from '@/components/CodeSnippet';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

interface CompanyDetails {
  name: string;
  website: string;
  contactEmail: string;
}

const steps = ['Organization Details', 'Terms & Conditions', 'Integration'];

const termsContent = `Beta Program Terms & Conditions

1. Program Overview
This Beta Program provides early access to Clippo&apos;s advanced business optimization platform. As a beta participant, you&apos;ll receive priority access to emerging features and direct input into product development.

2. Beta Access Terms
- Access is granted on a company-by-company basis
- Beta period duration is variable and subject to Clippo&apos;s discretion
- Features may be modified, added, or removed without prior notice
- Service availability and performance metrics are not guaranteed during beta
- We retain the right to modify or terminate beta access

3. Usage Guidelines
- Implementation limited to authorized domains
- Account sharing between organizations is not permitted
- No reverse engineering or attempted security circumvention
- Usage data collection is required for service optimization
- API rate limits and usage quotas apply

4. Data & Privacy Commitment
- Enterprise-grade security protocols for all collected data
- Regular security audits and compliance reviews
- Data encryption in transit and at rest
- Comprehensive data handling policies available
- Optional data retention configurations

5. Liability & Warranty
- Service provided "as is" during beta period
- No express or implied warranties
- Limitation of liability to subscription fees paid
- No guarantee of service continuity
- Beta features may be discontinued

By proceeding, you acknowledge these terms and our commitment to evolving this product with your feedback.`;

const cdnSnippet = `<script src="https://cdn.clippo.ai/v1/clippo.js"></script>`;
const initSnippet = `<script>
  window.Clippo.init({
    siteId: 'YOUR_SITE_ID',
    options: {
      monitoring: true,
      optimization: true
    }
  });
</script>`;

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [activeStep, setActiveStep] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Load saved state from metadata if available
  useEffect(() => {
    if (user?.unsafeMetadata?.onboardingStep) {
      const savedStep = Number(user.unsafeMetadata.onboardingStep);
      setActiveStep(savedStep);
      
      if (savedStep >= 1) {
        setTermsAccepted(true);
      }
    }
  }, [user]);

  const handleCompanyDetailsSubmit = (data: any) => {
    console.log('Organization details:', data);
    setActiveStep(1);
  };
  
  const handleTermsAccept = async () => {
    try {
      await user?.update({
        unsafeMetadata: {
          ...user.unsafeMetadata, // Preserve existing metadata
          termsAccepted: true,
          onboardingStep: 2
        }
      });
      setActiveStep(2);
    } catch (error) {
      console.error('Error updating user metadata:', error);
    }
  };
  
  const completeOnboarding = async () => {
    try {
      await user?.update({
        unsafeMetadata: {
          ...user.unsafeMetadata, // Preserve existing metadata
          onboardingCompleted: true,
          onboardingStep: 3
        }
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating user metadata:', error);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <CompanyDetailsForm 
            onSubmit={handleCompanyDetailsSubmit}
            onBack={() => router.push('/')}
          />
        );
      case 1:
        return (
          <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Terms & Conditions
            </Typography>
            <Box sx={{ 
              height: 400, 
              overflowY: 'auto', 
              p: 2, 
              bgcolor: '#f5f5f5', 
              mb: 3,
              borderRadius: 1,
              '& > pre': {
                whiteSpace: 'pre-wrap',
                fontFamily: 'inherit',
                fontSize: '0.875rem'
              }
            }}>
              <pre>{termsContent}</pre>
            </Box>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  color="primary"
                />
              }
              label="I accept the terms and conditions"
            />
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => setActiveStep(0)}>Back</Button>
              <Button 
                variant="contained" 
                disabled={!termsAccepted}
                onClick={handleTermsAccept}
                color="primary"
              >
                Continue
              </Button>
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Add {branding.companyName} to your site
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Add these two code snippets to the <code>&lt;head&gt;</code> section of your website:
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                1. Add the CDN script
              </Typography>
              <CodeSnippet code={cdnSnippet} label="CDN Script" />
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                2. Initialize Clippo
              </Typography>
              <CodeSnippet code={initSnippet} label="Initialization Script" />
            </Box>

            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Link href="/faq" passHref>
                <MuiLink color="primary" underline="hover">
                  Have questions? Check our FAQ
                </MuiLink>
              </Link>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => setActiveStep(1)}>Back</Button>
              <Button 
                variant="contained"
                onClick={completeOnboarding}
                color="primary"
              >
                Complete Setup
              </Button>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <NavBar />
      <Container maxWidth="lg">
        <Box sx={{ 
          minHeight: 'calc(100vh - 64px)', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          py: { xs: 4, md: 8 }
        }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            align="center" 
            sx={{ 
              mb: 6,
              fontWeight: 700,
              fontSize: { xs: '2rem', sm: '2.5rem' }
            }}
          >
            Complete Your Setup
          </Typography>

          <Card sx={{ 
            maxWidth: '800px',
            width: '100%',
            backgroundColor: 'background.paper',
            boxShadow: 3,
            mb: 4
          }}>
            <CardContent sx={{ p: 4 }}>
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {renderStepContent()}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </div>
  );
}