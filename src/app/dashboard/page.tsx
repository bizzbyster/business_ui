'use client';

import { useEffect, useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Grid, LinearProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StorageIcon from '@mui/icons-material/Storage';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import GroupIcon from '@mui/icons-material/Group';
import { useUser } from "@clerk/nextjs"; // Added this import

// Move data interfaces and static data outside component
interface LCPDataPoint {
  date: string;
  lcp: number;
}

interface LCPData {
  variant_a: LCPDataPoint[];
  variant_b: LCPDataPoint[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const healthData = [
  { name: 'Server Uptime', value: 99.99 },
  { name: 'API Response', value: 98.5 },
  { name: 'Database', value: 99.95 },
  { name: 'CDN', value: 99.8 },
];

const resourceData = [
  { name: 'Storage', used: 75, total: 100 },
  { name: 'Memory', used: 60, total: 100 },
  { name: 'CPU', used: 45, total: 100 },
  { name: 'Bandwidth', used: 30, total: 100 },
];

const sampleLCPData: LCPData = {
  variant_a: [
    {date: "2024-01-01", lcp: 2.1},
    {date: "2024-01-02", lcp: 2.3},
    {date: "2024-01-03", lcp: 1.9},
    {date: "2024-01-04", lcp: 2.0},
    {date: "2024-01-05", lcp: 1.8},
    {date: "2024-01-06", lcp: 1.7},
    {date: "2024-01-07", lcp: 1.6}
  ],
  variant_b: [
    {date: "2024-01-01", lcp: 1.8},
    {date: "2024-01-02", lcp: 1.7},
    {date: "2024-01-03", lcp: 1.6},
    {date: "2024-01-04", lcp: 1.5},
    {date: "2024-01-05", lcp: 1.4},
    {date: "2024-01-06", lcp: 1.3},
    {date: "2024-01-07", lcp: 1.2}
  ]
};

function StatsCard({ icon: Icon, title, value, change }: { 
  icon: any, 
  title: string, 
  value: string, 
  change: string 
}) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">{title}</Typography>
        </Box>
        <Typography variant="h4">{value}</Typography>
        <Typography variant="body2" color={change.includes('↑') ? "success.main" : "warning.main"}>
          {change}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [lcpData, setLcpData] = useState<LCPData | null>(null);
  const { user } = useUser(); // Added this line

  useEffect(() => {
    // Simulate data fetch
    setLcpData(sampleLCPData);
  }, []);

  const combinedLcpData = lcpData?.variant_a.map((item, index) => ({
    date: item.date,
    "Variant A": item.lcp,
    "Variant B": lcpData.variant_b[index].lcp
  }));

  return (
    <Container maxWidth="lg">
      {/* Added username title */}
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          mb: 4,
          fontWeight: 500,
          px: 0,
          py: 2
        }}
      >
        {user?.username || user?.firstName || 'User'}'s Monitoring
      </Typography>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
        <Grid item xs={12} md={3}>
          <StatsCard 
            icon={GroupIcon}
            title="Active Users"
            value="16.9k"
            change="↑ 12% from last month"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatsCard 
            icon={SpeedIcon}
            title="Avg Response"
            value="142ms"
            change="↓ 8% improvement"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatsCard 
            icon={SecurityIcon}
            title="Security Score"
            value="98%"
            change="↑ 3% from audit"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatsCard 
            icon={StorageIcon}
            title="Storage Used"
            value="75%"
            change="↑ Approaching limit"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Test Results
              </Typography>
              <Box sx={{ height: 300 }}>
                {combinedLcpData && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={combinedLcpData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis label={{ value: 'Seconds', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Variant A" stroke="#8884d8" />
                      <Line type="monotone" dataKey="Variant B" stroke="#82ca9e" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Health
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={healthData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {healthData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resource Usage
              </Typography>
              {resourceData.map((resource) => (
                <Box key={resource.name} sx={{ my: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{resource.name}</Typography>
                    <Typography variant="body2">{resource.used}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={resource.used} 
                    color={resource.used > 80 ? "error" : resource.used > 60 ? "warning" : "primary"}
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