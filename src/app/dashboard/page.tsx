"use client";

import { useEffect, useState, useCallback } from 'react';
import { 
  Container, Typography, Box, Card, CardContent, Grid, 
  LinearProgress, Button, Accordion, AccordionSummary, 
  AccordionDetails, Tabs, Tab, Divider, Alert, TextField, Paper 
} from '@mui/material';
import { 
  BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ReferenceLine, 
  ResponsiveContainer, Label, LineChart, Line, 
  PieChart, Pie, Cell, ComposedChart 
} from 'recharts';
import SpeedIcon from '@mui/icons-material/Speed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalculateIcon from '@mui/icons-material/Calculate';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PeopleIcon from '@mui/icons-material/People';
import DevicesIcon from '@mui/icons-material/Devices';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { branding } from '@/config/branding';

// Define interfaces
interface PercentileDataPoint {
  percentile: number;
  lcp: number;
}

interface PercentileData {
  clippoData: PercentileDataPoint[];
  nonClippoData: PercentileDataPoint[];
}

interface DataPayload {
  dataKey: string;
  name: string;
  value: number;
  color: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: DataPayload[];
  label?: string;
}

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

// Real data extrapolated from the provided graph
const generateRealPercentileData = (): PercentileData => {
  // Extrapolated data points from the graph
  const clippoDataPoints = [
    { percentile: 0, lcp: 850 },
    { percentile: 5, lcp: 900 },
    { percentile: 10, lcp: 950 },
    { percentile: 20, lcp: 1000 },
    { percentile: 28, lcp: 1050 },
    { percentile: 32, lcp: 1150 },
    { percentile: 36, lcp: 1250 },
    { percentile: 40, lcp: 1400 },
    { percentile: 45, lcp: 1550 },
    { percentile: 50, lcp: 1700 },
    { percentile: 55, lcp: 1800 },
    { percentile: 60, lcp: 1900 },
    { percentile: 65, lcp: 2000 },
    { percentile: 68, lcp: 2100 },
    { percentile: 72, lcp: 2200 },
    { percentile: 75, lcp: 2300 },
    { percentile: 80, lcp: 2400 },
    { percentile: 85, lcp: 2500 },
    { percentile: 90, lcp: 2700 },
    { percentile: 95, lcp: 3000 },
    { percentile: 98, lcp: 3300 },
    { percentile: 100, lcp: 3500 }
  ];

  const nonClippoDataPoints = [
    { percentile: 0, lcp: 1300 },
    { percentile: 5, lcp: 1400 },
    { percentile: 10, lcp: 1500 },
    { percentile: 15, lcp: 1600 },
    { percentile: 25, lcp: 1700 },
    { percentile: 35, lcp: 1800 },
    { percentile: 40, lcp: 2000 },
    { percentile: 45, lcp: 2100 },
    { percentile: 50, lcp: 2300 },
    { percentile: 55, lcp: 2400 },
    { percentile: 60, lcp: 2500 },
    { percentile: 65, lcp: 2600 },
    { percentile: 70, lcp: 2700 },
    { percentile: 75, lcp: 2800 },
    { percentile: 80, lcp: 3200 },
    { percentile: 85, lcp: 3600 },
    { percentile: 90, lcp: 4000 },
    { percentile: 95, lcp: 4500 },
    { percentile: 98, lcp: 5000 },
    { percentile: 100, lcp: 5500 }
  ];

  // Generate full set of percentile points (0-100) using interpolation
  const clippoData = [];
  const nonClippoData = [];

  // Function to interpolate between known data points
  const interpolate = (dataPoints: Array<{ percentile: number, lcp: number }>, targetPercentile: number): number => {
    // Find the two closest points
    for (let i = 0; i < dataPoints.length - 1; i++) {
      if (dataPoints[i].percentile <= targetPercentile && dataPoints[i + 1].percentile >= targetPercentile) {
        const lowerPoint = dataPoints[i];
        const upperPoint = dataPoints[i + 1];
        
        // Linear interpolation formula
        const percentRatio = (targetPercentile - lowerPoint.percentile) / (upperPoint.percentile - lowerPoint.percentile);
        const interpolatedLcp = lowerPoint.lcp + percentRatio * (upperPoint.lcp - lowerPoint.lcp);
        
        return interpolatedLcp;
      }
    }
    // Fallback
    return dataPoints[dataPoints.length - 1].lcp;
  };

  // Generate 101 points (0-100%)
  for (let i = 0; i <= 100; i++) {
    clippoData.push({
      percentile: i,
      lcp: interpolate(clippoDataPoints, i)
    });
    
    nonClippoData.push({
      percentile: i,
      lcp: interpolate(nonClippoDataPoints, i)
    });
  }
  
  return { clippoData, nonClippoData };
};

// Get conversion rate for a given LCP value
const getConversionRateForLcp = (lcp: number): number => {
  // For LCP < 0.5s, conversion rate is 0 (error pages)
  if (lcp < 500) return 0;
  
  // Otherwise, conversion rate decreases as LCP increases
  // Starting from about 8% at 0.6s, down to about 1% at 6s
  // Using a sigmoid-inspired function that falls off more steeply in the middle range
  
  // Parameters for the conversion rate function
  const maxRate = 8.0;  // Maximum conversion rate (%)
  const midPoint = 2500; // LCP value at which conversion rate is half of max
  const steepness = 0.0005; // Controls how steeply the rate falls off
  
  // Logistic function with adjustments
  const rate = maxRate / (1 + Math.exp((lcp - midPoint) * steepness)) - 0.1;
  
  // Ensure rate is non-negative and doesn't exceed the maximum
  return Math.max(0, Math.min(maxRate, rate));
};

// Generate histogram data based on the logic
const createLogicalHistogramData = () => {
  // Create bins with specific ranges
  const binRanges = [
    { start: 0, end: 500, label: '0-0.5s' },
    { start: 500, end: 800, label: '0.5-0.8s' },
    { start: 800, end: 1000, label: '0.8-1s' },
    { start: 1000, end: 1200, label: '1-1.2s' },
    { start: 1200, end: 1500, label: '1.2-1.5s' },
    { start: 1500, end: 2000, label: '1.5-2s' },
    { start: 2000, end: 2500, label: '2-2.5s' },
    { start: 2500, end: 3000, label: '2.5-3s' },
    { start: 3000, end: 3500, label: '3-3.5s' },
    { start: 3500, end: 4000, label: '3.5-4s' },
    { start: 4000, end: 5000, label: '4-5s' },
    { start: 5000, end: 6000, label: '5-6s' }
  ];

  // Define session distributions for Clippo and non-Clippo
  // These should roughly align with the percentile distribution from the first chart
  // Clippo has more sessions in lower LCP bins, non-Clippo has more in higher LCP bins
  
  // Total number of sessions for each
  const totalClippoSessions = 500;
  const totalNonClippoSessions = 500;
  
  // Distribution of sessions across bins for Clippo (roughly F-shaped)
  const clippoDistribution = [
    0.01, // 0-0.5s (1% - error pages)
    0.03, // 0.5-0.8s (3%)
    0.06, // 0.8-1s (6%)
    0.12, // 1-1.2s (12%)
    0.15, // 1.2-1.5s (15%)
    0.20, // 1.5-2s (20%)
    0.18, // 2-2.5s (18%)
    0.12, // 2.5-3s (12%)
    0.06, // 3-3.5s (6%)
    0.04, // 3.5-4s (4%)
    0.02, // 4-5s (2%)
    0.01  // 5-6s (1%)
  ];
  
  // Distribution of sessions across bins for non-Clippo (shifted right)
  const nonClippoDistribution = [
    0.00, // 0-0.5s (0% - no error pages in baseline)
    0.00, // 0.5-0.8s (0%)
    0.01, // 0.8-1s (1%)
    0.03, // 1-1.2s (3%)
    0.06, // 1.2-1.5s (6%)
    0.10, // 1.5-2s (10%)
    0.15, // 2-2.5s (15%)
    0.18, // 2.5-3s (18%)
    0.20, // 3-3.5s (20%)
    0.12, // 3.5-4s (12%)
    0.10, // 4-5s (10%)
    0.05  // 5-6s (5%)
  ];
  
  // Initialize histogram data
  const histogramData = binRanges.map((range, index) => {
    // Calculate number of sessions for this bin
    const clippoSessions = Math.round(totalClippoSessions * clippoDistribution[index]);
    const nonClippoSessions = Math.round(totalNonClippoSessions * nonClippoDistribution[index]);
    
    // Calculate conversion rates based on actual data rather than a function
    // We'll define conversion percentages per bin that decrease as load time increases
    const conversionPercentages = [
      0.0,  // 0-0.5s (0% - error pages don't convert)
      6.5,  // 0.5-0.8s (6.5%)
      5.8,  // 0.8-1s (5.8%)
      5.2,  // 1-1.2s (5.2%)
      4.6,  // 1.2-1.5s (4.6%)
      4.2,  // 1.5-2s (4.2%)
      3.8,  // 2-2.5s (3.8%)
      3.4,  // 2.5-3s (3.4%)
      3.0,  // 3-3.5s (3.0%)
      2.6,  // 3.5-4s (2.6%)
      2.2,  // 4-5s (2.2%)
      1.8   // 5-6s (1.8%)
    ];
    
    // Calculate number of converted sessions
    const clippoConverted = Math.round(clippoSessions * (conversionPercentages[index] / 100));
    const nonClippoConverted = Math.round(nonClippoSessions * (conversionPercentages[index] / 100));
    
    // Calculate actual conversion rates based on converted/total for each bin
    const clippoConversionRate = clippoSessions > 0 ? (clippoConverted / clippoSessions) * 100 : 0;
    const nonClippoConversionRate = nonClippoSessions > 0 ? (nonClippoConverted / nonClippoSessions) * 100 : 0;
    
    return {
      binStart: range.start,
      binEnd: range.end,
      range: range.label,
      midpointLcp: (range.start + range.end) / 2,
      clippoTotal: clippoSessions,
      clippoConverted: clippoConverted,
      clippoNonConverted: clippoSessions - clippoConverted,
      clippoConversionRate: clippoConversionRate,
      nonClippoTotal: nonClippoSessions,
      nonClippoConverted: nonClippoConverted,
      nonClippoNonConverted: nonClippoSessions - nonClippoConverted,
      nonClippoConversionRate: nonClippoConversionRate
    };
  });

  // Calculate average conversion rates from the actual data
  const clippoTotalSessions = histogramData.reduce((sum, bin) => sum + bin.clippoTotal, 0);
  const clippoTotalConverted = histogramData.reduce((sum, bin) => sum + bin.clippoConverted, 0);
  const clippoAvgConversionRate = clippoTotalSessions > 0 ? (clippoTotalConverted / clippoTotalSessions * 100) : 0;
  
  const nonClippoTotalSessions = histogramData.reduce((sum, bin) => sum + bin.nonClippoTotal, 0);
  const nonClippoTotalConverted = histogramData.reduce((sum, bin) => sum + bin.nonClippoConverted, 0);
  const nonClippoAvgConversionRate = nonClippoTotalSessions > 0 ? (nonClippoTotalConverted / nonClippoTotalSessions * 100) : 0;
  
  return { 
    histogramData, 
    averages: {
      clippoAvgConversionRate: Number(clippoAvgConversionRate.toFixed(2)),
      nonClippoAvgConversionRate: Number(nonClippoAvgConversionRate.toFixed(2))
    }
  };
};

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

// Constants for real-world metrics
const DAILY_VISITORS = 5850;
const IMPROVED_CONVERSION_RATE = 4;
const CONVERSION_INCREASE_PERCENT = 32;

interface StatsCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  change: string;
  color: string;
  explanation: string;
}

function StatsCard({
  icon: Icon,
  title,
  value,
  change,
  color,
  explanation,
}: StatsCardProps) {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
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
  const [isChartLoaded, setIsChartLoaded] = useState(false);
  
  // Revenue calculator states for synthetic data
  const [syntheticMonthlyVisitors, setSyntheticMonthlyVisitors] = useState('');
  const [syntheticConversionRate, setSyntheticConversionRate] = useState('');
  const [syntheticAverageOrderValue, setSyntheticAverageOrderValue] = useState('');
  const [syntheticRevenueBoost, setSyntheticRevenueBoost] = useState('0');
  const [showSyntheticCalculations, setShowSyntheticCalculations] = useState(false);
  
  // Revenue calculator states for real-world data
  const [realMonthlyVisitors, setRealMonthlyVisitors] = useState((DAILY_VISITORS * 30).toString());
  const [realConversionRate, setRealConversionRate] = useState(IMPROVED_CONVERSION_RATE.toString());
  const [realAverageOrderValue, setRealAverageOrderValue] = useState('85');
  const [realRevenueBoost, setRealRevenueBoost] = useState('0');
  
  // LCP Distribution data
  const [percentileData, setPercentileData] = useState<PercentileData>({ 
    clippoData: [], 
    nonClippoData: [] 
  });
  const [histogramData, setHistogramData] = useState<Array<any>>([]);
  const [averageRates, setAverageRates] = useState<{
    clippoAvgConversionRate: number;
    nonClippoAvgConversionRate: number;
  }>({ clippoAvgConversionRate: 0, nonClippoAvgConversionRate: 0 });
  
  // Calculate derived values for the chart
  const enhancedVisitData = realWorldVisitData.map(day => ({
    ...day,
    nonConvertedVisits: day.visits - day.conversions,
    conversionRate: (day.conversions / day.visits) * 100
  }));
  
  // Generate LCP distribution data
  useEffect(() => {
    const data = generateRealPercentileData();
    const { histogramData, averages } = createLogicalHistogramData();
    
    setPercentileData(data);
    setHistogramData(histogramData);
    setAverageRates(averages);
    setIsChartLoaded(true);
  }, []);
  
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
  
  // Calculate revenue boost for real-world data
  const calculateRealRevenueBoost = useCallback(() => {
    const visitors = parseFloat(realMonthlyVisitors);
    const currentConversion = parseFloat(realConversionRate);
    const orderValue = parseFloat(realAverageOrderValue);
    
    if (!isNaN(visitors) && !isNaN(currentConversion) && !isNaN(orderValue)) {
      // Calculate original conversion rate (before Clippo)
      // If current rate is 4.44% and it increased by 32%, then original was:
      // Original = Current / (1 + Increase%)
      const originalConversionRate = currentConversion / (1 + (CONVERSION_INCREASE_PERCENT / 100));
      
      // Calculate monthly revenue with original and improved conversion rates
      const originalRevenue = visitors * (originalConversionRate / 100) * orderValue;
      const improvedRevenue = visitors * (currentConversion / 100) * orderValue;
      
      // Calculate boost
      const boost = improvedRevenue - originalRevenue;
      setRealRevenueBoost(boost.toFixed(0));
    }
  }, [realMonthlyVisitors, realConversionRate, realAverageOrderValue]);
  
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

  // Calculate real-world revenue boost on tab change
  useEffect(() => {
    if (tabValue === 1 && hasCompletedOnboarding) {
      calculateRealRevenueBoost();
    }
  }, [tabValue, hasCompletedOnboarding, calculateRealRevenueBoost]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
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

  // Custom tooltip component with proper return structure
  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      const conversionPayload = payload.find(p => p.dataKey === 'clippoConversionRate' || p.dataKey === 'nonClippoConversionRate');
      const sessionPayload = payload.filter(p => p.dataKey !== 'clippoConversionRate' && p.dataKey !== 'nonClippoConversionRate');
      
      return (
        <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
          <p style={{ margin: 0 }}>{`Load Time: ${label}`}</p>
          {sessionPayload.map((entry, index) => (
            <p key={`session-${index}`} style={{ margin: 0, color: entry.color }}>
              {`${entry.name}: ${entry.value} sessions`}
            </p>
          ))}
          {conversionPayload && (
            <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', color: conversionPayload.color }}>
              {`Conversion Rate: ${Number(conversionPayload.value).toFixed(2)}%`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (!isChartLoaded || !isLoaded) {
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
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
            
            {/* Revenue Boost Calculator for Synthetic Data - Only show if NOT completed onboarding */}
            {!hasCompletedOnboarding && (
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
                                    {parseInt(syntheticMonthlyVisitors).toLocaleString()} visits × {syntheticConversionRate}% conversion × ${syntheticAverageOrderValue} = 
                                    ${((parseFloat(syntheticMonthlyVisitors) * parseFloat(syntheticConversionRate) / 100 * parseFloat(syntheticAverageOrderValue))).toLocaleString()}
                                  </Box>
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  2. Expected Conversion Rate with Clippo: 
                                  <Box component="span" sx={{ fontWeight: 'bold', mx: 1 }}>
                                    {syntheticConversionRate}% × 1.12 = {(parseFloat(syntheticConversionRate) * 1.12).toFixed(2)}%
                                  </Box>
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  3. Expected Monthly Revenue with Clippo: 
                                  <Box component="span" sx={{ fontWeight: 'bold', mx: 1 }}>
                                    {parseInt(syntheticMonthlyVisitors).toLocaleString()} visits × {(parseFloat(syntheticConversionRate) * 1.12).toFixed(2)}% conversion × ${syntheticAverageOrderValue} = 
                                    ${((parseFloat(syntheticMonthlyVisitors) * parseFloat(syntheticConversionRate) * 1.12 / 100 * parseFloat(syntheticAverageOrderValue))).toLocaleString()}
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
            )}
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
                value="4%"
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
            
            {/* REPLACEMENT: LCP Distribution Comparison Chart */}
            <Grid item xs={12}>
              <Card sx={{ mb: 4 }}>
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
                          domain={[500, 5500]}
                          ticks={[500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500]}
                          unit="ms"
                        >
                          <Label 
                            value="Load Time (milliseconds)" 
                            position="bottom" 
                            offset={30}
                          />
                        </XAxis>
                        <YAxis 
                          dataKey="percentile"
                          domain={[0, 100]}
                          tickFormatter={(value) => `${value}%`}
                          ticks={[0, 10, 20, 30, 40, 50, 60, 70, 75, 80, 90, 100]}
                          label={{ value: 'Percentile Distribution', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip formatter={(value, name) => {
                          if (name === 'lcp') return [`${typeof value === 'number' ? value.toFixed(0) : value}ms`, 'Load Time'];
                          if (name === 'percentile') return [`${value}%`, 'Percentile'];
                          return [value, name];
                        }} />
                        <Legend />
                        <Scatter 
                          name="Baseline" 
                          data={percentileData.nonClippoData}
                          fill="#808080"
                          line={{stroke: '#808080', strokeWidth: 2}}
                          lineJointType="monotone"
                          shape="circle"
                        />
                        <Scatter 
                          name="Clippo" 
                          data={percentileData.clippoData}
                          fill="#2e8b57"
                          line={{stroke: '#2e8b57', strokeWidth: 2}}
                          lineJointType="monotone"
                          shape="circle"
                        />
                        <ReferenceLine y={75} stroke="#000" strokeDasharray="3 3" label="P75" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    This chart shows the distribution of page load times across different percentiles of traffic.
                    With Clippo (green), the 75th percentile of page loads complete in approximately 2.3 seconds, whereas without Clippo (gray),
                    the 75th percentile loads take about 2.8 seconds. This significant improvement impacts all users
                    across the entire distribution, with even greater gains at the lower percentiles.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            {/* REPLACEMENT CHART 2: Clippo Sessions Distribution with Conversion Rate */}
            <Grid item xs={12}>
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Clippo: Sessions and Conversion Rate by Load Time
                  </Typography>
                  <Box sx={{ height: 400, mt: 2 }}>
                    <ResponsiveContainer>
                      <ComposedChart
                        data={histogramData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range">
                          <Label 
                            value="Load Time (seconds)" 
                            position="bottom" 
                            offset={20}
                          />
                        </XAxis>
                        <YAxis 
                          yAxisId="left"
                          label={{ value: 'Number of Sessions', angle: -90, position: 'insideLeft' }} 
                        />
                        <YAxis 
                          yAxisId="right" 
                          orientation="right"
                          domain={[0, 10]}
                          tickFormatter={(value) => `${value}%`}
                          label={{ value: 'Conversion Rate (%)', angle: 90, position: 'insideRight' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar 
                          yAxisId="left"
                          dataKey="clippoNonConverted" 
                          name="Non-Converted Sessions" 
                          fill="#ff9999"
                          stackId="a"
                        />
                        <Bar 
                          yAxisId="left"
                          dataKey="clippoConverted" 
                          name="Converted Sessions" 
                          fill="#82ca9d" 
                          stackId="a"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="clippoConversionRate"
                          name="Conversion Rate"
                          stroke="#2e8b57"
                          strokeWidth={3}
                          dot={{ r: 4 }}
                        />
                        <ReferenceLine 
                          yAxisId="right" 
                          y={averageRates.clippoAvgConversionRate} 
                          stroke="#2e8b57" 
                          strokeDasharray="3 3" 
                          label={{ value: `Avg: ${averageRates.clippoAvgConversionRate}%`, position: 'right', fill: '#2e8b57' }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    This chart combines session distribution (bars) with conversion rate (line) for Clippo-enabled sessions.
                    The stacked bars show converted (green) and non-converted (red) sessions, while the line tracks the 
                    conversion rate by load time. Note that for any given load time value, the conversion rate remains consistent
                    whether using Clippo or not. However, Clippo shifts the entire distribution toward faster load times,
                    where conversion rates are naturally higher, resulting in a higher overall average.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            {/* REPLACEMENT CHART 3: Non-Clippo Sessions Distribution with Conversion Rate */}
            <Grid item xs={12}>
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Baseline: Sessions and Conversion Rate by Load Time
                  </Typography>
                  <Box sx={{ height: 400, mt: 2 }}>
                    <ResponsiveContainer>
                      <ComposedChart
                        data={histogramData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range">
                          <Label 
                            value="Load Time (seconds)" 
                            position="bottom" 
                            offset={20}
                          />
                        </XAxis>
                        <YAxis 
                          yAxisId="left"
                          label={{ value: 'Number of Sessions', angle: -90, position: 'insideLeft' }} 
                        />
                        <YAxis 
                          yAxisId="right" 
                          orientation="right"
                          domain={[0, 10]}
                          tickFormatter={(value) => `${value}%`}
                          label={{ value: 'Conversion Rate (%)', angle: 90, position: 'insideRight' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar 
                          yAxisId="left"
                          dataKey="nonClippoNonConverted" 
                          name="Non-Converted Sessions" 
                          fill="#ff9999"
                          stackId="a"
                        />
                        <Bar 
                          yAxisId="left"
                          dataKey="nonClippoConverted" 
                          name="Converted Sessions" 
                          fill="#82ca9d" 
                          stackId="a"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="nonClippoConversionRate"
                          name="Conversion Rate"
                          stroke="#808080"
                          strokeWidth={3}
                          dot={{ r: 4 }}
                        />
                        <ReferenceLine 
                          yAxisId="right" 
                          y={averageRates.nonClippoAvgConversionRate} 
                          stroke="#808080" 
                          strokeDasharray="3 3" 
                          label={{ value: `Avg: ${averageRates.nonClippoAvgConversionRate}%`, position: 'right', fill: '#808080' }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    This chart combines session distribution (bars) with conversion rate (line) for baseline sessions without Clippo.
                    The conversion rate line is identical to the Clippo chart for the same load time values, confirming that Clippo
                    doesn't directly impact conversion rates for a given load time. However, without Clippo optimization, the session
                    distribution is shifted toward slower load times where conversion rates are naturally lower, resulting in a lower
                    overall average conversion rate compared to Clippo-enabled sessions.
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
                              value={realMonthlyVisitors}
                              onChange={(e) => setRealMonthlyVisitors(e.target.value)}
                              type="number"
                              fullWidth
                              variant="outlined"
                              size="small"
                              margin="normal"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              label="Clippo Conversion Rate (%)"
                              value={realConversionRate}
                              onChange={(e) => setRealConversionRate(e.target.value)}
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
                              value={realAverageOrderValue}
                              onChange={(e) => setRealAverageOrderValue(e.target.value)}
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
                        onClick={calculateRealRevenueBoost}
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
                          ${parseInt(realRevenueBoost).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Based on your actual conversion increase from implementing Clippo.
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="subtitle1">
                            How is this calculated?
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            The revenue boost is calculated by comparing your current performance with what it would have been without Clippo:
                          </Typography>
                          <Box sx={{ mt: 1, ml: 2 }}>
                            <Typography variant="body2" gutterBottom>
                              1. Original Conversion Rate (Before Clippo): 
                              <Box component="span" sx={{ fontWeight: 'bold', mx: 1 }}>
                                {realConversionRate}% ÷ 1.32 = {(parseFloat(realConversionRate) / 1.32).toFixed(2)}%
                              </Box>
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              2. Monthly Revenue Without Clippo: 
                              <Box component="span" sx={{ fontWeight: 'bold', mx: 1 }}>
                                {parseInt(realMonthlyVisitors).toLocaleString()} visits × {(parseFloat(realConversionRate) / 1.32).toFixed(2)}% conversion × ${realAverageOrderValue} = 
                                ${((parseFloat(realMonthlyVisitors) * (parseFloat(realConversionRate) / 1.32) / 100 * parseFloat(realAverageOrderValue))).toLocaleString()}
                              </Box>
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              3. Current Monthly Revenue with Clippo: 
                              <Box component="span" sx={{ fontWeight: 'bold', mx: 1 }}>
                                {parseInt(realMonthlyVisitors).toLocaleString()} visits × {realConversionRate}% conversion × ${realAverageOrderValue} = 
                                ${((parseFloat(realMonthlyVisitors) * parseFloat(realConversionRate) / 100 * parseFloat(realAverageOrderValue))).toLocaleString()}
                              </Box>
                            </Typography>
                            <Typography variant="body2" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                              4. Monthly Revenue Boost: 
                              <Box component="span" sx={{ mx: 1 }}>
                                ${parseInt(realRevenueBoost).toLocaleString()}
                              </Box>
                            </Typography>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
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
