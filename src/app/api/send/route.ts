import { Resend } from "resend";
import { NextResponse } from "next/server";
import { createEntitiesForSyntheticTest } from "@/db/dynamo-db/queries";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const runtime = "edge";

export async function POST(req: Request) {
  if (!resendApiKey) {
    console.error("RESEND_API_KEY is not configured");
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 500 }
    );
  }

  try {
    const { domain, email } = await req.json();

    if (!domain || !email) {
      return NextResponse.json(
        { error: "Domain and email are required" },
        { status: 400 }
      );
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    try {
      await createEntitiesForSyntheticTest(domain, email);
    } catch (e) {
      console.error("error creating temp entities on dynamodb", e);
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 500 }
      );
    }

    /* Comment out first email
    // Send first email immediately
    const firstEmailResult = await resend.emails.send({
      from: 'onboarding@snappi.ai',
      to: email,
      subject: `Analyzing ${domain} - Initial Performance Check`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Analyzing ${domain}'s Performance</h1>
          <p>We're running a comprehensive speed analysis of your website. Your detailed performance report will be ready in approximately 1 minute.</p>
          
          <h2>Our analysis covers:</h2>
          <ul>
            <li>Core Web Vitals metrics (LCP, FCP, TTFB)</li>
            <li>Loading speed across different devices</li>
            <li>Server response times</li>
            <li>Performance bottlenecks and optimization opportunities</li>
            <li>Potential revenue impact of speed improvements</li>
          </ul>
          
          <p>Get ready to discover opportunities to significantly improve your site's speed and user experience.</p>
        </div>
      `,
    });
    */

    // Send detailed report immediately
    const reportEmailResult = await resend.emails.send({
      from: "onboarding@snappi.ai",
      to: email,
      subject: `${domain} Performance Analysis by Clippo`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; font-size: 24px;">Performance Analysis Report for ${domain}</h1>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #2e7d32; margin-top: 0;">Core Web Vitals Analysis:</h2>
            
            <div style="margin-bottom: 20px;">
              <h3 style="margin: 0; color: #555;">Current Performance</h3>
              <ul style="color: #555;">
                <li>LCP (Largest Contentful Paint): 2200ms - Needs Improvement</li>
                <li>FCP (First Contentful Paint): 1800ms</li>
                <li>TTFB (Time to First Byte): 800ms</li>
              </ul>
            </div>

            <div>
              <h3 style="margin: 0; color: #555;">Projected With Clippo</h3>
              <ul style="color: #555;">
                <li>LCP: 1600ms (27% faster)</li>
                <li>FCP: 1200ms (33% improvement)</li>
                <li>TTFB: 400ms (50% reduction)</li>
              </ul>
            </div>
          </div>

          <h2 style="color: #333;">Business Impact Analysis:</h2>
          <ul style="color: #555;">
            <li><strong>Conversion Impact:</strong> +12% estimated increase based on speed improvements</li>
            <li><strong>Speed Improvement:</strong> Up to 27% faster page loads</li>
            <li><strong>Revenue Opportunity:</strong> Better speeds mean more revenue!</li>
          </ul>

          <h2 style="color: #333;">Key Findings:</h2>
          <ul style="color: #555;">
            <li>75% of your page loads can complete under 1.6s with our optimizations</li>
            <li>Potential for significant conversion rate improvements</li>
            <li>Server response time can be reduced by up to 50%</li>
          </ul>

          <h2 style="color: #333;">Sounds too good to be true?</h2>
          <p style="color: #555;">Dive into the details, check out this dashboard we put together to display our full analysis on your site:</p>

          <div style="text-align: center; margin-top: 30px;">
            <a 
              href="${BASE_URL}/sign-up" 
              style="
                display: inline-block; 
                padding: 12px 24px; 
                background-color: #2e7d32; 
                color: white; 
                text-decoration: none; 
                border-radius: 4px;
                font-weight: 500;
              "
            >
              Visit Dashboard
            </a>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Analysis completed",
    });
  } catch (error: any) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
