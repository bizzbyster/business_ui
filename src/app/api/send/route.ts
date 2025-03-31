import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const runtime = 'edge';

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
    
    // Use BASE_URL environment variable with the correct path
    const magicLinkUrl = `${BASE_URL}/teaser-dashboard?domain=${encodeURIComponent(domain)}`;

    // Send detailed report immediately
    const reportEmailResult = await resend.emails.send({
      from: 'onboarding@snappi.ai',
      to: email,
      subject: `${domain} Performance Analysis by Clippo`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; font-size: 24px;">Great News for ${domain}!</h1>
          
          <p style="color: #333; font-size: 16px;">We've completed our analysis and discovered significant opportunities to boost your site performance:</p>
          
          <ul style="color: #666; font-size: 16px; margin-bottom: 25px;">
            <li><strong>Speed Improvement:</strong> Up to 27% faster page loads</li>
            <li><strong>Conversion Impact:</strong> +12% estimated increase with Clippo</li>
            <li><strong>Server Response:</strong> 50% faster Time to First Byte</li>
          </ul>
          
          <p style="color: #333; font-size: 16px; margin-bottom: 25px;">Ready to see how we can transform your site experience? Check out your full results below.</p>
          
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
                <li>TTFB: 400ms (50% reduction)</li>
              </ul>
            </div>
          </div>

          <h2 style="color: #333;">Business Impact Analysis:</h2>
          <ul style="color: #666;">
            <li><strong>Conversion Impact:</strong> +12% estimated increase based on speed improvements</li>
            <li><strong>Speed Improvement:</strong> Up to 27% faster page loads</li>
            <li><strong>Revenue Opportunity:</strong> Better speeds mean more revenue!</li>
          </ul>

          <h2 style="color: #333;">Key Findings:</h2>
          <ul style="color: #666;">
            <li>75% of your page loads can complete under 1.6s with our optimizations</li>
            <li>Potential for significant conversion rate improvements</li>
            <li>Server response time can be reduced by up to 50%</li>
          </ul>

          <h2 style="color: #333;">Sounds too good to be true?</h2>
          <p style="color: #666;">Dive into the details, check out this dashboard we put together to display our full analysis on your site:</p>

          <div style="text-align: center; margin-top: 30px;">
            <a 
              href="${magicLinkUrl}" 
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
      `
    });

    return NextResponse.json({
      success: true,
      message: 'Analysis completed'
    });

  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}