'use client';

import { useEffect, useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Grid, LinearProgress, Button, Accordion, AccordionSummary, AccordionDetails, Tabs, Tab, Divider, Alert, TextField, Paper } from '@mui/material';
import { BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer, Label, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import SpeedIcon from '@mui/icons-material/Speed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalculateIcon from '@mui/icons-material/Calculate';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PeopleIcon from '@mui/icons-material/People';
import DevicesIcon from '@mui/icons-material/Devices';
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

// Sample real-world data for demonstrations
const realWorldVisitData = [
  { date: '2025-02-01', visits: 4200, conversions: 126, bounceRate: 48 },
  { date: '2025-02-02', visits: 4310, conversions: 132, bounceRate: 47 },
  { date: '2025-02-03', visits: 4190, conversions: 124, bounceRate: 49 },
  { date: '2025-02-04', visits: 4560, conversions: 150, bounceRate: 45 },
  { date: '2025-02-05', visits: 4780, conversions: 170, bounceRate: 43 },
  { date: '2025-02-06', visits: 5120, conversions: 192, bounceRate: 41 },
  { date: '2025-02-07', visits: 5350, conversions: 214, bounceRate: 39 },
  { date: '2025-02-08', visits: 5280, conversions: 210, bounceRate: 40 },
  { date: '2025-02-09', visits: 5190, conversions: 205, bounceRate: 40 },
  { date: '2025-02-10', visits: 5320, conversions: 212, bounceRate: 39 },
  { date: '2025-02-11', visits: 5450, conversions: 227, bounceRate: 37 },
  { date: '2025-02-12', visits: 5580, conversions: 235, bounceRate: 36 },
  { date: '2025-02-13', visits: 5720, conversions: 248, bounceRate: 35 },
  { date: '2025-02-14', visits: 5850, conversions: 260, bounceRate: 34 }
];

const deviceDistribution = [
  { name: 'Desktop', value: 48 },
  { name: 'Mobile', value: 42 },
  { name: 'Tablet', value: 10 }
];

const deviceColors = ['#8884d8', '#82ca9d', '#ffc658'];

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
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [dashboardTitle, setDashboardTitle] = useState("Performance Dashboard");
  const [tabValue, setTabValue] = useState(0);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  
  // Revenue calculator states
  const [monthlyVisitors, setMonthlyVisitors] = useState('150000');
  const [conversionRate, setConversionRate] = useState('2.5');
  const [averageOrderValue, setAverageOrderValue] = useState('85');
  const [revenueBoost, setRevenueBoost] = useState('38250');
  
  // Calculate revenue boost
  const calculateRevenueBoost = () => {
    const visitors = parseFloat(monthlyVisitors);
    const conversion = parseFloat(conversionRate);
    const orderValue = parseFloat(averageOrderValue);
    
    if (!isNaN(visitors) && !isNaN(conversion) && !isNaN(orderValue)) {
      // Current monthly revenue
      const currentRevenue = visitors * (conversion / 100) * orderValue;
      
      // With 12% increase in conversion rate
      const improvedConversion = conversion * 1.12;
      const improvedRevenue = visitors * (improvedConversion / 100) * orderValue;
      
      // Calculate boost
      const boost = improvedRevenue - currentRevenue;
      setRevenueBoost(boost.toFixed(0));
    }
  };
  
  // Determine dashboard title based on available data
  useEffect(() => {
    if (isLoaded && user) {
      // First priority: Use domain from metadata if available
      if (user.unsafeMetadata?.domain) {
        setDashboardTitle(`${user.unsafeMetadata.domain}'s Performance Dashboard`);
      } 
      // Second priority: Use user's name
      else if (user.fullName) {
        setDashboardTitle(`${user.fullName}'s Performance Dashboard`);
      }
      else if (user.firstName) {
        setDashboardTitle(`${user.firstName}'s Performance Dashboard`);
      }
      else if (user.username) {
        setDashboardTitle(`${user.username}'s Performance Dashboard`);
      }
      // Default title is already set
      
      // Check if user has completed onboarding
      if (user.unsafeMetadata?.termsAccepted === true) {
        setHasCompletedOnboarding(true);
      }
    }
  }, [user, isLoaded]);

  // Calculate revenue boost on initial load
  useEffect(() => {
    calculateRevenueBoost();
  }, [tabValue]);
  
  // Pre-populate the real-world calculator with data from charts
  useEffect(() => {
    if (tabValue === 1 && hasCompletedOnboarding) {
      // Extract values from the real-world data
      const lastDay = realWorldVisitData[realWorldVisitData.length - 1];
      const totalVisits = realWorldVisitData.reduce((sum, day) => sum + day.visits, 0);
      const totalConversions = realWorldVisitData.reduce((sum, day) => sum + day.conversions, 0);
      
      // Calculate monthly extrapolation (assuming data is 14 days)
      const monthlyVisitorEstimate = Math.round((totalVisits / 14) * 30);
      const currentConversionRate = (totalConversions / totalVisits) * 100;
      
      // Update calculator values
      setMonthlyVisitors(monthlyVisitorEstimate.toString());
      setConversionRate(currentConversionRate.toFixed(2));
    }
  }, [tabValue, hasCompletedOnboarding]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleStartBetaTrial = () => {
    if (typeof window !== 'undefined') {
      const currentDomain = window.location.hostname;
      router.push(`/onboarding?domain=${currentDomain}`);
    } else {
      router.push('/onboarding');
    }
  };

  // For debugging
  useEffect(() => {
    if (isLoaded && user) {
      console.log("User metadata:", user.unsafeMetadata);
      console.log("User info:", {
        fullName: user.fullName,
        firstName: user.firstName,
        username: user.username
      });
    }
  }, [user, isLoaded]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 500 }}>
          {dashboardTitle}
        </Typography>
        {!hasCompletedOnboarding && (
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
        )}
      </Box>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        sx={{ mb: 3 }}
      >
        <Tab label="Synthetic Data" />
        {hasCompletedOnboarding && <Tab label="Real-World Data" />}
      </Tabs>

      {tabValue === 0 && (
        <>
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
            
            {/* Revenue Boost Calculator for Synthetic Data */}
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
                          Fine-tune your revenue boost calculation with your site metrics:
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              label="Monthly Visitors"
                              value={monthlyVisitors}
                              onChange={(e) => setMonthlyVisitors(e.target.value)}
                              type="number"
                              fullWidth
                              variant="outlined"
                              size="small"
                              margin="normal"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              label="Conversion Rate (%)"
                              value={conversionRate}
                              onChange={(e) => setConversionRate(e.target.value)}
                              type="number"
                              fullWidth
                              variant="outlined"
                              size="small"
                              margin="normal"
                              InputProps={{
                                endAdornment: <Box component="span" sx={{ ml: 1 }}>%</Box>,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              label="Average Order Value ($)"
                              value={averageOrderValue}
                              onChange={(e) => setAverageOrderValue(e.target.value)}
                              type="number"
                              fullWidth
                              variant="outlined"
                              size="small"
                              margin="normal"
                              InputProps={{
                                startAdornment: <Box component="span" sx={{ mr: 1 }}>$</Box>,
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                      <Button 
                        variant="contained" 
                        onClick={calculateRevenueBoost}
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
                          ${parseInt(revenueBoost).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Based on a 12% conversion rate improvement with Clippo.
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {tabValue === 1 && hasCompletedOnboarding && (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <StatsCard 
                icon={PeopleIcon}
                title="Daily Visitors"
                value="5,850"
                change="↑ 39% from Before Clippo"
                color={branding.primaryColor}
                explanation="The current average daily visitors to your site. This metric has seen a 39% increase since implementing Clippo, as improved performance leads to better search engine rankings and user satisfaction."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatsCard 
                icon={TrendingUpIcon}
                title="Conversion Rate"
                value="4.44%"
                change="↑ 32% from Before Clippo"
                color={branding.primaryColor}
                explanation="Your site's current conversion rate. This has increased by 32% since implementing Clippo, as faster load times lead to lower abandonment and higher engagement throughout the customer journey."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatsCard 
                icon={SpeedIcon}
                title="Bounce Rate"
                value="34%"
                change="↓ 14% from Before Clippo"
                color={branding.primaryColor}
                explanation="Your site's current bounce rate. This has decreased by 14% since implementing Clippo, as users are more likely to engage with your site when it loads quickly and responds to their interactions promptly."
              />
            </Grid>
            
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Visitors & Conversions (Last 14 Days)
                  </Typography>
                  <Box sx={{ height: 400, mt: 2 }}>
                    <ResponsiveContainer>
                      <LineChart
                        data={realWorldVisitData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" orientation="left" stroke={branding.primaryColor} />
                        <YAxis yAxisId="right" orientation="right" stroke={branding.secondaryColor} />
                        <Tooltip />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="visits"
                          name="Daily Visitors"
                          stroke={branding.primaryColor}
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="conversions"
                          name="Conversions"
                          stroke={branding.secondaryColor}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    This chart shows the daily visitors to your site and the resulting conversions since implementing Clippo.
                    The upward trend demonstrates the positive impact of improved performance on both traffic and conversion metrics.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Device Distribution
                  </Typography>
                  <Box sx={{ height: 300, mt: 2 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={deviceDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {deviceDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={deviceColors[index % deviceColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Breakdown of your site visitors by device type. Mobile performance is especially critical,
                    as it represents nearly half of your traffic and mobile users are particularly sensitive to load times.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Bounce Rate Trend
                  </Typography>
                  <Box sx={{ height: 300, mt: 2 }}>
                    <ResponsiveContainer>
                      <LineChart
                        data={realWorldVisitData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[30, 50]} ticks={[30, 35, 40, 45, 50]} />
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Line
                          type="monotone"
                          dataKey="bounceRate"
                          name="Bounce Rate"
                          stroke="#ff7300"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    This chart shows the declining bounce rate since implementing Clippo.
                    A lower bounce rate indicates users are finding your site more engaging and are exploring more pages.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Revenue Boost Calculator for Real World Data */}
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
                          Fine-tune your revenue boost calculation with your site metrics:
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              label="Monthly Visitors"
                              value={monthlyVisitors}
                              onChange={(e) => setMonthlyVisitors(e.target.value)}
                              type="number"
                              fullWidth
                              variant="outlined"
                              size="small"
                              margin="normal"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              label="Conversion Rate (%)"
                              value={conversionRate}
                              onChange={(e) => setConversionRate(e.target.value)}
                              type="number"
                              fullWidth
                              variant="outlined"
                              size="small"
                              margin="normal"
                              InputProps={{
                                endAdornment: <Box component="span" sx={{ ml: 1 }}>%</Box>,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              label="Average Order Value ($)"
                              value={averageOrderValue}
                              onChange={(e) => setAverageOrderValue(e.target.value)}
                              type="number"
                              fullWidth
                              variant="outlined"
                              size="small"
                              margin="normal"
                              InputProps={{
                                startAdornment: <Box component="span" sx={{ mr: 1 }}>$</Box>,
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                      <Button 
                        variant="contained" 
                        onClick={calculateRevenueBoost}
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
                                                ${parseInt(revenueBoost).toLocaleString()}
                                              </Typography>
                                              <Typography variant="body2" color="text.secondary">
                                                Based on a 12% conversion rate improvement with Clippo.
                                              </Typography>
                                            </Paper>
                                          </Grid>
                                        </Grid>
                                      </CardContent>
                                    </Card>
                                  </Grid>
                                </Grid>
                              </>
                            )}
                      
                            {tabValue === 1 && !hasCompletedOnboarding && (
                              <Box sx={{ mt: 3 }}>
                                <Alert 
                                  severity="info"
                                  action={
                                    <Button color="inherit" size="small" onClick={handleStartBetaTrial}>
                                      Start Now
                                    </Button>
                                  }
                                >
                                  Real-world data will be available after you complete the beta onboarding process.
                                </Alert>
                              </Box>
                            )}
                          </Container>
                        );
                      }