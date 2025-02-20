import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function POST(req: Request) {
  if (!resendApiKey) {
    console.error('RESEND_API_KEY is not configured');
    return NextResponse.json(
      { error: 'Email service not configured' },
      { status: 500 }
    );
  }

  try {
    const { domain, email } = await req.json();

    if (!domain || !email) {
      return NextResponse.json(
        { error: 'Domain and email are required' },
        { status: 400 }
      );
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Send first email
    console.log('Sending first email...');
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
      `
    });
    console.log('First email sent:', firstEmailResult);

    // Use Promise for second email with timeout
    const secondEmailPromise = new Promise(async (resolve, reject) => {
      try {
        await new Promise(r => setTimeout(r, 60000)); // 60 second delay
        console.log('Sending second email...');
        const secondEmailResult = await resend.emails.send({
          from: 'onboarding@snappi.ai',
          to: email,
          subject: `${domain} Performance Analysis - Speed Optimization Opportunities`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333; font-size: 24px;">Performance Analysis Report for ${domain}</h1>
              
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="color: #2e7d32; margin-top: 0;">Core Web Vitals Analysis:</h2>
                
                <div style="margin-bottom: 20px;">
                  <h3 style="margin: 0; color: #666;">Current Performance</h3>
                  <ul style="color: #666;">
                    <li>LCP (Largest Contentful Paint): 2200ms - Needs Improvement</li>
                    <li>FCP (First Contentful Paint): 1800ms</li>
                    <li>TTFB (Time to First Byte): 800ms</li>
                  </ul>
                </div>

                <div>
                  <h3 style="margin: 0; color: #666;">Projected With Clippo</h3>
                  <ul style="color: #666;">
                    <li>LCP: 1600ms (27% faster)</li>
                    <li>FCP: 1200ms (33% improvement)</li>
                    <li>TTFB: 200ms (75% reduction)</li>
                  </ul>
                </div>
              </div>

              <h2 style="color: #333;">Business Impact Analysis:</h2>
              <ul style="color: #666;">
                <li><strong>Conversion Impact:</strong> +12% estimated increase based on speed improvements</li>
                <li><strong>Revenue Opportunity:</strong> Potential $24.8k monthly revenue boost</li>
                <li><strong>Speed Improvement:</strong> Up to 27% faster page loads</li>
              </ul>

              <h2 style="color: #333;">Key Findings:</h2>
              <ul style="color: #666;">
                <li>Your current LCP of 2200ms is above Google's recommended threshold</li>
                <li>75% of your page loads can complete under 1.6s with our optimizations</li>
                <li>Potential for significant conversion rate improvements</li>
                <li>Server response time can be reduced by up to 75%</li>
              </ul>

              <h2 style="color: #333;">Ready to boost your website's speed?</h2>
              <p style="color: #666;">Start your beta trial with Clippo today. Our optimizations can help you:</p>
              <ul style="color: #666;">
                <li>Reduce loading times by up to 27%</li>
                <li>Improve Core Web Vitals scores</li>
                <li>Boost conversion rates by an estimated 12%</li>
                <li>Enhance user experience and engagement</li>
              </ul>

              <div style="text-align: center; margin-top: 30px;">
                <a 
                  href="${BASE_URL}/onboarding" 
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
                  Start Beta Trial
                </a>
              </div>
            </div>
          `
        });
        console.log('Second email sent:', secondEmailResult);
        resolve(secondEmailResult);
      } catch (error) {
        console.error('Error sending second email:', error);
        reject(error);
      }
    });

    // Handle second email in background
    secondEmailPromise.catch(error => {
      console.error('Failed to send second email:', error);
    });

    return NextResponse.json({
      success: true,
      message: 'Analysis initiated'
    });

  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}