"use client";

import { Container, Typography, Grid, Card, CardContent, Box, Button } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import NavBar from '@/components/NavBar';
import DomainForm from '@/components/DomainForm';
import { branding } from '@/config/branding';

const features = [
 {
   title: "Website Performance",
   description: "Boost page load times and user experience with our next-generation performance optimization technology",
   icon: <SpeedIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
 },
 {
   title: "Simple Integration",
   description: "One-click setup to start monitoring and improving your site's performance metrics",
   icon: <BusinessIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
 },
 {
   title: "Continuous Monitoring",
   description: "Real-time tracking of key performance indicators and automated optimization suggestions",
   icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
 }
];

export default function Home() {
 return (
   <div>
     <NavBar />
     
     <Container maxWidth={"lg"}>
       {/* Hero Section with Domain Form */}
       <Box sx={{ 
         mt: { xs: 12, md: 16 }, 
         mb: 12,
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
           Transform Your Website Performance
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
           Get instant insights and optimizations to boost your site`&apos;`s speed, user experience, and conversion rates.
         </Typography>
         
         {/* Domain Form */}
         <Box sx={{ maxWidth: '600px', mx: 'auto' }}>
           <DomainForm />
         </Box>
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
               p: 3,
               backgroundColor: 'background.paper',
               boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
               borderRadius: 2
             }}>
               <CardContent>
                 {feature.icon}
                 <Typography 
                   variant="h5" 
                   gutterBottom 
                   sx={{ 
                     mb: 2,
                     fontWeight: 500
                   }}
                 >
                   {feature.title}
                 </Typography>
                 <Typography 
                   variant="body1" 
                   color="text.secondary"
                   sx={{ lineHeight: 1.6 }}
                 >
                   {feature.description}
                 </Typography>
               </CardContent>
             </Card>
           </Grid>
         ))}
       </Grid>

       {/* Trust/About Section */}
       <Card sx={{ mb: 8, backgroundColor: 'background.paper' }}>
         <CardContent sx={{ py: 8 }}>
           <Typography 
             variant="h4" 
             align="center" 
             gutterBottom 
             sx={{ 
               mb: 4,
               fontSize: { xs: '1.75rem', sm: '2rem', md: '2.75rem' },
               maxWidth: '800px',
               mx: 'auto',
               fontWeight: 500,
               lineHeight: 1.2
             }}
           >
             Be among the first to optimize your website with our cutting-edge beta. Coming soon.
           </Typography>
           
           <Box sx={{ 
             display: 'flex', 
             justifyContent: 'center',
             mt: 6
           }}>
             <Button 
               variant="contained" 
               size="large"
               href="/about"
               sx={{
                 fontSize: '1.1rem',
                 py: 1.5,
                 px: 4,
                 borderRadius: '50px'
               }}
             >
               Learn More
             </Button>
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
   </div>
 );
}