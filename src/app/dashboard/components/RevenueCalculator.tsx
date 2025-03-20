import React from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { branding } from "@/config/branding";

interface RevenueCalculatorProps {
  type: "synthetic" | "real";
  monthlyVisitors: string;
  conversionRate: string;
  averageOrderValue: string;
  revenueBoost: string;
  showCalculations?: boolean;
  lcpImprovement: number;
  conversionIncrease: number;
  onChangeVisitors: (value: string) => void;
  onChangeConversionRate: (value: string) => void;
  onChangeAverageOrderValue: (value: string) => void;
  onCalculate: () => void;
}

export const RevenueCalculator: React.FC<RevenueCalculatorProps> = ({
  type,
  monthlyVisitors,
  conversionRate,
  averageOrderValue,
  revenueBoost,
  showCalculations = false,
  lcpImprovement,
  conversionIncrease,
  onChangeVisitors,
  onChangeConversionRate,
  onChangeAverageOrderValue,
  onCalculate,
}) => {
  const labelPrefix = type === "real" ? "" : "Current ";
  const conversionLabel =
    type === "real"
      ? "Snappi Conversion Rate (%)"
      : "Current Conversion Rate (%)";
  const description =
    type === "real"
      ? "Fine-tune your revenue boost calculation with your site metrics:"
      : "Enter your site metrics to estimate your potential revenue boost with Snappi:";

  // Helper function to safely parse and format numbers
  const safeParseFloat = (value: string) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Calculate values for display in explanations
  const currentRevenue =
    ((safeParseFloat(monthlyVisitors) * safeParseFloat(conversionRate)) / 100) *
    safeParseFloat(averageOrderValue);

  // For synthetic calculations
  const improvedConversionRate = safeParseFloat(conversionRate) * 1.12;
  const improvedRevenue =
    ((safeParseFloat(monthlyVisitors) * improvedConversionRate) / 100) *
    safeParseFloat(averageOrderValue);

  // For real calculations
  const originalConversionRate =
    safeParseFloat(conversionRate) / (1 + conversionIncrease / 100);
  const originalRevenue =
    ((safeParseFloat(monthlyVisitors) * originalConversionRate) / 100) *
    safeParseFloat(averageOrderValue);
  const actualRevenue =
    ((safeParseFloat(monthlyVisitors) * safeParseFloat(conversionRate)) / 100) *
    safeParseFloat(averageOrderValue);

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <CalculateIcon sx={{ mr: 1, color: branding.primaryColor }} />
          <Typography variant="h6">Revenue Boost Calculator</Typography>
        </Box>

        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {description}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label={`${labelPrefix}Monthly Visitors`}
                    value={monthlyVisitors}
                    onChange={(e) => onChangeVisitors(e.target.value)}
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
                    label={conversionLabel}
                    value={conversionRate}
                    onChange={(e) => onChangeConversionRate(e.target.value)}
                    type="number"
                    fullWidth
                    variant="outlined"
                    size="small"
                    margin="normal"
                    placeholder="e.g., 2.5"
                    InputProps={{
                      endAdornment: (
                        <Box component="span" sx={{ ml: 1 }}>
                          %
                        </Box>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Average Order Value ($)"
                    value={averageOrderValue}
                    onChange={(e) => onChangeAverageOrderValue(e.target.value)}
                    type="number"
                    fullWidth
                    variant="outlined"
                    size="small"
                    margin="normal"
                    placeholder="e.g., 85"
                    InputProps={{
                      startAdornment: (
                        <Box component="span" sx={{ mr: 1 }}>
                          $
                        </Box>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
            <Button
              variant="contained"
              onClick={onCalculate}
              sx={{
                backgroundColor: branding.primaryColor,
                "&:hover": {
                  backgroundColor: "#3570b3",
                },
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
                backgroundColor: "#f8f9fa",
                borderRadius: 2,
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography variant="h6" gutterBottom color="primary">
                Potential Monthly Revenue Boost
              </Typography>
              <Typography variant="h3" sx={{ mb: 1, color: "#2e7d32" }}>
                ${parseInt(revenueBoost).toLocaleString() || "0"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {type === "real"
                  ? `Based on your actual conversion increase from implementing Snappi.`
                  : `Based on a ${lcpImprovement}% conversion rate improvement with Snappi.`}
              </Typography>
            </Paper>
          </Grid>

          {showCalculations && type === "synthetic" && (
            <Grid item xs={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">
                    How is this calculated?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    The revenue boost is calculated based on our research that
                    shows a 12% increase in conversion rate from speed
                    improvements:
                  </Typography>
                  <Box sx={{ mt: 1, ml: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      1. Current Monthly Revenue:
                      <Box component="span" sx={{ fontWeight: "bold", mx: 1 }}>
                        {parseInt(monthlyVisitors).toLocaleString() || "0"}{" "}
                        visits × {conversionRate || "0"}% conversion × $
                        {averageOrderValue || "0"} = $
                        {currentRevenue.toLocaleString()}
                      </Box>
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      2. Expected Conversion Rate with Snappi:
                      <Box component="span" sx={{ fontWeight: "bold", mx: 1 }}>
                        {conversionRate || "0"}% × 1.12 ={" "}
                        {improvedConversionRate.toFixed(2)}%
                      </Box>
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      3. Expected Monthly Revenue with Snappi:
                      <Box component="span" sx={{ fontWeight: "bold", mx: 1 }}>
                        {parseInt(monthlyVisitors).toLocaleString() || "0"}{" "}
                        visits × {improvedConversionRate.toFixed(2)}% conversion
                        × ${averageOrderValue || "0"} = $
                        {improvedRevenue.toLocaleString()}
                      </Box>
                    </Typography>
                    <Typography
                      variant="body2"
                      gutterBottom
                      sx={{ color: "#2e7d32", fontWeight: "bold" }}
                    >
                      4. Monthly Revenue Boost:
                      <Box component="span" sx={{ mx: 1 }}>
                        ${parseInt(revenueBoost).toLocaleString() || "0"}
                      </Box>
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Grid>
          )}

          {type === "real" && (
            <Grid item xs={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">
                    How is this calculated?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    The revenue boost is calculated by comparing your current
                    performance with what it would have been without Snappi:
                  </Typography>
                  <Box sx={{ mt: 1, ml: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      1. Original Conversion Rate (Before Snappi):
                      <Box component="span" sx={{ fontWeight: "bold", mx: 1 }}>
                        {conversionRate || "0"}% ÷{" "}
                        {1 + conversionIncrease / 100} ={" "}
                        {originalConversionRate.toFixed(2)}%
                      </Box>
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      2. Monthly Revenue Without Snappi:
                      <Box component="span" sx={{ fontWeight: "bold", mx: 1 }}>
                        {parseInt(monthlyVisitors).toLocaleString() || "0"}{" "}
                        visits × {originalConversionRate.toFixed(2)}% conversion
                        × ${averageOrderValue || "0"} = $
                        {originalRevenue.toLocaleString()}
                      </Box>
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      3. Current Monthly Revenue with Snappi:
                      <Box component="span" sx={{ fontWeight: "bold", mx: 1 }}>
                        {parseInt(monthlyVisitors).toLocaleString() || "0"}{" "}
                        visits × {conversionRate || "0"}% conversion × $
                        {averageOrderValue || "0"} = $
                        {actualRevenue.toLocaleString()}
                      </Box>
                    </Typography>
                    <Typography
                      variant="body2"
                      gutterBottom
                      sx={{ color: "#2e7d32", fontWeight: "bold" }}
                    >
                      4. Monthly Revenue Boost with Snappi:
                      <Box component="span" sx={{ mx: 1 }}>
                        ${parseInt(revenueBoost).toLocaleString() || "0"}
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
  );
};
