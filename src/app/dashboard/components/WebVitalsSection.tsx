import React from "react";
import { Typography, Box, Card, CardContent } from "@mui/material";
import { branding } from "@/config/branding";

interface WebVitalProps {
  metric: string;
  baseline: number;
  optimized: number;
  target: number;
  unit: string;
}

interface WebVitalsSectionProps {
  webVitals: WebVitalProps[];
}

export const WebVitalsSection: React.FC<WebVitalsSectionProps> = ({
  webVitals,
}) => {
  // Find the maximum value to use as the scale reference for all progress bars
  const maxValue = Math.max(
    ...webVitals.flatMap((v) => [v.baseline, v.optimized, v.target]),
    6000 // Ensure we have a good scale for all metrics
  );

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Core Web Vitals Summary
        </Typography>
        {webVitals.map((vital) => {
          // Calculate percentages for the progress bars
          const baselineWidth = (vital.baseline / maxValue) * 100;
          const optimizedWidth = (vital.optimized / maxValue) * 100;

          return (
            <Box key={vital.metric} sx={{ my: 3 }}>
              <Typography sx={{ mb: 1 }}>{vital.metric}</Typography>

              {/* Without Snappi bar - Baseline */}
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    height: 8,
                    width: "100%",
                    backgroundColor: "#eef0f2",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      height: "100%",
                      width: `${baselineWidth}%`,
                      backgroundColor: branding.secondaryColor,
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 0.5,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Without Snappi
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {vital.baseline} {vital.unit}
                  </Typography>
                </Box>
              </Box>

              {/* With Snappi bar - Optimized */}
              <Box>
                <Box
                  sx={{
                    height: 8,
                    width: "100%",
                    backgroundColor: "#eef0f2",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      height: "100%",
                      width: `${optimizedWidth}%`,
                      backgroundColor: branding.primaryColor,
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 0.5,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    With Snappi
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {vital.optimized} {vital.unit}
                  </Typography>
                </Box>
              </Box>
            </Box>
          );
        })}
      </CardContent>
    </Card>
  );
};
