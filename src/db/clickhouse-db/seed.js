import { DateTime } from "luxon";
import { clickhouse } from "./config.js";

function generateSampleData(numberOfRecords = 100) {
  // const environments = ["production", "staging"];
  // const releases = ["1.0.0", "1.0.1", "1.1.0", "1.2.0"];
  const experiments = ["with-clippo", "without-clippo"];

  const metrics = [];
  const resources = [];

  // Generate data for the last 30 days
  const now = DateTime.now();
  const thirtyDaysAgo = now.minus({ days: 30 });

  for (let i = 0; i < numberOfRecords; i++) {
    const session_id = globalThis.crypto.randomUUID();
    const timestamp = thirtyDaysAgo
      .plus({
        days: Math.floor(Math.random() * 30),
        hours: Math.floor(Math.random() * 24),
        minutes: Math.floor(Math.random() * 60),
      })
      .toISO();

    // Generate performance metrics
    const metric = {
      session_id,
      // release: releases[Math.floor(Math.random() * releases.length)],
      // environment:
      //   environments[Math.floor(Math.random() * environments.length)],
      experiment_id: "exp-001",
      experiment_variant:
        experiments[Math.floor(Math.random() * experiments.length)],
      timestamp,

      // Core Web Vitals (realistic values)
      lcp_value: 1000 + Math.random() * 3000, // 1-4s
      fid_value: 10 + Math.random() * 90, // 10-100ms
      cls_value: Math.random() * 0.2, // 0-0.2
      inp_value: 50 + Math.random() * 150, // 50-200ms

      // Navigation Timing
      ttfb: 100 + Math.random() * 400, // 100-500ms
      domain_lookup_time: 10 + Math.random() * 40, // 10-50ms
      connect_time: 20 + Math.random() * 80, // 20-100ms
      tls_time: 30 + Math.random() * 70, // 30-100ms

      // Resource info
      resource_count: Math.floor(5 + Math.random() * 20), // 5-25 resources
      total_resource_size: Math.floor(500000 + Math.random() * 1500000), // 500KB-2MB

      // Error count
      error_count: Math.floor(Math.random() * 3), // 0-2 errors
    };

    metrics.push(metric);

    // Generate resource timing entries
    const resourceTypes = ["script", "style", "image", "font"];
    const numResources = Math.floor(3 + Math.random() * 5); // 3-7 resources per session

    for (let j = 0; j < numResources; j++) {
      const resource = {
        session_id,
        timestamp,
        resource_url: `https://example.com/assets/${
          resourceTypes[j % resourceTypes.length]
        }/resource-${j}.${resourceTypes[j % resourceTypes.length]}`,
        resource_type: resourceTypes[j % resourceTypes.length],
        start_time: j * 100 + Math.random() * 50,
        duration: 50 + Math.random() * 200,
        transfer_size: Math.floor(10000 + Math.random() * 90000),
        encoded_size: Math.floor(8000 + Math.random() * 70000),
        decoded_size: Math.floor(15000 + Math.random() * 100000),
      };

      resources.push(resource);
    }
  }

  return {
    performance_metrics: metrics,
    resource_timing: resources,
  };
}

async function seedClickhouse() {
  try {
    console.log("Generating sample data...");
    const sampleData = generateSampleData(100);

    console.log("Inserting performance metrics...");
    await clickhouse.insert({
      table: "performance_metrics",
      values: sampleData.performance_metrics,
      format: "JSONEachRow",
    });
    console.log(
      `Inserted ${sampleData.performance_metrics.length} performance metrics records`
    );

    console.log("Inserting resource timing data...");
    await clickhouse.insert({
      table: "resource_timing",
      values: sampleData.resource_timing,
      format: "JSONEachRow",
    });
    console.log(
      `Inserted ${sampleData.resource_timing.length} resource timing records`
    );

    await clickhouse.close();
    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
    throw error;
  } finally {
    await clickhouse.close();
  }
}

// Execute the seeding
seedClickhouse()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to seed data:", error);
    process.exit(1);
  });

//  node --env-file=./.env.local src/db/clickhouse-db/seed.js
