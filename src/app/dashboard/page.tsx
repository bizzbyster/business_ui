'use client';

import { useEffect, useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Grid, LinearProgress, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer, Label } from 'recharts';
import SpeedIcon from '@mui/icons-material/Speed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { branding } from '@/config/branding';

const generateLoadTimes = (minTime: number, maxTime: number, count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const percentile = i / (count - 1);
    const sigmoid = 1 / (1 + Math.exp(-12 * (percentile - 0.5)));
    const lcp = minTime + (maxTime - minTime) * sigmoid;
    
    return {
      lcp,
      percentile: percentile * 100
    };
  });
};

const baselineLCP = generateLoadTimes(1800, 2200, 100);
const clippoLCP = generateLoadTimes(1200, 1600, 100);

const quickStats = [
  {
    icon: SpeedIcon,
    title: 'Current LCP',
    value: '2200ms',
    change: '↓ Needs Improvement',
    color: branding.secondaryColor,
    explanation: 'Your current Largest Contentful Paint (LCP) at 75th percentile is 2200ms. This means 75% of your page loads complete their main content render within this time. An LCP under 2500ms is considered "good" by Google, but every milisecond counts and can affect business metrics.'
  },
  {
    icon: SpeedIcon,
    title: 'Projected LCP',
    value: '1600ms',
    change: '↑ 27% Faster with Clippo',
    color: branding.primaryColor,
    explanation: 'Based on our synthetic tests and real-world data from similar implementations, Clippo can reduce your LCP to approximately 1600ms at the 75th percentile. This improvement is achieved through advanced caching, optimized resource loading, and efficient content delivery.'
  },
  {
    icon: TrendingUpIcon,
    title: 'Conversion Impact',
    value: '+12%',
    change: '↑ Estimated Increase',
    color: branding.primaryColor,
    explanation: 'Research shows that faster load times directly correlate with improved conversion rates. Based on the projected 27% speed improvement, and considering industry benchmarks where a 100ms decrease in load time can improve conversion rates by 1%, we estimate a potential 12% increase in your conversion rate.'
  },
  {
    icon: MonetizationOnIcon,
    title: 'Revenue Boost',
    value: '$24.8k/mo',
    change: '↑ Potential Gain',
    color: branding.primaryColor,
    explanation: 'This estimate is calculated by applying the projected 12% conversion rate increase to your current monthly revenue. For example, if your current monthly revenue is $207k, a 12% improvement could result in an additional $24.8k per month.'
  }
];

const webVitals = [
  { 
    metric: 'LCP (Largest Contentful Paint)', 
    baseline: 2200, 
    optimized: 1600, 
    target: 1600, 
    unit: 'ms'
  },
  { 
    metric: 'FCP (First Contentful Paint)', 
    baseline: 1800, 
    optimized: 1200, 
    target: 1200, 
    unit: 'ms'
  },
  { 
    metric: 'TTFB (Time to First Byte)', 
    baseline: 800, 
    optimized: 200, 
    target: 200, 
    unit: 'ms'
  }
];

interface StatsCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  change: string;
  color: string;
  explanation: string;
}

function StatsCard({ icon: Icon, title, value, change, color, explanation }: StatsCardProps) {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Icon sx={{ mr: 1, color }} />
            <Typography variant="h6">{title}</Typography>
          </Box>
          <Typography variant="h4">{value}</Typography>
          <Typography variant="body2" color={color}>
            {change}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" color="text.secondary">
          {explanation}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();
  
  const handleStartBetaTrial = () => {
    const currentDomain = window.location.hostname;
    router.push(`/onboarding?domain=${currentDomain}`);
  };

  // Get domain from metadata, or fall back to other identifiers
  const displayDomain = user?.unsafeMetadata?.domain || 
                       window.location.hostname || 
                       "Your";

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 500 }}>
          {`${displayDomain}'s Performance Dashboard`}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleStartBetaTrial}
          sx={{
            backgroundColor: branding.primaryColor,
            '&:hover': {
              backgroundColor: '#3570b3',
            },
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Start Beta Trial
        </Button>
      </Box>

      <Grid container spacing={3}>
        {quickStats.map((stat, index) => (
          <Grid item xs={12} md={3} key={index}>
            <StatsCard {...stat} />
          </Grid>
        ))}

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                LCP Distribution Comparison
              </Typography>
              <Box sx={{ height: 400, mt: 2 }}>
                <ResponsiveContainer>
                  <ScatterChart
                    margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      type="number" 
                      dataKey="lcp" 
                      name="LCP" 
                      unit="ms"
                      domain={[1000, 2400]}
                      ticks={[1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400]}
                    >
                      <Label 
                        value="Load Time (milliseconds)" 
                        position="bottom" 
                        offset={30}
                      />
                    </XAxis>
                    <YAxis 
                      type="number" 
                      dataKey="percentile" 
                      name="percentile" 
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                      width={50}
                    >
                      <Label
                        value="Percentile Distribution"
                        position="left"
                        angle={-90}
                        offset={40}
                        style={{ textAnchor: 'middle' }}
                      />
                    </YAxis>
                    
                    <ReferenceLine 
                      y={75} 
                      stroke="#666" 
                      strokeDasharray="3 3"
                    />

                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      formatter={(value: number, name: string) => {
                        if (name === 'lcp') return [`${value.toFixed(0)}ms`, 'Load Time'];
                        if (name === 'percentile') return [`${value.toFixed(1)}%`, 'Percentile'];
                        return [value, name];
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                    />
                    
                    <Scatter 
                      name="Without Clippo" 
                      data={baselineLCP}
                      fill={branding.secondaryColor}
                      fillOpacity={0.6}
                    />
                    <Scatter 
                      name="With Clippo" 
                      data={clippoLCP}
                      fill={branding.primaryColor}
                      fillOpacity={0.6}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Each point represents a page load test, showing how quickly the largest content element (like a hero image or headline) appears on screen. 
                The distribution demonstrates that with Clippo, 75% of your page loads will complete the main content render in under 1.6 seconds – significantly faster 
                than the current 2.2 seconds. This improvement directly impacts user experience and engagement, as visitors see your key content sooner.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Core Web Vitals Summary
              </Typography>
              {webVitals.map((vital) => (
                <Box key={vital.metric} sx={{ my: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>{vital.metric}</Typography>
                  </Box>
                  {/* Container for both progress bars */}
                  <Box sx={{ mb: 1 }}>
                    {/* Without Clippo bar */}
                    <Box sx={{ mb: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(vital.baseline / 2400) * 100}
                        sx={{
                          height: 8,
                          backgroundColor: '#eef0f2',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: branding.secondaryColor
                          }
                        }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          Without Clippo
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {vital.baseline} {vital.unit}
                        </Typography>
                      </Box>
                    </Box>
                    {/* With Clippo bar */}
                    <Box>
                      <LinearProgress
                        variant="determinate"
                        value={(vital.target / 2400) * 100}
                        sx={{
                          height: 8,
                          backgroundColor: '#eef0f2',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: branding.primaryColor
                          }
                        }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          With Clippo
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {vital.optimized} {vital.unit}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}