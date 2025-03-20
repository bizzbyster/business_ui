import { clickhouse } from "./config";

export type RunType = "baseline" | "snappi";

export interface LCPDistribution {
  run_type: RunType;
  load_time: number;
  percentile: number;
}

export interface WebVitalsSummary {
  runType: RunType;
  avg_fcp: number;
  avg_lcp: number;
  avg_ttfb: number;
  samples: string;
}

export interface SyntheticQuickStat {
  run_type: RunType;
  p75_load_time: number;
}

export async function clickhousePing() {
  const res = await clickhouse.ping();
  console.dir(res, { depth: null });
}

export async function getLCPDistribution(domain: string) {
  const query = `
    WITH 
    metrics AS (
      SELECT 
        runType as run_type,
        lcp AS load_time
      FROM web_performance_metrics
      WHERE lcp IS NOT NULL
        AND lcp > 0  -- Exclude zero values
        AND run_type IN ('snappi', 'baseline')
        AND domain LIKE {domain: String}
    ),
    percentiles AS (
      SELECT
        run_type,
        load_time,
        count(*) OVER (PARTITION BY run_type ORDER BY load_time) / 
        count(*) OVER (PARTITION BY run_type) AS percentile
      FROM metrics
      ORDER BY run_type, load_time
    )
    SELECT
      run_type,
      load_time,
      percentile
    FROM percentiles
    ORDER BY run_type, load_time;
  `;
  const rows = await clickhouse.query({
    query,
    format: "JSONEachRow",
    query_params: { domain: `%${domain}%` },
  });

  return await rows.json<LCPDistribution>();
}

// For the Core Web Vitals Summary
export async function getWebVitalsSummary(domain: string) {
  const query = `
    SELECT 
    runType,
    round(median(fcp), 0) AS avg_fcp,
    round(median(lcp), 0) AS avg_lcp,
    round(median(ttfb), 0) AS avg_ttfb,
    count() AS samples
    FROM web_performance_metrics
    WHERE domain LIKE {domain: String}
    AND session_start_date >= today() - 7
    GROUP BY runType
    ORDER BY runType;`;
  const rows = await clickhouse.query({
    query,
    format: "JSONEachRow",
    query_params: { domain: `%${domain}%` },
  });
  return await rows.json<WebVitalsSummary>();
}

export async function getSyntheticQuickStats(domain: string) {
  const query = `
    WITH 
    metrics AS (
      SELECT 
        runType AS run_type,
        lcp AS load_time
      FROM web_performance_metrics
      WHERE domain LIKE {domain: String}
        AND session_start_date >= today() - 14
        AND lcp > 0
    )
    SELECT
      run_type,
      quantile(0.75)(load_time) AS p75_load_time
    FROM metrics
    GROUP BY run_type`;
  const rows = await clickhouse.query({
    query,
    format: "JSONEachRow",
    query_params: { domain: `%${domain}%` },
  });
  return await rows.json<SyntheticQuickStat>();
}
