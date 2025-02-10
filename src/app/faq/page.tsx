'use client';

import { Container, Typography, Accordion, AccordionSummary, AccordionDetails, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavBar from '@/components/NavBar';

const faqs = [
  {
    question: "What is the typical implementation timeline?",
    answer: `Our streamlined integration process typically takes under 5 minutes for technical teams. The process involves adding two code snippets to your site&apos;s header, and our platform begins collecting data immediately. While basic implementation is quick, we recommend allocating time for customizing monitoring parameters and optimization settings to align with your specific business objectives.`
  },
  {
    question: "How does Clippo impact site performance?",
    answer: `Clippo&apos;s architecture is designed with performance as a priority. Our script is completely asynchronous and typically adds less than 10ms to load time. We utilize sophisticated lazy-loading techniques, edge caching, and minimal runtime execution to ensure negligible impact on your site&apos;s performance metrics. The optimization benefits typically outweigh any minimal overhead by orders of magnitude.`
  },
  {
    question: "What type of data does Clippo collect?",
    answer: `Clippo collects aggregated performance and business metrics necessary for optimization. This includes technical indicators like load times and resource utilization, alongside business-relevant data points. We explicitly avoid collecting personally identifiable information or sensitive user data. All data collection adheres to global privacy standards and is processed using enterprise-grade encryption protocols.`
  },
  {
    question: "Can I use Clippo across multiple domains?",
    answer: `During our beta phase, we&apos;re focusing on single-domain implementations to ensure optimal service quality. Each additional domain requires separate registration and configuration. This approach allows us to provide dedicated optimization strategies and more accurate analytics for each property. Enterprise solutions for multi-domain deployment will be available in future releases.`
  },
  {
    question: "What does the implementation process entail?",
    answer: `Implementation involves a simple two-step process: first, adding our CDN script to your site&apos;s header, then initializing with your unique configuration parameters. Our platform automatically begins collecting data and generating insights once implemented. Advanced customization options are available through our dashboard for teams requiring more granular control over monitoring and optimization parameters.`
  },
  {
    question: "What level of support is available?",
    answer: `Beta participants receive priority email support with typical response times under 4 hours during business days. Our support team includes technical specialists who can assist with implementation, optimization strategies, and custom configurations. We also maintain comprehensive documentation and provide regular office hours for real-time consultation.`
  },
  {
    question: "How is billing handled during beta?",
    answer: `The beta program is currently offered at no cost to qualified participants. We&apos;ll provide at least 30 days notice before any transition to paid services, along with detailed pricing information. Beta participants will receive preferential pricing and terms when we launch commercial services.`
  },
  {
    question: "What security measures are in place?",
    answer: `Clippo employs industry-leading security practices including end-to-end encryption, regular security audits, and SOC 2 compliant infrastructure. All data is encrypted both in transit and at rest using AES-256 encryption. We maintain strict access controls and conduct regular penetration testing to ensure platform security.`
  }
];

export default function FAQPage() {
  return (
    <div>
      <NavBar />
      <Container maxWidth="lg">
        <Box sx={{ 
          minHeight: 'calc(100vh - 64px)',
          py: { xs: 4, md: 8 }
        }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{ 
              mb: { xs: 4, md: 6 },
              fontWeight: 700,
              fontSize: { xs: '2rem', sm: '2.5rem' }
            }}
          >
            Frequently Asked Questions
          </Typography>

          <Box sx={{ 
            maxWidth: 800, 
            mx: 'auto',
            backgroundColor: 'background.paper',
            borderRadius: 2,
            p: { xs: 2, md: 4 },
            boxShadow: 3
          }}>
            {faqs.map((faq, index) => (
              <Accordion 
                key={index} 
                sx={{ 
                  mb: 2,
                  '&:before': { display: 'none' },
                  boxShadow: 'none',
                  '&:not(:last-child)': {
                    borderBottom: 1,
                    borderColor: 'divider'
                  }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                >
                  <Typography fontWeight="500">{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
      </Container>
    </div>
  );
}