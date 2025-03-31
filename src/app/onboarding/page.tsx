'use client';

import { useState, useEffect } from 'react';
import { Container, Typography, Box, Stepper, Step, StepLabel, Card, CardContent, Button, FormControlLabel, Checkbox, Link as MuiLink } from '@mui/material';
import { branding } from '@/config/branding';
import CodeSnippet from '@/components/CodeSnippet';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LanguageIcon from '@mui/icons-material/Language';
import StorageIcon from '@mui/icons-material/Storage';
import ErrorIcon from '@mui/icons-material/Error';

const steps = ['Clippo Overview', 'Terms & Conditions', 'Integration'];

const termsContent = `Beta Program Terms & Conditions

1. Program Overview
This Beta Program provides early access to Clippo's advanced business optimization platform. As a beta participant, you'll receive priority access to emerging features and direct input into product development.

2. Beta Access Terms
- Access is granted on a company-by-company basis
- Beta period duration is variable and subject to Clippo's discretion
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
  const [testStatus, setTestStatus] = useState(null); // null, 'testing', 'success', 'failed'
  const [originDetails, setOriginDetails] = useState({
    hostname: '',
    port: '443',
    usesSSL: true
  });
  
  // Load saved state from metadata if available
  useEffect(() => {
    if (user?.unsafeMetadata?.onboardingStep) {
      const savedStep = Number(user.unsafeMetadata.onboardingStep);
      setActiveStep(savedStep);
      
      if (savedStep >= 1) {
        setTermsAccepted(true);
      }
    }
    
    // Try to get domain from URL or metadata
    const getUrlDomain = () => {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('domain');
      }
      return null;
    };
    
    const domainFromUrl = getUrlDomain();
    const domainFromMetadata = user?.unsafeMetadata?.domain;
    
    if (domainFromUrl) {
      setOriginDetails(prev => ({ ...prev, hostname: domainFromUrl }));
    } else if (domainFromMetadata) {
      setOriginDetails(prev => ({ ...prev, hostname: domainFromMetadata }));
    }
  }, [user]);

  const handleIntroSubmit = () => {
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
  
  const testOriginConnection = () => {
    setTestStatus('testing');
    // Simulate API call to test connection
    setTimeout(() => {
      // For demo purposes, let's say connection succeeds if hostname is not empty
      if (originDetails.hostname.trim() !== '') {
        setTestStatus('success');
      } else {
        setTestStatus('failed');
      }
    }, 1500);
  };
  
  const handleOriginDetailsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOriginDetails({
      ...originDetails,
      [name]: type === 'checkbox' ? checked : value
    });
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
          <Box sx={{ p: 3, maxWidth: 680, mx: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LanguageIcon sx={{ color: branding.primaryColor, mr: 1 }} />
              <Typography variant="h6" gutterBottom>
                Welcome to Clippo - Boost Your E-commerce Performance
              </Typography>
            </Box>
            
            <Typography variant="body1" paragraph>
              You're minutes away from accelerating your website and increasing your conversion rates. Here's how Clippo will transform your online store:
            </Typography>
            
            <Box sx={{ mb: 4, bgcolor: '#f5f5f5', p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: branding.primaryColor }}>
                What to expect during this onboarding:
              </Typography>
              <Typography component="div" variant="body2">
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <strong>Quick setup</strong>: Just 3 simple steps to get started
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <strong>Instant integration</strong>: Add our script to your site with minimal technical effort
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <strong>Real-time results</strong>: Start seeing performance improvements immediately
                  </li>
                  <li>
                    <strong>Zero disruption</strong>: No downtime, no impact on your existing setup
                  </li>
                </ul>
              </Typography>
            </Box>
            
            <Typography variant="body1" paragraph>
              Clippo automatically optimizes your page load speed, focusing on the metrics that directly impact your conversion rates. Our e-commerce customers typically see:
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
              <Box sx={{ textAlign: 'center', bgcolor: '#ebf7ff', p: 2, borderRadius: 2, width: '30%' }}>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>27%</Typography>
                <Typography variant="body2">Faster Page Loads</Typography>
              </Box>
              <Box sx={{ textAlign: 'center', bgcolor: '#ebf7ff', p: 2, borderRadius: 2, width: '30%' }}>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>12%</Typography>
                <Typography variant="body2">Conversion Increase</Typography>
              </Box>
              <Box sx={{ textAlign: 'center', bgcolor: '#ebf7ff', p: 2, borderRadius: 2, width: '30%' }}>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>14%</Typography>
                <Typography variant="body2">Lower Bounce Rate</Typography>
              </Box>
            </Box>
            
            <Typography variant="body2" paragraph sx={{ color: 'text.secondary' }}>
              You'll have full access to your performance dashboard where you can track improvements in real-time and see the direct impact on your business metrics.
            </Typography>
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                onClick={() => router.push('/')}
                variant="outlined"
              >
                Back
              </Button>
              <Button 
                variant="contained" 
                onClick={handleIntroSubmit}
                color="primary"
              >
                Continue
              </Button>
            </Box>
          </Box>
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
          <Box sx={{ p: 3, maxWidth: 680, mx: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <StorageIcon sx={{ color: branding.primaryColor, mr: 1 }} />
              <Typography variant="h6" gutterBottom>
                Origin Server Configuration
              </Typography>
            </Box>
            
            <Typography variant="body2" paragraph>
              We'll now connect Clippo to your website. This is a simple process that takes just a few minutes.
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                1. Verify your website details
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website Domain</label>
                <input
                  type="text"
                  name="hostname"
                  value={originDetails.hostname}
                  onChange={handleOriginDetailsChange}
                  placeholder="www.yourstore.com"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="usesSSL"
                    checked={originDetails.usesSSL}
                    onChange={handleOriginDetailsChange}
                    className="mr-2"
                  />
                  <label>My website uses HTTPS (SSL/TLS)</label>
                </div>
              </Box>
              
              <Button
                onClick={testOriginConnection}
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ mb: 3 }}
                disabled={testStatus === 'testing' || !originDetails.hostname}
              >
                {testStatus === 'testing' ? 'Testing Connection...' : 'Test Connection'}
              </Button>
              
              {testStatus === 'success' && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  p: 2, 
                  bgcolor: '#f0f9ef', 
                  borderRadius: 1,
                  mb: 3 
                }}>
                  <CheckCircleIcon sx={{ color: 'success.main', mr: 1, mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: 'success.main' }}>
                      Connection Successful!
                    </Typography>
                    <Typography variant="body2">
                      Clippo can successfully connect to your website. You're ready to proceed with the integration.
                    </Typography>
                  </Box>
                </Box>
              )}
              
              {testStatus === 'failed' && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  p: 2, 
                  bgcolor: '#feeeee', 
                  borderRadius: 1,
                  mb: 3 
                }}>
                  <ErrorIcon sx={{ color: 'error.main', mr: 1, mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: 'error.main' }}>
                      Connection Failed
                    </Typography>
                    <Typography variant="body2">
                      We couldn't connect to your website. Please verify that the domain is correct and that your website is accessible.
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                2. Add the Clippo script to your site
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Add these two code snippets to the <code>&lt;head&gt;</code> section of your website:
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
                  Step 1: Add the CDN script
                </Typography>
                <CodeSnippet code={cdnSnippet} label="CDN Script" />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
                  Step 2: Initialize Clippo
                </Typography>
                <CodeSnippet code={initSnippet} label="Initialization Script" />
                
                <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                  Use <strong>YOUR_SITE_ID</strong>: {originDetails.hostname || '[your domain]'}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                3. Implementation tips for e-commerce platforms
              </Typography>
              
              <Box sx={{ 
                bgcolor: '#f5f5f5', 
                p: 2, 
                borderRadius: 1
              }}>
                <Typography variant="body2" component="div">
                  <ul style={{ paddingLeft: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <strong>Shopify:</strong> Add this script in Theme Settings → Custom Code → Header
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <strong>WooCommerce:</strong> Use a header and footer plugin or edit your theme's header.php
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <strong>Magento:</strong> Add to default_head_blocks.xml or through the admin panel
                    </li>
                    <li>
                      <strong>BigCommerce:</strong> Add in Storefront → Script Manager → Header
                    </li>
                  </ul>
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ mb: 3, textAlign: 'center' }}>
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
                disabled={testStatus !== 'success'}
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
            Set Up Clippo for Your Store
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