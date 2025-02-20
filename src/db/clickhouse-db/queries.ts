import { clickhouse } from "./config";

export async function clickhousePing() {
  const res = await clickhouse.ping();
  console.dir(res, { depth: null });
}

export async function getLCPDistribution() {
  const query = `
    SELECT
      experiment_variant,
      lcp_value,
      count() * 100.0 / sum(count()) OVER (PARTITION BY experiment_variant) as percentage
    FROM performance_metrics
    WHERE experiment_variant IN ('with-clippo', 'without-clippo')
    GROUP BY experiment_variant, lcp_value
    ORDER BY experiment_variant, lcp_value
  `;

  const rows = await clickhouse.query({
    query,
    format: "JSONEachRow",
  });

  return await rows.json();
}

// For the summary metrics at the top
export async function getMetricsSummary() {
  const query = `
    SELECT
      experiment_variant,
      round(avg(lcp_value)) as avg_lcp,
      round(avg(ttfb)) as avg_ttfb,
      round(quantile(0.75)(lcp_value)) as p75_lcp,
      count() as sample_size
    FROM performance_metrics
    WHERE experiment_variant IN ('with-clippo', 'without-clippo')
    GROUP BY experiment_variant
  `;

  const rows = await clickhouse.query({
    query,
    format: "JSONEachRow",
  });

  return await rows.json();
}

// For the Core Web Vitals Summary
export async function getWebVitalsSummary() {
  const query = `
    SELECT
      experiment_variant,
      round(avg(lcp_value)) as lcp,
      round(avg(ttfb)) as ttfb,
      round(avg(fid_value)) as fid
    FROM performance_metrics
    WHERE experiment_variant IN ('with-clippo', 'without-clippo')
    GROUP BY experiment_variant
  `;

  const rows = await clickhouse.query({
    query,
    format: "JSONEachRow",
  });

  return await rows.json();
}
