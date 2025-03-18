import React from "react";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Label,
  Line,
  ComposedChart,
} from "recharts";
import { Box } from "@mui/material";
import { CustomTooltip } from "./CustomTooltip";

interface ConversionRateChartProps {
  data: any[];
  averageRate: number;
  title: string;
  dataKeyNonConverted: string;
  dataKeyConverted: string;
  dataKeyConversionRate: string;
  color: string;
}

export const ConversionRateChart: React.FC<ConversionRateChartProps> = ({
  data,
  averageRate,
  title,
  dataKeyNonConverted,
  dataKeyConverted,
  dataKeyConversionRate,
  color,
}) => {
  return (
    <Box sx={{ height: 400, mt: 2 }}>
      <ResponsiveContainer>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range">
            <Label value="Load Time (seconds)" position="bottom" offset={20} />
          </XAxis>
          <YAxis
            yAxisId="left"
            label={{
              value: "Number of Sessions",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 10]}
            tickFormatter={(value) => `${value}%`}
            label={{
              value: "Conversion Rate (%)",
              angle: 90,
              position: "insideRight",
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey={dataKeyNonConverted}
            name="Non-Converted Sessions"
            fill="#ff9999"
            stackId="a"
          />
          <Bar
            yAxisId="left"
            dataKey={dataKeyConverted}
            name="Converted Sessions"
            fill="#82ca9d"
            stackId="a"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey={dataKeyConversionRate}
            name="Conversion Rate"
            stroke={color}
            strokeWidth={3}
            dot={{ r: 4 }}
          />
          <ReferenceLine
            yAxisId="right"
            y={averageRate}
            stroke={color}
            strokeDasharray="3 3"
            label={{
              value: `Avg: ${averageRate}%`,
              position: "right",
              fill: color,
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
};
