'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Container, Typography, Box, Card, CardContent, Grid, 
  LinearProgress, Button, Accordion, AccordionSummary, 
  AccordionDetails, Divider, Alert, Paper, TextField 
} from '@mui/material';
import { 
  ScatterChart, Scatter, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ReferenceLine, 
  ResponsiveContainer, Label
} from 'recharts';
import SpeedIcon from '@mui/icons-material/Speed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalculateIcon from '@mui/icons-material/Calculate';
import Link from "next/link";
import { branding } from '@/config/branding';

interface StatsCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  change: string;
  color: string;
  explanation: string;
}

// Reuse the StatsCard component from the main dashboard
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

// Use the same quick stats from the main dashboard
const quickStats = [
  {
    icon: SpeedIcon,
    title: 'Baseline LCP',
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
  }
];

interface WebVital {
  metric: string;
  baseline: number;
  optimized: number;
  target: number;
  unit: string;
}

// Web Vitals data
const webVitals: WebVital[] = [
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

interface LCPDataPoint {
  lcp: number;
  percentile: number;
}

// Generate curves similar to the real-world example with adjusted max values
const generateLoadTimes = (minTime: number, maxTime: number, count: number, isClipper: boolean): LCPDataPoint[] => {
  return Array.from({ length: count }, (_, i) => {
    const percentile = i / (count - 1);
    
    let lcp;
    
    if (isClipper) {
      // Starting around 900ms, ending around 1600ms with steep rise between 20-40%
      if (percentile < 0.1) {
        // Initial slow rise
        lcp = 900 + (percentile / 0.1) * 100;
      } else if (percentile < 0.3) {
        // Steeper rise in the middle-lower section
        lcp = 1000 + ((percentile - 0.1) / 0.2) * 400;
      } else if (percentile < 0.7) {
        // Steady climb in the middle section
        lcp = 1400 + ((percentile - 0.3) / 0.4) * 500;
      } else {
        // Final gentle approach to max
        lcp = 1900 + ((percentile - 0.7) / 0.3) * 200;
      }
    } else {
      // Starting around 1300ms, ending around 3400-3500ms
      if (percentile < 0.15) {
        // Initial flat part
        lcp = 1300 + (percentile / 0.15) * 200;
      } else if (percentile < 0.4) {
        // First main rise
        lcp = 1500 + ((percentile - 0.15) / 0.25) * 500;
      } else if (percentile < 0.75) {
        // Second main rise
        lcp = 2000 + ((percentile - 0.4) / 0.35) * 1000;
      } else {
        // Final gentler rise to max
        lcp = 3000 + ((percentile - 0.75) / 0.25) * 400;
      }
    }
    
    return {
      lcp,
      percentile: percentile * 100
    };
  });
};

// Generate 40 points for each curve to get detailed shapes
const clippoLCP = generateLoadTimes(900, 2100, 40, true);
const baselineLCP = generateLoadTimes(1300, 3400, 40, false);

// Client component that uses useSearchParams
const TeaserDashboardContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get domain from URL parameter
  const domain = searchParams.get('domain');
  const [dashboardTitle, setDashboardTitle] = useState("Performance Dashboard");
  const [isChartLoaded, setIsChartLoaded] = useState(false);
  
  // Revenue calculator states
  const [syntheticMonthlyVisitors, setSyntheticMonthlyVisitors] = useState('');
  const [syntheticConversionRate, setSyntheticConversionRate] = useState('');
  const [syntheticAverageOrderValue, setSyntheticAverageOrderValue] = useState('');
  const [syntheticRevenueBoost, setSyntheticRevenueBoost] = useState('0');
  const [showSyntheticCalculations, setShowSyntheticCalculations] = useState(false);
  
  // Set the dashboard title using the domain
  useEffect(() => {
    if (domain) {
      setDashboardTitle(`${domain}'s Performance Dashboard`);
    }
    setIsChartLoaded(true);
  }, [domain]);

  const handleStartBetaTrial = () => {
    // Always route to sign-up without parameters for the demo
    router.push('/sign-up');
  };
  
  // Calculate revenue boost for synthetic data
  const calculateSyntheticRevenueBoost = useCallback(() => {
    const visitors = parseFloat(syntheticMonthlyVisitors);
    const conversion = parseFloat(syntheticConversionRate);
    const orderValue = parseFloat(syntheticAverageOrderValue);
    
    if (!isNaN(visitors) && !isNaN(conversion) && !isNaN(orderValue)) {
      // Current monthly revenue
      const currentRevenue = visitors * (conversion / 100) * orderValue;
      
      // With 12% increase in conversion rate
      const improvedConversion = conversion * 1.12;
      const improvedRevenue = visitors * (improvedConversion / 100) * orderValue;
      
      // Calculate boost
      const boost = improvedRevenue - currentRevenue;
      setSyntheticRevenueBoost(boost.toFixed(0));
      setShowSyntheticCalculations(true);
    }
  }, [syntheticMonthlyVisitors, syntheticConversionRate, syntheticAverageOrderValue]);

  if (!isChartLoaded) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Typography>Loading charts...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Simple header - no authentication required */}
      <Box sx={{ pb: 2, mb: 3, borderBottom: "1px solid rgba(0,0,0,0.1)", display: "flex", alignItems: "center" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              color: "primary.main",
              fontWeight: 700,
              "&:hover": {
                opacity: 0.8,
              },
            }}
          >
            {branding.companyName}
          </Typography>
        </Link>
        <Typography
          variant="h6"
          component="div"
          sx={{
            color: "text.secondary",
            ml: 1,
          }}
        >
          Analysis Preview
        </Typography>
      </Box>
    
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 500 }}>
          {dashboardTitle}
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

      <Alert severity="info" sx={{ mb: 3 }}>
        This is a preview of your performance metrics. Start the beta trial to get access to the full dashboard with real-world data.
      </Alert>

      <Grid container spacing={3}>
        {quickStats.map((stat, index) => (
          <Grid item xs={12} md={4} key={index}>
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
                      domain={[500, 3500]}
                      ticks={[500, 1000, 1500, 2000, 2500, 3000, 3500]}
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
                      formatter={(value, name) => {
                        if (name === 'lcp') {
                          // Check if value is a number before using toFixed
                          return [`${typeof value === 'number' ? value.toFixed(0) : value}ms`, 'Load Time'];
                        }
                        if (name === 'percentile') {
                          // Check if value is a number before using toFixed
                          return [`${typeof value === 'number' ? value.toFixed(1) : value}%`, 'Percentile'];
                        }
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
                      line={{stroke: branding.secondaryColor, strokeWidth: 2, type: 'monotone'}}
                      lineJointType="monotone"
                      shape="circle"
                    />
                    <Scatter 
                      name="With Clippo" 
                      data={clippoLCP}
                      fill={branding.primaryColor}
                      line={{stroke: branding.primaryColor, strokeWidth: 2, type: 'monotone'}}
                      lineJointType="monotone"
                      shape="circle"
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

        {/* Core Web Vitals Summary */}
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
            
        {/* Revenue Boost Calculator */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalculateIcon sx={{ mr: 1, color: branding.primaryColor }} />
                <Typography variant="h6">
                  Revenue Boost Calculator
                </Typography>
              </Box>
              
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={7}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Enter your site metrics to estimate your potential revenue boost with Clippo:
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Current Monthly Visitors"
                          value={syntheticMonthlyVisitors}
                          onChange={(e) => setSyntheticMonthlyVisitors(e.target.value)}
                          type="number"
                          fullWidth
                          variant="outlined"
                          size="small"
                          margin="normal"
                          placeholder="e.g., 150000"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Current Conversion Rate (%)"
                          value={syntheticConversionRate}
                          onChange={(e) => setSyntheticConversionRate(e.target.value)}
                          type="number"
                          fullWidth
                          variant="outlined"
                          size="small"
                          margin="normal"
                          placeholder="e.g., 2.5"
                          InputProps={{
                            endAdornment: <Box component="span" sx={{ ml: 1 }}>%</Box>,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Average Order Value ($)"
                          value={syntheticAverageOrderValue}
                          onChange={(e) => setSyntheticAverageOrderValue(e.target.value)}
                          type="number"
                          fullWidth
                          variant="outlined"
                          size="small"
                          margin="normal"
                          placeholder="e.g., 85"
                          InputProps={{
                            startAdornment: <Box component="span" sx={{ mr: 1 }}>$</Box>,
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                  <Button 
                    variant="contained" 
                    onClick={calculateSyntheticRevenueBoost}
                    sx={{ 
                      backgroundColor: branding.primaryColor,
                      '&:hover': {
                        backgroundColor: '#3570b3',
                      }
                    }}
                  >
                    CALCULATE
                  </Button>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 3, 
                      backgroundColor: '#f8f9fa', 
                      borderRadius: 2,
                      border: '1px solid #e0e0e0'
                    }}
                  >
                    <Typography variant="h6" gutterBottom color="primary">
                      Potential Monthly Revenue Boost
                    </Typography>
                    <Typography variant="h3" sx={{ mb: 1, color: '#2e7d32' }}>
                      ${parseInt(syntheticRevenueBoost).toLocaleString() || '0'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Based on a 12% conversion rate improvement with Clippo.
                    </Typography>
                  </Paper>
                </Grid>
                {showSyntheticCalculations && (
                  <Grid item xs={12}>
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle1">
                          How is this calculated?
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          The revenue boost is calculated based on our research that shows a 12% increase in conversion rate from speed improvements:
                        </Typography>
                        <Box sx={{ mt: 1, ml: 2 }}>
                          <Typography variant="body2" gutterBottom>
                            1. Current Monthly Revenue: 
                            <Box component="span" sx={{ fontWeight: 'bold', mx: 1 }}>
                              {parseInt(syntheticMonthlyVisitors).toLocaleString() || '0'} visits × {syntheticConversionRate || '0'}% conversion × ${syntheticAverageOrderValue || '0'} = 
                              ${((parseFloat(syntheticMonthlyVisitors || '0') * parseFloat(syntheticConversionRate || '0') / 100 * parseFloat(syntheticAverageOrderValue || '0'))).toLocaleString()}
                            </Box>
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            2. Expected Conversion Rate with Clippo: 
                            <Box component="span" sx={{ fontWeight: 'bold', mx: 1 }}>
                              {syntheticConversionRate || '0'}% × 1.12 = {(parseFloat(syntheticConversionRate || '0') * 1.12).toFixed(2)}%
                            </Box>
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            3. Expected Monthly Revenue with Clippo: 
                            <Box component="span" sx={{ fontWeight: 'bold', mx: 1 }}>
                              {parseInt(syntheticMonthlyVisitors).toLocaleString() || '0'} visits × {(parseFloat(syntheticConversionRate || '0') * 1.12).toFixed(2)}% conversion × ${syntheticAverageOrderValue || '0'} = 
                              ${((parseFloat(syntheticMonthlyVisitors || '0') * parseFloat(syntheticConversionRate || '0') * 1.12 / 100 * parseFloat(syntheticAverageOrderValue || '0'))).toLocaleString()}
                            </Box>
                          </Typography>
                          <Typography variant="body2" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                            4. Monthly Revenue Boost: 
                            <Box component="span" sx={{ mx: 1 }}>
                              ${parseInt(syntheticRevenueBoost).toLocaleString()}
                            </Box>
                          </Typography>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

// Main page component with Suspense boundary
export default function TeaserDashboardPage() {
  return (
    <Suspense fallback={
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Typography>Loading dashboard...</Typography>
        </Box>
      </Container>
    }>
      <TeaserDashboardContent />
    </Suspense>
  );
}