"use client";

import { useState } from 'react';
import { 
  Container, Typography, Box, Card, CardContent, Button, 
  TextField, Alert, CircularProgress 
} from '@mui/material';
import NavBar from '@/components/NavBar';
import { branding } from '@/config/branding';

export default function ClippoLanding() {
  const [email, setEmail] = useState('');
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !domain) {
      setError('Please enter both email and domain');
      return;
    }
    
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // For demo purposes, just simulate an API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setEmail('');
      setDomain('');
    }, 1500);
  };
  
  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <NavBar />
      
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ 
          mt: { xs: 12, md: 16 }, 
          mb: 8,
          px: { xs: 2, sm: 0 }
        }}>
          <Typography 
            variant="h1" 
            component="h1" 
            align="center"
            gutterBottom
            sx={{ 
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              fontWeight: 700,
              maxWidth: '1000px',
              mx: 'auto',
              lineHeight: 1.2
            }}
          >
            The secret to lightning-fast sites
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            align="center"
            gutterBottom 
            sx={{ 
              mb: 6,
              fontSize: { xs: '1.2rem', sm: '1.5rem' },
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            We're reinventing how eCommerce sites deliver lightning-fast experiences.
          </Typography>
        </Box>

        {/* Benefits - Single Statement */}
        <Box sx={{ 
          mb: 10,
          textAlign: 'center'
        }}>
          <Typography 
            variant="h4" 
            align="center" 
            gutterBottom
            sx={{ 
              fontWeight: 600,
              mb: 6,
              maxWidth: '900px',
              mx: 'auto',
              lineHeight: 1.3
            }}
          >
            Empirical evidence shows that when customers don't wait, they don't leave. We're building Clippo to transform site speed into business growth
          </Typography>
        </Box>

        {/* CTA Form Section */}
        <Card sx={{ 
          mb: 8, 
          backgroundColor: 'background.paper', 
          borderRadius: 2,
          maxWidth: '600px',
          mx: 'auto'
        }}>
          <CardContent sx={{ py: 6, px: { xs: 3, md: 6 } }}>
            <Typography 
              variant="h4" 
              align="center" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                mb: 1
              }}
            >
              Join the Journey
            </Typography>
            <Typography 
              variant="body1" 
              align="center"
              color="text.secondary"
              sx={{ 
                mb: 4,
                maxWidth: '700px',
                mx: 'auto'
              }}
            >
              Help us understand your speed challenges. What would you want in the perfect solution?
            </Typography>
            
            {submitted ? (
              <Alert 
                severity="success"
                sx={{ 
                  maxWidth: '500px', 
                  mx: 'auto',
                  mb: 2
                }}
              >
                Thanks for your interest! We'll reach out for a quick conversation.
              </Alert>
            ) : (
              <Box 
                component="form"
                onSubmit={handleSubmit}
                sx={{ 
                  maxWidth: '500px', 
                  mx: 'auto'
                }}
              >
                {error && (
                  <Alert 
                    severity="error"
                    sx={{ mb: 2 }}
                  >
                    {error}
                  </Alert>
                )}
                
                <TextField
                  label="Email Address"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  type="email"
                />
                
                <TextField
                  label="Website Domain"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  required
                  placeholder="example.com"
                  sx={{ mb: 3 }}
                />
                
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderRadius: '4px'
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'I WANT TO KNOW MORE'}
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <Box 
          component="footer" 
          sx={{ 
            textAlign: 'center',
            py: 4,
            mt: 'auto',
            borderTop: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2025 Clippo - Coming soon to transform your website experience
          </Typography>
        </Box>
      </Container>
    </div>
  );
}