'use client';

import { useEffect, useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Grid, LinearProgress, Button } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import SpeedIcon from '@mui/icons-material/Speed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import GroupIcon from '@mui/icons-material/Group';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface PerformanceDataPoint {
  date: string;
  syntheticLCP: number;
  realLCP: number;
  syntheticConversion: number;
  realConversion: number;
}

const sampleData: PerformanceDataPoint[] = [
  {
    date: '2024-01-01',
    syntheticLCP: 3.8,
    realLCP: 1.2,
    syntheticConversion: 2.1,
    realConversion: 4.8,
  },
  {
    date: '2024-01-02',
    syntheticLCP: 3.7,
    realLCP: 1.1,
    syntheticConversion: 2.2,
    realConversion: 5.2,
  },
];

const quickStats = [
  {
    icon: SpeedIcon,
    title: 'Avg LCP Improvement',
    value: '68%',
    change: '↑ With Clippo enabled',
    color: 'success.main'
  },
  {
    icon: TrendingUpIcon,
    title: 'Conversion Rate',
    value: '+31%',
    change: '↑ After optimization',
    color: 'success.main'
  },
  {
    icon: MonetizationOnIcon,
    title: 'Revenue Impact',
    value: '$24.8k',
    change: '↑ Additional MRR',
    color: 'success.main'
  },
  {
    icon: GroupIcon,
    title: 'Active Sessions',
    value: '8.4k',
    change: '↑ 45% more engaged',
    color: 'success.main'
  }
];

const webVitals = [
  { metric: 'LCP (Largest Contentful Paint)', baseline: 4.2, optimized: 1.8, target: 2.5, unit: 'seconds' },
  { metric: 'FCP (First Contentful Paint)', baseline: 2.8, optimized: 0.9, target: 1.8, unit: 'seconds' }
];

interface StatsCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  change: string;
  color: string;
}

function StatsCard({ icon: Icon, title, value, change, color }: StatsCardProps) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon sx={{ mr: 1, color }} />
          <Typography variant="h6">{title}</Typography>
        </Box>
        <Typography variant="h4">{value}</Typography>
        <Typography variant="body2" color={color}>
          {change}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [performanceData, setPerformanceData] = useState<PerformanceDataPoint[]>([]);
  const { user } = useUser();
  const router = useRouter();
  
  useEffect(() => {
    setPerformanceData(sampleData);
  }, []);

  const handleStartBetaTrial = () => {
    // Get current domain from window location
    const currentDomain = window.location.hostname;
    // Redirect to onboarding with domain parameter
    router.push(`/onboarding?domain=${currentDomain}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 500 }}>
          {user?.username || user?.firstName || "User"}&apos;s Performance Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleStartBetaTrial}
          sx={{
            backgroundColor: '#2e7d32',
            '&:hover': {
              backgroundColor: '#1b5e20',
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
                LCP vs Conversion Rate
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="syntheticLCP" 
                      stroke="#8884d8" 
                      name="Synthetic LCP"
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="realLCP" 
                      stroke="#82ca9d" 
                      name="Real-World LCP"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="realConversion" 
                      stroke="#ff7300" 
                      name="Conversion Rate"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Core Web Vitals Comparison
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={webVitals}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="baseline" name="Before Clippo" fill="#8884d8" />
                    <Bar dataKey="optimized" name="With Clippo" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Real-Time Monitoring Status
              </Typography>
              {webVitals.map((vital) => (
                <Box key={vital.metric} sx={{ my: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>{vital.metric}</Typography>
                    <Typography>
                      {vital.optimized} {vital.unit} / Target: {vital.target} {vital.unit}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(vital.optimized / vital.target) * 100}
                    color={vital.optimized <= vital.target ? "success" : "warning"}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}