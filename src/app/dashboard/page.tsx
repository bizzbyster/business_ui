"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Tabs,
  Tab,
  Alert,
} from "@mui/material";
import SpeedIcon from "@mui/icons-material/Speed";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { branding } from "@/config/branding";
import { useDashboardContext } from "./context";

import { StatsCard } from "./components/StatsCard";
import { LcpDistributionChart } from "./components/LcpDistributionChart";
import { WebVitalsSection } from "./components/WebVitalsSection";
import { ConversionRateChart } from "./components/ConversionRateChart";
import { RevenueCalculator } from "./components/RevenueCalculator";

import {
  getWebVitals,
  createLogicalHistogramData,
} from "./utils/dashboardUtils";

// Constants for real-world metrics
const DAILY_VISITORS = 5850;
const IMPROVED_CONVERSION_RATE = 4;
const CONVERSION_INCREASE_PERCENT = 32;

export default function DashboardPage() {
  // Get data from context
  const { lcpDistribution, webVitalsSummary, syntheticQuickStats, domain } =
    useDashboardContext();

  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [dashboardTitle, setDashboardTitle] = useState("Performance Dashboard");
  const [tabValue, setTabValue] = useState(0);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isChartLoaded, setIsChartLoaded] = useState(false);

  // Get webVitals data
  const webVitals = getWebVitals(webVitalsSummary);

  // Revenue calculator states for synthetic data
  const [syntheticMonthlyVisitors, setSyntheticMonthlyVisitors] = useState("");
  const [syntheticConversionRate, setSyntheticConversionRate] = useState("");
  const [syntheticAverageOrderValue, setSyntheticAverageOrderValue] =
    useState("");
  const [syntheticRevenueBoost, setSyntheticRevenueBoost] = useState("0");
  const [showSyntheticCalculations, setShowSyntheticCalculations] =
    useState(false);

  // Revenue calculator states for real-world data
  const [realMonthlyVisitors, setRealMonthlyVisitors] = useState(
    (DAILY_VISITORS * 30).toString()
  );
  const [realConversionRate, setRealConversionRate] = useState(
    IMPROVED_CONVERSION_RATE.toString()
  );
  const [realAverageOrderValue, setRealAverageOrderValue] = useState("85");
  const [realRevenueBoost, setRealRevenueBoost] = useState("0");

  // LCP Distribution data
  const [histogramData, setHistogramData] = useState<Array<any>>([]);
  const [averageRates, setAverageRates] = useState<{
    snappiAvgConversionRate: number;
    nonSnappiAvgConversionRate: number;
  }>({ snappiAvgConversionRate: 0, nonSnappiAvgConversionRate: 0 });

  // Transform LCP data for charts - Updated for new interface
  const formattedLcpDistribution = {
    snappiData:
      lcpDistribution
        ?.filter((point) => point.run_type === "snappi")
        .map((point) => ({
          percentile: point.percentile * 100, // Convert from 0-1 to 0-100 if needed
          lcp: point.load_time,
        })) || [],
    nonSnappiData:
      lcpDistribution
        ?.filter((point) => point.run_type === "baseline")
        .map((point) => ({
          percentile: point.percentile * 100, // Convert from 0-1 to 0-100 if needed
          lcp: point.load_time,
        })) || [],
  };

  // Find the p75 values from the syntheticQuickStats
  const baselineP75 =
    syntheticQuickStats.find((item) => item.run_type === "baseline")
      ?.p75_load_time || 0;

  const snappiP75 =
    syntheticQuickStats.find((item) => item.run_type === "snappi")
      ?.p75_load_time || 0;

  // Calculate improvement percentage for the quick stats
  const p75Improvement = Math.round(
    ((baselineP75 - snappiP75) / baselineP75) * 100
  );

  // Estimate conversion impact - 1% improvement for every 100ms of LCP reduction
  const p75Difference = baselineP75 - snappiP75;
  const estimatedConversionImpact = Math.round(p75Difference / 100);

  // Create quick stats cards using the p75 data
  const quickStats = [
    {
      icon: SpeedIcon,
      title: "Current LCP",
      value: `${Math.round(baselineP75)}ms`,
      change: baselineP75 < 2500 ? "✓ Good" : "↓ Needs Improvement",
      color: baselineP75 < 2500 ? "#4caf50" : branding.secondaryColor,
      explanation: `Your current Largest Contentful Paint (LCP) at 75th percentile is ${Math.round(
        baselineP75
      )}ms. This means 75% of your page loads complete their main content render within this time. An LCP under 2500ms is considered "good" by Google, but every millisecond counts and can affect business metrics.`,
    },
    {
      icon: SpeedIcon,
      title: "Projected LCP",
      value: `${Math.round(snappiP75)}ms`,
      change: `↑ ${p75Improvement}% Faster with Snappi`,
      color: branding.primaryColor,
      explanation: `Based on our tests and real-world data, Snappi reduces your LCP to approximately ${Math.round(
        snappiP75
      )}ms at the 75th percentile. This ${p75Improvement}% improvement is achieved through advanced caching, optimized resource loading, and efficient content delivery.`,
    },
    {
      icon: TrendingUpIcon,
      title: "Conversion Impact",
      value: `+${estimatedConversionImpact}%`,
      change: "↑ Estimated Increase",
      color: branding.primaryColor,
      explanation: `Research shows that faster load times directly correlate with improved conversion rates. Based on the projected ${p75Improvement}% speed improvement, and considering industry benchmarks where a 100ms decrease in load time can improve conversion rates by 1%, we estimate a potential ${estimatedConversionImpact}% increase in your conversion rate.`,
    },
  ];

  // Generate histogram data for conversion charts
  useEffect(() => {
    const { histogramData, averages } = createLogicalHistogramData();
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
      const improvedRevenue =
        visitors * (improvedConversion / 100) * orderValue;

      // Calculate boost
      const boost = improvedRevenue - currentRevenue;
      setSyntheticRevenueBoost(boost.toFixed(0));
      setShowSyntheticCalculations(true);
    }
  }, [
    syntheticMonthlyVisitors,
    syntheticConversionRate,
    syntheticAverageOrderValue,
  ]);

  // Calculate revenue boost for real-world data
  const calculateRealRevenueBoost = useCallback(() => {
    const visitors = parseFloat(realMonthlyVisitors);
    const currentConversion = parseFloat(realConversionRate);
    const orderValue = parseFloat(realAverageOrderValue);

    if (!isNaN(visitors) && !isNaN(currentConversion) && !isNaN(orderValue)) {
      // Calculate original conversion rate (before Snappi)
      // If current rate is 4.44% and it increased by 32%, then original was:
      // Original = Current / (1 + Increase%)
      const originalConversionRate =
        currentConversion / (1 + CONVERSION_INCREASE_PERCENT / 100);

      // Calculate monthly revenue with original and improved conversion rates
      const originalRevenue =
        visitors * (originalConversionRate / 100) * orderValue;
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
      if (domain) {
        setDashboardTitle(`${domain}'s Performance Dashboard`);
      }
      // Second priority: Use user's name
      else if (user.fullName) {
        setDashboardTitle(`${user.fullName}'s Performance Dashboard`);
      } else if (user.firstName) {
        setDashboardTitle(`${user.firstName}'s Performance Dashboard`);
      } else if (user.username) {
        setDashboardTitle(`${user.username}'s Performance Dashboard`);
      }
      // Default title is already set

      // Check if user has completed onboarding
      if (user.unsafeMetadata?.termsAccepted === true) {
        setHasCompletedOnboarding(true);
      }
    }
  }, [user, isLoaded, domain]);

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
    if (typeof window !== "undefined") {
      const currentDomain = window.location.hostname;
      router.push(`/onboarding?domain=${currentDomain}`);
    } else {
      router.push("/onboarding");
    }
  };

  if (
    !isChartLoaded ||
    !isLoaded ||
    !lcpDistribution ||
    !webVitalsSummary ||
    !syntheticQuickStats
  ) {
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
              "&:hover": {
                backgroundColor: "#3570b3",
              },
              textTransform: "none",
              fontWeight: 500,
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
                  <LcpDistributionChart
                    formattedLcpDistribution={formattedLcpDistribution}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    Each point represents a page load test, showing how quickly
                    the largest content element (like a hero image or headline)
                    appears on screen. The distribution demonstrates that with
                    Snappi, 75% of your page loads complete the main content
                    render in under {Math.round(snappiP75)}
                    ms - faster than the baseline {Math.round(baselineP75)}
                    ms. This improvement directly impacts user experience and
                    engagement, as visitors see your key content sooner.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <WebVitalsSection webVitals={webVitals} />
            </Grid>

            {/* Revenue Boost Calculator for Synthetic Data - Only show if NOT completed onboarding */}
            {!hasCompletedOnboarding && (
              <Grid item xs={12}>
                <RevenueCalculator
                  type="synthetic"
                  monthlyVisitors={syntheticMonthlyVisitors}
                  conversionRate={syntheticConversionRate}
                  averageOrderValue={syntheticAverageOrderValue}
                  revenueBoost={syntheticRevenueBoost}
                  showCalculations={showSyntheticCalculations}
                  lcpImprovement={p75Improvement}
                  conversionIncrease={12} // 12% is the default conversion increase for synthetic
                  onChangeVisitors={(value) =>
                    setSyntheticMonthlyVisitors(value)
                  }
                  onChangeConversionRate={(value) =>
                    setSyntheticConversionRate(value)
                  }
                  onChangeAverageOrderValue={(value) =>
                    setSyntheticAverageOrderValue(value)
                  }
                  onCalculate={calculateSyntheticRevenueBoost}
                />
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
                change="↑ 39% from Before Snappi"
                color={branding.primaryColor}
                explanation="The current average daily visitors to your site. This metric has seen a 39% increase since implementing Snappi, as improved performance leads to better search engine rankings and user satisfaction."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatsCard
                icon={TrendingUpIcon}
                title="Conversion Rate"
                value="4%"
                change="↑ 32% from Before Snappi"
                color={branding.primaryColor}
                explanation="Your site's current conversion rate. This has increased by 32% since implementing Snappi, as faster load times lead to lower abandonment and higher engagement throughout the customer journey."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatsCard
                icon={SpeedIcon}
                title="Bounce Rate"
                value="34%"
                change="↓ 14% from Before Snappi"
                color={branding.primaryColor}
                explanation="Your site's current bounce rate. This has decreased by 14% since implementing Snappi, as users are more likely to engage with your site when it loads quickly and responds to their interactions promptly."
              />
            </Grid>

            {/* LCP Distribution Chart */}
            <Grid item xs={12}>
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    LCP Distribution Comparison
                  </Typography>
                  <LcpDistributionChart
                    formattedLcpDistribution={formattedLcpDistribution}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    This chart shows the distribution of page load times across
                    different percentiles of traffic. With Snappi (green), the
                    75th percentile of page loads complete in approximately{" "}
                    {Math.round(snappiP75)}
                    milliseconds, whereas without Snappi (gray), the 75th
                    percentile loads take about {Math.round(baselineP75)}{" "}
                    milliseconds. This significant improvement impacts all users
                    across the entire distribution, with even greater gains at
                    the lower percentiles.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Snappi Conversion Rate Chart */}
            <Grid item xs={12}>
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Snappi: Sessions and Conversion Rate by Load Time
                  </Typography>
                  <ConversionRateChart
                    data={histogramData}
                    averageRate={averageRates.snappiAvgConversionRate}
                    title="Snappi: Sessions and Conversion Rate by Load Time"
                    dataKeyNonConverted="snappiNonConverted"
                    dataKeyConverted="snappiConverted"
                    dataKeyConversionRate="snappiConversionRate"
                    color="#2e8b57"
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    This chart combines session distribution (bars) with
                    conversion rate (line) for Snappi-enabled sessions. The
                    stacked bars show converted (green) and non-converted (red)
                    sessions, while the line tracks the conversion rate by load
                    time. Note that for any given load time value, the
                    conversion rate remains consistent whether using Snappi or
                    not. However, Snappi shifts the entire distribution toward
                    faster load times, where conversion rates are naturally
                    higher, resulting in a higher overall average.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Baseline Conversion Rate Chart */}
            <Grid item xs={12}>
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Baseline (Without Snappi): Sessions and Conversion Rate by
                    Load Time
                  </Typography>
                  <ConversionRateChart
                    data={histogramData}
                    averageRate={averageRates.nonSnappiAvgConversionRate}
                    title="Baseline: Sessions and Conversion Rate by Load Time"
                    dataKeyNonConverted="nonSnappiNonConverted"
                    dataKeyConverted="nonSnappiConverted"
                    dataKeyConversionRate="nonSnappiConversionRate"
                    color="#808080"
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    This chart combines session distribution (bars) with
                    conversion rate (line) for baseline sessions without Snappi.
                    The conversion rate line is identical to the Snappi chart
                    for the same load time values, confirming that Snappi
                    doesn't directly impact conversion rates for a given load
                    time. However, without Snappi optimization, the session
                    distribution is shifted toward slower load times where
                    conversion rates are naturally lower, resulting in a lower
                    overall average conversion rate compared to Snappi-enabled
                    sessions.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Revenue Calculator */}
            <Grid item xs={12}>
              <RevenueCalculator
                type="real"
                monthlyVisitors={realMonthlyVisitors}
                conversionRate={realConversionRate}
                averageOrderValue={realAverageOrderValue}
                revenueBoost={realRevenueBoost}
                lcpImprovement={p75Improvement}
                conversionIncrease={CONVERSION_INCREASE_PERCENT}
                onChangeVisitors={(value) => setRealMonthlyVisitors(value)}
                onChangeConversionRate={(value) => setRealConversionRate(value)}
                onChangeAverageOrderValue={(value) =>
                  setRealAverageOrderValue(value)
                }
                onCalculate={calculateRealRevenueBoost}
              />
            </Grid>
          </Grid>
        </>
      )}

      {tabValue === 1 && !hasCompletedOnboarding && (
        <Box sx={{ mt: 3 }}>
          <Alert
            severity="info"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={handleStartBetaTrial}
              >
                Start Now
              </Button>
            }
          >
            Real-world data will be available after you complete the beta
            onboarding process.
          </Alert>
        </Box>
      )}
    </Container>
  );
}
