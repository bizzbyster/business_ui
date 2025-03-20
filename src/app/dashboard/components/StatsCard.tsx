import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface StatsCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  change: string;
  color: string;
  explanation: string;
}

export function StatsCard({
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
