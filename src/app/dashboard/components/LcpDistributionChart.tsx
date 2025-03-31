import React from "react";
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
import { Box } from "@mui/material";
import { branding } from "@/config/branding";

interface LcpDistributionChartProps {
  formattedLcpDistribution: {
    snappiData: Array<{ percentile: number; lcp: number }>;
    nonSnappiData: Array<{ percentile: number; lcp: number }>;
  };
}

export const LcpDistributionChart: React.FC<LcpDistributionChartProps> = ({
  formattedLcpDistribution,
}) => {
  return (
    <Box sx={{ height: 400, mt: 2 }}>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="lcp"
            name="LCP"
            unit="ms"
            domain={["auto"]}
          >
            <Label
              value="Load Time (milliseconds)"
              position="bottom"
              offset={30}
            />
          </XAxis>
          <YAxis
            type="number"
            dataKey="percentile"
            name="percentile"
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            width={50}
          >
            <Label
              value="Percentile Distribution"
              position="left"
              angle={-90}
              offset={40}
              style={{ textAnchor: "middle" }}
            />
          </YAxis>

          <ReferenceLine y={75} stroke="#555" strokeDasharray="3 3" />

          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            formatter={(value: number, name: string) => {
              if (name === "lcp") return [`${value.toFixed(0)}ms`, "Load Time"];
              if (name === "percentile")
                return [`${value.toFixed(1)}%`, "Percentile"];
              return [value, name];
            }}
          />
          <Legend verticalAlign="bottom" height={36} />

          <Scatter
            name="With Snappi"
            data={formattedLcpDistribution.snappiData}
            fill={branding.primaryColor}
            fillOpacity={0.6}
            line={{ stroke: branding.primaryColor }}
            lineJointType="monotone"
          />
          <Scatter
            name="Without Snappi"
            data={formattedLcpDistribution.nonSnappiData}
            fill={branding.secondaryColor}
            fillOpacity={0.6}
            line={{ stroke: branding.secondaryColor }}
            lineJointType="monotone"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </Box>
  );
};
