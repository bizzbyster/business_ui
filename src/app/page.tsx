'use client';
import { Container, Typography, Grid, Card, CardContent, Button, Box, AppBar, Toolbar } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const content = {
  title: "Enterprise Solutions Inc.",
  subtitle: "Transforming Businesses Through Technology",
  description: "Enterprise Solutions Inc. is a leading provider of enterprise-grade software solutions. We help businesses streamline operations, enhance security, and drive digital transformation through innovative technology solutions.",
  features: [
    {
      title: "Enterprise Software",
      description: "Custom-built enterprise software solutions that scale with your business. Our platforms integrate seamlessly with your existing infrastructure.",
      icon: <BusinessIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
    },
    {
      title: "Cybersecurity",
      description: "Industry-leading security protocols and compliance measures to protect your business data and maintain regulatory compliance.",
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
    },
    {
      title: "Performance Optimization",
      description: "Advanced analytics and optimization solutions to enhance business performance and drive operational efficiency.",
      icon: <SpeedIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
    }
  ],
  contact: {
    email: "contact@enterprisesolutions.com",
    phone: "(888) 555-0123",
    address: "100 Enterprise Way, Silicon Valley, CA 94025"
  }
};

export default function Home() {
  return (
    <>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 700 }}>
            {content.title}
          </Typography>
          <Button color="primary">Contact Sales</Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mt: 12, mb: 8 }}>
          <Typography variant="h1" component="h1" gutterBottom>
            {content.title}
          </Typography>
          <Typography variant="h5" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
            {content.subtitle}
          </Typography>
          <Button variant="contained" size="large" sx={{ mr: 2 }}>
            Schedule Demo
          </Button>
          <Button variant="outlined" size="large">
            Learn More
          </Button>
        </Box>

        {/* Description Section */}
        <Card sx={{ mb: 8, backgroundColor: 'background.paper' }}>
          <CardContent sx={{ py: 4 }}>
            <Typography variant="body1" sx={{ maxWidth: '800px', mx: 'auto', textAlign: 'center' }}>
              {content.description}
            </Typography>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {content.features.map((feature, index) => (
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
            <Typography variant="h3" align="center" gutterBottom sx={{ mb: 4 }}>
              Get in Touch
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon color="primary" />
                <Typography>{content.contact.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon color="primary" />
                <Typography>{content.contact.phone}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon color="primary" />
                <Typography>{content.contact.address}</Typography>
              </Box>
              <Button variant="contained" size="large" sx={{ mt: 3 }}>
                Contact Sales Team
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}