"use client";

import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import ChatIcon from '@mui/icons-material/Chat';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HelpIcon from '@mui/icons-material/Help';
import BookIcon from '@mui/icons-material/Book';

export default function SupportPage() {
  return (
    <Container maxWidth="lg">
      {/* Header Section */}
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Enterprise Solutions Support
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          We're here to help you succeed with our enterprise solutions
        </Typography>
      </Box>

      {/* Quick Contact Section */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <PhoneIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h6" align="center" gutterBottom>
                24/7 Phone Support
              </Typography>
              <Typography variant="body1" align="center" color="text.secondary">
                (888) 555-0123
              </Typography>
              <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 1 }}>
                Available for Enterprise customers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <EmailIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h6" align="center" gutterBottom>
                Email Support
              </Typography>
              <Typography variant="body1" align="center" color="text.secondary">
                support@enterprisesolutions.com
              </Typography>
              <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 1 }}>
                Response within 24 hours
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <ChatIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h6" align="center" gutterBottom>
                Live Chat
              </Typography>
              <Typography variant="body1" align="center" color="text.secondary">
                Available 9am - 5pm EST
              </Typography>
              <Button variant="contained" sx={{ mt: 2, display: 'block', mx: 'auto' }}>
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Resources Section */}
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Support Resources
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Documentation & Guides
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <ArticleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Product Documentation" 
                    secondary="Comprehensive guides for all our products"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <BookIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="API Reference" 
                    secondary="Complete API documentation and examples"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <HelpIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="FAQs" 
                    secondary="Answers to common questions"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Submit a Support Ticket
              </Typography>
              <Box component="form" sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Subject"
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Description"
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={4}
                />
                <Button 
                  variant="contained" 
                  sx={{ mt: 2 }}
                  fullWidth
                >
                  Submit Ticket
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Support SLA Section */}
      <Card sx={{ mb: 6, bgcolor: 'primary.main', color: 'white' }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h5" gutterBottom>
            Enterprise Support SLA
          </Typography>
          <Typography variant="body1">
            Our enterprise customers enjoy 99.99% uptime guarantee with 24/7 priority support and a maximum 1-hour response time for critical issues.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
