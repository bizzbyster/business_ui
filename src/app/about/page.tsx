"use client";

import { Container, Typography, Box } from '@mui/material';
import NavBar from '@/components/NavBar';
import DomainForm from '@/components/DomainForm';
import { branding } from '@/config/branding';

export default function About() {
  return (
    <div>
      <NavBar />
      <Container maxWidth={"lg"}>
        <Box sx={{ 
          mt: { xs: 12, md: 16 }, 
          mb: 8,
          px: { xs: 2, sm: 0 }
        }}>
          <Typography 
            variant="h1" 
            component="h1" 
            sx={{ 
              fontSize: { xs: '2.5rem', sm: '3.5rem' },
              fontWeight: 700,
              mb: 8
            }}
          >
            About Clippo
          </Typography>

          <Typography variant="body1" sx={{ fontSize: '1.25rem', mb: 6, maxWidth: '800px' }}>
            Clippo is pioneering the next generation of website performance optimization. We're building tools that help businesses deliver lightning-fast digital experiences through data-driven insights and automated optimizations. Our platform analyzes millions of data points to identify performance bottlenecks and provides actionable recommendations that enhance user experience and drive business growth.
          </Typography>

          <Typography variant="h2" sx={{ fontSize: '2rem', fontWeight: 600, mb: 4, mt: 8 }}>
            Our Story
          </Typography>

          <Typography variant="body1" sx={{ fontSize: '1.25rem', mb: 6, maxWidth: '800px' }}>
            Born from the frustration of managing complex performance optimization tools, our founders saw an opportunity to simplify website optimization. While working at leading tech companies, they witnessed firsthand how proper performance optimization could dramatically impact business success - but existing solutions were either too complex for small teams or too basic for serious businesses.
          </Typography>

          <Typography variant="body1" sx={{ fontSize: '1.25rem', mb: 6, maxWidth: '800px' }}>
            Clippo was designed to bridge this gap, offering enterprise-grade performance optimization that's accessible to businesses of all sizes. We started with a simple question: "What if optimizing website performance was as easy as checking your email?" Today, we're turning that vision into reality.
          </Typography>

          <Typography variant="h2" sx={{ fontSize: '2rem', fontWeight: 600, mb: 4, mt: 8 }}>
            Our Approach
          </Typography>

          <Typography variant="body1" sx={{ fontSize: '1.25rem', mb: 6, maxWidth: '800px' }}>
            We believe that exceptional website performance shouldn't require a team of engineers. Our platform combines advanced analytics with machine learning to automatically identify optimization opportunities and implement improvements. We're currently in beta, working closely with select partners to refine our technology and ensure we deliver measurable results.
          </Typography>

          <Typography variant="h2" sx={{ fontSize: '2rem', fontWeight: 600, mb: 4, mt: 8 }}>
            Looking Ahead
          </Typography>

          <Typography variant="body1" sx={{ fontSize: '1.25rem', mb: 6, maxWidth: '800px' }}>
            The web is evolving rapidly, and performance optimization is more critical than ever. As we prepare for public launch, we're focused on building tools that will help businesses stay ahead of these changes. We're excited to work with forward-thinking companies who understand that website performance is not just about speed - it's about creating better digital experiences that drive business success.
          </Typography>

          <Box sx={{ 
            my: 12, 
            py: 8, 
            borderTop: '1px solid', 
            borderBottom: '1px solid', 
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            borderRadius: 2,
            px: 4
          }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontSize: '2rem', 
                fontWeight: 500, 
                textAlign: 'center', 
                mb: 3 
              }}
            >
              Ready to transform your website's performance?
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: '1.25rem', 
                textAlign: 'center', 
                color: 'text.secondary',
                mb: 6
              }}
            >
              Check if your site qualifies for our exclusive beta program.
            </Typography>
            
            {/* Domain Form */}
            <Box sx={{ maxWidth: '600px', mx: 'auto' }}>
              <DomainForm />
            </Box>
          </Box>
        </Box>
      </Container>
    </div>
  );
}