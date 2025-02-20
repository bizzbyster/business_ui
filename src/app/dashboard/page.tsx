"use client";

import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Label,
} from "recharts";
import SpeedIcon from "@mui/icons-material/Speed";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getWebVitals } from "./actions";

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
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [distribution, setDistribution] = useState<any>([]);
  const [summary, setSummary] = useState<any>([]);
  const [webVitalsData, setWebVitalsData] = useState<any>([]);

  useEffect(() => {
    getWebVitals()
      .then(([distributionData, summaryData, webVitalsData]) => {
        setDistribution(distributionData);
        setSummary(summaryData);
        setWebVitalsData(webVitalsData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleStartBetaTrial = () => {
    const currentDomain = window.location.hostname;
    router.push(`/onboarding?domain=${currentDomain}`);
  };

  const withoutClippo = summary.find(
    (s: any) => s.experiment_variant === "without-clippo"
  );
  const withClippo = summary.find(
    (s: any) => s.experiment_variant === "with-clippo"
  );

  const improvementPercentage =
    withoutClippo && withClippo
      ? Math.abs(
          Math.round(
            ((withoutClippo.avg_lcp - withClippo.avg_lcp) /
              withoutClippo.avg_lcp) *
              100
          )
        )
      : 0;

  const quickStats = [
    {
      icon: SpeedIcon,
      title: "Current LCP",
      value: withoutClippo
        ? `${Math.round(withoutClippo.avg_lcp)}ms`
        : "Loading...",
      change: "↓ Needs Improvement",
      color: "warning.main",
      explanation: `Your current Largest Contentful Paint (LCP) at 75th percentile is ${withoutClippo?.p75_lcp}ms. According to Google's Core Web Vitals metrics, values below 2500ms are considered "good" for optimal user experience.`,
    },
    {
      icon: SpeedIcon,
      title: "Projected LCP",
      value: withClippo ? `${Math.round(withClippo.avg_lcp)}ms` : "Loading...",
      change: `↑ ${improvementPercentage}% Faster with Clippo`,
      color: "success.main",
      explanation: `Based on analysis of ${withClippo?.sample_size} samples, we project significant performance improvements through advanced caching and optimization.`,
    },
    {
      icon: TrendingUpIcon,
      title: "Conversion Impact",
      value: "+12%",
      change: "↑ Estimated Increase",
      color: "success.main",
      explanation: `Based on industry research showing 1% conversion improvement per 100ms speed increase, with ${improvementPercentage}% speed improvement we project significant conversion gains.`,
    },
    {
      icon: MonetizationOnIcon,
      title: "Revenue Boost",
      value: "$24.8k/mo",
      change: "↑ Potential Gain",
      color: "success.main",
      explanation:
        "Projected revenue increase based on estimated conversion improvements and current revenue baseline.",
    },
  ];

  const webVitalsFormatted = [
    {
      name: "LCP (Largest Contentful Paint)",
      withoutClippo: webVitalsData.find(
        (d: any) => d.experiment_variant === "without-clippo"
      )?.lcp,
      withClippo: webVitalsData.find(
        (d: any) => d.experiment_variant === "with-clippo"
      )?.lcp,
    },
    {
      name: "TTFB (Time to First Byte)",
      withoutClippo: webVitalsData.find(
        (d: any) => d.experiment_variant === "without-clippo"
      )?.ttfb,
      withClippo: webVitalsData.find(
        (d: any) => d.experiment_variant === "with-clippo"
      )?.ttfb,
    },
    {
      name: "FID (First Input Delay)",
      withoutClippo: webVitalsData.find(
        (d: any) => d.experiment_variant === "without-clippo"
      )?.fid,
      withClippo: webVitalsData.find(
        (d: any) => d.experiment_variant === "with-clippo"
      )?.fid,
    },
  ];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading performance data...</Typography>
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
          {user?.username || user?.firstName || "User"}&apos;s Performance
          Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleStartBetaTrial}
          sx={{
            backgroundColor: "#2e7d32",
            "&:hover": {
              backgroundColor: "#1b5e20",
            },
            textTransform: "none",
            fontWeight: 500,
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
                    margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      dataKey="lcp"
                      name="LCP"
                      unit="ms"
                      domain={[1000, 4000]}
                      ticks={[1000, 1500, 2000, 2500, 3000, 3500, 4000]}
                    >
                      <Label
                        value="Load Time (milliseconds)"
                        position="bottom"
                        offset={20}
                      />
                    </XAxis>
                    <YAxis
                      type="number"
                      dataKey="percentile"
                      name="percentile"
                      domain={[0, 5]}
                      tickFormatter={(value) => `${Math.round(value)}%`}
                      width={50}
                    />
                    <ReferenceLine y={75} stroke="#666" strokeDasharray="3 3" />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      formatter={(value: number, name: string) => {
                        if (name === "lcp")
                          return [`${Math.round(value)}ms`, "Load Time"];
                        if (name === "percentile")
                          return [`${value.toFixed(1)}%`, "Percentile"];
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Scatter
                      name="Without Clippo"
                      data={distribution
                        .filter(
                          (d: any) => d.experiment_variant === "without-clippo"
                        )
                        .map((d: any) => ({
                          lcp: d.lcp_value,
                          percentile: d.percentage,
                        }))}
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Scatter
                      name="With Clippo"
                      data={distribution
                        .filter(
                          (d: any) => d.experiment_variant === "with-clippo"
                        )
                        .map((d: any) => ({
                          lcp: d.lcp_value,
                          percentile: d.percentage,
                        }))}
                      fill="#82ca9d"
                      fillOpacity={0.6}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Each point represents a page load test, showing how quickly the
                largest content element appears on screen. Lower values indicate
                better performance.
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
              {webVitalsFormatted.map((vital) => (
                <Box key={vital.name} sx={{ my: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography>{vital.name}</Typography>
                    <Typography>Target: {vital.withClippo}ms</Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ mb: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(vital.withoutClippo / 4000) * 100}
                        sx={{
                          height: 8,
                          backgroundColor: "#eef0f2",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: "#8884d8",
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        Without Clippo: {vital.withoutClippo}ms
                      </Typography>
                    </Box>
                    <Box>
                      <LinearProgress
                        variant="determinate"
                        value={(vital.withClippo / 4000) * 100}
                        sx={{
                          height: 8,
                          backgroundColor: "#eef0f2",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: "#82ca9d",
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        With Clippo: {vital.withClippo}ms
                      </Typography>
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
