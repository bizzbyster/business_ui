import React from "react";

interface DataPayload {
  dataKey: string;
  name: string;
  value: number;
  color: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: DataPayload[];
  label?: string;
}

export const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const conversionPayload = payload.find(
      (p) =>
        p.dataKey === "snappiConversionRate" ||
        p.dataKey === "nonSnappiConversionRate"
    );
    const sessionPayload = payload.filter(
      (p) =>
        p.dataKey !== "snappiConversionRate" &&
        p.dataKey !== "nonSnappiConversionRate"
    );

    return (
      <div
        style={{
          backgroundColor: "#fff",
          padding: "10px",
          border: "1px solid #ccc",
        }}
      >
        <p style={{ margin: 0 }}>{`Load Time: ${label}`}</p>
        {sessionPayload.map((entry, index) => (
          <p key={`session-${index}`} style={{ margin: 0, color: entry.color }}>
            {`${entry.name}: ${entry.value} sessions`}
          </p>
        ))}
        {conversionPayload && (
          <p
            style={{
              margin: "5px 0 0 0",
              fontWeight: "bold",
              color: conversionPayload.color,
            }}
          >
            {`Conversion Rate: ${Number(conversionPayload.value).toFixed(2)}%`}
          </p>
        )}
      </div>
    );
  }
  return null;
};
