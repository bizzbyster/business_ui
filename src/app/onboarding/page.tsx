'use client';

import { useState } from 'react';
import { 
  Container, 
  Stepper, 
  Step, 
  StepLabel, 
  Box, 
  Typography,
  Card,
  CardContent,
  Button,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { branding } from '../../config/branding';
import CompanyDetailsForm from '@/components/CompanyDetailsForm';
import CodeSnippet from '@/components/CodeSnippet';
import { useRouter } from 'next/navigation';

const steps = [
  'Company Details',
  'Terms & Conditions',
  'Integration'
];

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
  const [activeStep, setActiveStep] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleCompanyDetailsSubmit = (data: any) => {
    console.log('Company details:', data);
    setActiveStep(1);
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
            <Box sx={{ height: 200, overflowY: 'auto', p: 2, bgcolor: '#f5f5f5', mb: 3 }}>
              <Typography variant="body2">
                By using {branding.companyName}, you agree to our Terms of Service and Privacy Policy.
                {/* Add your terms content here */}
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
              }
              label="I accept the terms and conditions"
            />
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => setActiveStep(0)}>Back</Button>
              <Button 
                variant="contained" 
                disabled={!termsAccepted}
                onClick={() => setActiveStep(2)}
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
            
            <CodeSnippet 
              code={cdnSnippet} 
              label="1. Add the CDN script"
            />
            
            <CodeSnippet 
              code={initSnippet} 
              label="2. Initialize Clippo"
            />

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => setActiveStep(1)}>Back</Button>
              <Button 
                variant="contained"
                onClick={() => router.push('/dashboard')}
              >
                Complete Setup
              </Button>
            </Box>
          </Box>
        );
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        py: 8
      }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          align="center" 
          sx={{ 
            mb: 6,
            fontWeight: 500,
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
  );
}