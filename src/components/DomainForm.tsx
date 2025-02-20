"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import SpeedIcon from '@mui/icons-material/Speed';
import BarChartIcon from '@mui/icons-material/BarChart';

export default function DomainForm() {
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain, email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send analysis request");
      }

      setIsSubmitted(true);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 500, mb: 3 }}>
            Thank you for requesting your site evaluation!
          </Typography>
          <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
            You're one step closer to unlocking your site's full potential.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 500 }}>
            What Happens Next?
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
              <EmailIcon sx={{ color: 'primary.main', fontSize: 32 }} />
              <div>
                <Typography variant="h6" gutterBottom>
                  Initial Analysis Email (1 minute)
                </Typography>
                <Typography color="text.secondary">
                  You'll receive an email shortly with your site's current performance metrics 
                  and Core Web Vitals scores.
                </Typography>
              </div>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
              <SpeedIcon sx={{ color: 'primary.main', fontSize: 32 }} />
              <div>
                <Typography variant="h6" gutterBottom>
                  Detailed Performance Report
                </Typography>
                <Typography color="text.secondary">
                  A comprehensive analysis of your site's speed, including loading times, 
                  user experience metrics, and potential optimization opportunities.
                </Typography>
              </div>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
              <BarChartIcon sx={{ color: 'primary.main', fontSize: 32 }} />
              <div>
                <Typography variant="h6" gutterBottom>
                  Get Ready to Boost Conversions
                </Typography>
                <Typography color="text.secondary">
                  After reviewing your analysis, you'll have access to actionable insights 
                  to improve your site's performance and drive better business results.
                </Typography>
              </div>
            </Box>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Keep an eye on your inbox for your performance analysis.
              If you don't see it within a few minutes, please check your spam folder.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom align="center">
          Check if your site qualifies for beta
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Website Domain"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Your Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
            {error && (
              <Alert severity="error" sx={{ width: "100%" }}>
                {error}
              </Alert>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              size="large"
            >
              {isSubmitting ? "Processing..." : "Get Free Analysis in 1 min"}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
}
