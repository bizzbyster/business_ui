// src/app/config.ts
export const dynamic = 'force-static'
export const runtime = 'edge'  // Use edge runtime for better performance
export const preferredRegion = 'auto'  // Let Vercel choose the best region
export const revalidate = 60  // Check for updates every minute

// Add caching headers with 1-minute cache
export async function generateMetadata() {
  return {
    other: {
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
    },
  }
}