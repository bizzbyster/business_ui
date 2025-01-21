"use client";

import { useEffect, useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Grid, LinearProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import StorageIcon from '@mui/icons-material/Storage';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import GroupIcon from '@mui/icons-material/Group';

export default function DashboardPage() {
  // Original LCP data
  const [lcpData, setLcpData] = useState(null);
  
  // Monthly Active Users data
  const userData = [
    { month: 'Jan', users: 12500 },
    { month: 'Feb', users: 13200 },
    { month: 'Mar', users: 14800 },
    { month: 'Apr', users: 15600 },
    { month: 'May', users: 16900 },
  ];

  // System Health Data
  const healthData = [
    { name: 'Server Uptime', value: 99.99 },
    { name: 'API Response', value: 98.5 },
    { name: 'Database', value: 99.95 },
    { name: 'CDN', value: 99.8 },
  ];

  // Resource Usage
  const resourceData = [
    { name: 'Storage', used: 75, total: 100 },
    { name: 'Memory', used: 60, total: 100 },
    { name: 'CPU', used: 45, total: 100 },
    { name: 'Bandwidth', used: 30, total: 100 },
  ];

  useEffect(() => {
    const sampleData = {
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
    setLcpData(sampleData);
  }, []);

  const combinedLcpData = lcpData?.variant_a.map((item, index) => ({
    date: item.date,
    "Variant A": item.lcp,
    "Variant B": lcpData.variant_b[index].lcp
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Container maxWidth="lg">
      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <GroupIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Active Users</Typography>
              </Box>
              <Typography variant="h4">16.9k</Typography>
              <Typography variant="body2" color="success.main">↑ 12% from last month</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SpeedIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Avg Response</Typography>
              </Box>
              <Typography variant="h4">142ms</Typography>
              <Typography variant="body2" color="success.main">↓ 8% improvement</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SecurityIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Security Score</Typography>
              </Box>
              <Typography variant="h4">98%</Typography>
              <Typography variant="body2" color="success.main">↑ 3% from audit</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StorageIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Storage Used</Typography>
              </Box>
              <Typography variant="h4">75%</Typography>
              <Typography variant="body2" color="warning.main">↑ Approaching limit</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Charts */}
      <Grid container spacing={3}>
        {/* LCP Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Test Results
              </Typography>
              <Box sx={{ height: 300 }}>
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
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* System Health */}
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

        {/* Resource Usage */}
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