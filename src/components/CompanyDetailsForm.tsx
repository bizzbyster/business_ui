"use client";

import { Box, TextField, Button, Typography } from "@mui/material";

export default function CompanyDetailsForm({
  onSubmit,
  onBack,
}: {
  onSubmit: (data: any) => void;
  onBack: () => void;
}) {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data = {
      fullName: formData.get("fullName"),
      companyName: formData.get("companyName"),
      jobTitle: formData.get("jobTitle"),
      domain: formData.get("domain"),
    };
    onSubmit(data);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        maxWidth: "500px",
        p: 3,
        border: "1px solid #e0e0e0",
        borderRadius: 1,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Tell us about your company
      </Typography>

      <TextField
        name="fullName"
        label="Full Name"
        required
        fullWidth
        margin="normal"
      />

      <TextField
        name="companyName"
        label="Company Name"
        required
        fullWidth
        margin="normal"
      />

      <TextField
        name="jobTitle"
        label="Job Title"
        required
        fullWidth
        margin="normal"
      />

      <TextField
        name="domain"
        label="Website Domain"
        required
        fullWidth
        margin="normal"
        placeholder="example.com"
      />

      <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
        <Button onClick={onBack}>Back</Button>
        <Button type="submit" variant="contained" color="primary">
          Continue
        </Button>
      </Box>
    </Box>
  );
}
