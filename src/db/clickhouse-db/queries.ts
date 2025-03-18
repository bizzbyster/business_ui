import { clickhouse } from "./config";

export interface LCPDistribution {
  percentile: number;
  baseline_lcp: number;
  snappi_lcp: number;
}

export interface WebVitalsSummary {
  runType: "baseline" | "snappi";
  avg_fcp: number;
  avg_lcp: number;
  avg_ttfb: number;
  samples: string;
}

export async function clickhousePing() {
  const res = await clickhouse.ping();
  console.dir(res, { depth: null });
}

export async function getLCPDistribution() {
  const query = `
    WITH lcp_stats AS (
    SELECT
        runType,
        min(CASE WHEN lcp > 0 THEN toInt32(lcp) END) AS min_lcp,
        max(toInt32(lcp)) AS max_lcp,
        quantilesExact(0.25, 0.5, 0.75, 0.9, 0.95)(toInt32(lcp)) AS lcp_quantiles
    FROM web_performance_metrics
    WHERE domain = 'timex.com'
      AND session_start_date >= today() - 14
      AND lcp > 0
    GROUP BY runType
),
formatted_stats AS (
    SELECT
        runType,
        0 AS percentile,
        min_lcp AS value
    FROM lcp_stats
    UNION ALL
    SELECT
        runType,
        25 AS percentile,
        lcp_quantiles[1] AS value
    FROM lcp_stats
    UNION ALL
    SELECT
        runType,
        50 AS percentile,
        lcp_quantiles[2] AS value
    FROM lcp_stats
    UNION ALL
    SELECT
        runType,
        75 AS percentile,
        lcp_quantiles[3] AS value
    FROM lcp_stats
    UNION ALL
    SELECT
        runType,
        90 AS percentile,
        lcp_quantiles[4] AS value
    FROM lcp_stats
    UNION ALL
    SELECT
        runType,
        95 AS percentile,
        lcp_quantiles[5] AS value
    FROM lcp_stats
    UNION ALL
    SELECT
        runType,
        100 AS percentile,
        max_lcp AS value
    FROM lcp_stats
)
SELECT
    f1.percentile,
    maxIf(f1.value, f1.runType = 'baseline') AS baseline_lcp,
    maxIf(f1.value, f1.runType = 'snappi') AS snappi_lcp
FROM formatted_stats f1
GROUP BY percentile
ORDER BY percentile;
  `;
  const rows = await clickhouse.query({
    query,
    format: "JSONEachRow",
  });

  return await rows.json<LCPDistribution>();
}

// For the Core Web Vitals Summary
export async function getWebVitalsSummary() {
  const query = `
    SELECT 
    runType,
    round(avg(fcp), 0) AS avg_fcp,
    round(avg(lcp), 0) AS avg_lcp,
    round(avg(ttfb), 0) AS avg_ttfb,
    count() AS samples
    FROM web_performance_metrics
    WHERE domain = 'timex.com'
    AND session_start_date >= today() - 7
    GROUP BY runType
    ORDER BY runType;`;
  const rows = await clickhouse.query({
    query,
    format: "JSONEachRow",
  });
  return await rows.json<WebVitalsSummary>();
}
