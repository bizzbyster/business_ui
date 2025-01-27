// src/app/page.tsx
import { Container, Typography, Grid, Card, CardContent, Box } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NavBar from '../components/NavBar';
import HeroButtons from '../components/HeroButtons';
import ContactButtons from '../components/ContactButtons';
import { branding } from '../config/branding';

const features = [
  {
    title: "Website Performance",
    description: branding.features[0],
    icon: <SpeedIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
  },
  {
    title: "Simple Integration",
    description: branding.features[1],
    icon: <BusinessIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
  },
  {
    title: "Continuous Monitoring",
    description: branding.features[2],
    icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
  }
];

export default function Home() {
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
            {branding.companyName}
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            gutterBottom 
            sx={{ 
              mb: 4,
              fontSize: { xs: '1.2rem', sm: '1.5rem' },
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            {branding.companyTagline}
          </Typography>
          <HeroButtons />
        </Box>

        {/* Description Section */}
        <Card sx={{ mb: 8, backgroundColor: 'background.paper' }}>
          <CardContent sx={{ py: 4 }}>
            <Typography 
              variant="body1" 
              sx={{ 
                maxWidth: '800px', 
                mx: 'auto', 
                textAlign: 'center',
                px: { xs: 2, sm: 4 }
              }}
            >
              {branding.companyDescription}
            </Typography>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <Grid container spacing={4} sx={{ mb: 8 }} id="features">
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ 
                height: '100%', 
                textAlign: 'center', 
                p: 2,
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}>
                <CardContent>
                  {feature.icon}
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Contact Section */}
        <Card sx={{ mb: 8, backgroundColor: 'background.paper' }}>
          <CardContent sx={{ py: 6 }}>
            <Typography 
              variant="h3" 
              align="center" 
              gutterBottom 
              sx={{ 
                mb: 4,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              Get in Touch
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: 2 
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon color="primary" />
                <Typography>{branding.contactEmail}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon color="primary" />
                <Typography>{branding.contactPhone}</Typography>
              </Box>
              <ContactButtons />
            </Box>
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