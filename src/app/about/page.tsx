// src/app/about/page.tsx
import { Container, Typography, Card, CardContent, Box, Grid } from '@mui/material';
import NavBar from '../../components/NavBar';
import { branding } from '../../config/branding';

export default function About() {
  return (
    <>
      <NavBar />
      <Container maxWidth="lg">
        {/* Hero Section */}
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
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              fontWeight: 700 
            }}
          >
            About {branding.companyName}
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            sx={{ 
              mb: 4,
              fontSize: { xs: '1.2rem', sm: '1.5rem' },
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            {branding.companyTagline}
          </Typography>
        </Box>

        {/* Main Content */}
        <Card sx={{ mb: 8, backgroundColor: 'background.paper' }}>
          <CardContent sx={{ py: 4 }}>
            <Typography 
              variant="body1" 
              sx={{ 
                maxWidth: '800px', 
                mx: 'auto', 
                textAlign: 'center',
                px: { xs: 2, sm: 4 },
                mb: 4
              }}
            >
              {branding.companyDescription}
            </Typography>

            {/* Features Grid */}
            <Grid container spacing={4} sx={{ mb: 4 }}>
              {branding.features.map((feature, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Feature {index + 1}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card sx={{ mb: 8, backgroundColor: 'background.paper' }}>
          <CardContent sx={{ py: 6, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              Get in Touch
            </Typography>
            <Typography variant="body1">
              Email: {branding.contactEmail}
            </Typography>
            <Typography variant="body1">
              Phone: {branding.contactPhone}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Support Hours: {branding.supportHours}
            </Typography>
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
            {branding.copyright}
          </Typography>
        </Box>
      </Container>
    </>
  );
} 
