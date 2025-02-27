"use client";

import { Box, TextField, Button, Typography } from "@mui/material";
import { useUser } from "@clerk/nextjs";

export default function CompanyDetailsForm({
  onSubmit,
  onBack,
}: {
  onSubmit: (data: any) => void;
  onBack: () => void;
}) {
  const { user } = useUser();
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data = {
      companyName: formData.get("companyName"),
      teamEmails: formData.get("teamEmails"),
    };
    
    try {
      // Use unsafeMetadata for frontend updates
      if (user) {
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata, // Merge with existing data
            companyName: data.companyName,
            teamEmails: data.teamEmails,
            onboardingStep: 1
          }
        });
      }
      
      // Call original handler
      onSubmit(data);
    } catch (error) {
      console.error("Error updating user metadata:", error);
    }
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
        Name your organization
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
        Your organization is your dedicated workspace within our platform, where you can manage settings and customize your experience.
      </Typography>

      <TextField
        name="companyName"
        label="Organization Name"
        required
        fullWidth
        margin="normal"
        defaultValue={user?.unsafeMetadata?.companyName || ""}
      />

      <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
        Invite collaborators
      </Typography>
      <TextField
        name="teamEmails"
        label="Team Member Emails (up to 3, comma-separated)"
        fullWidth
        margin="normal"
        placeholder="colleague1@example.com, colleague2@example.com"
        defaultValue={user?.unsafeMetadata?.teamEmails || ""}
        helperText="Add up to 3 team members who will get dashboard access"
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