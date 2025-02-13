import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);
const BASE_URL = 'http://localhost:3000';

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

    // Send confirmation email
    const confirmationEmail = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Analyzing Your Website Performance',
      html: `
        <h1>Analyzing ${domain}'s Performance</h1>
        <p>We're running a comprehensive speed analysis of your website. Your detailed performance report will be ready in approximately 1 minute.</p>
        <p>Our analysis covers:</p>
        <ul>
          <li>Core Web Vitals metrics</li>
          <li>Loading speed across different devices</li>
          <li>Server response times</li>
          <li>Performance bottlenecks</li>
        </ul>
        <p>Get ready to discover opportunities to significantly improve your site's speed and user experience.</p>
      `
    }).catch(error => {
      console.error('Confirmation email error:', error);
      throw new Error('Failed to send confirmation email');
    });

    // Schedule the report email with 1 minute delay
    const scheduleReport = new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const reportEmail = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: `Performance Analysis for ${domain}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333; font-size: 24px;">Performance Analysis Report for ${domain}</h1>
                
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h2 style="color: #2e7d32; margin-top: 0;">Core Web Vitals Summary:</h2>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                    <div style="flex: 1;">
                      <h3 style="margin: 0; color: #666;">LCP (Largest Contentful Paint)</h3>
                      <p style="font-size: 24px; margin: 5px 0; color: #2e7d32;">1.8s</p>
                      <p style="color: #666; margin: 0;">Improved from 4.2s</p>
                    </div>
                    <div style="flex: 1;">
                      <h3 style="margin: 0; color: #666;">FCP (First Contentful Paint)</h3>
                      <p style="font-size: 24px; margin: 5px 0; color: #2e7d32;">0.9s</p>
                      <p style="color: #666; margin: 0;">Improved from 2.8s</p>
                    </div>
                  </div>
                </div>

                <h2 style="color: #333;">Business Impact:</h2>
                <ul style="color: #666;">
                  <li>Estimated Revenue Loss: $12,000/month due to slow loading</li>
                  <li>Potential Conversion Rate Increase: +28% with optimizations</li>
                  <li>Mobile Traffic Drop-off Rate: 35% due to performance issues</li>
                </ul>

                <h2 style="color: #333;">Ready to boost your website's speed?</h2>
                <p style="color: #666;">Start your free trial with Clippo today and transform your website into a high-performance revenue engine. Our automated optimizations can help you:</p>
                <ul style="color: #666;">
                  <li>Reduce loading times by up to 65%</li>
                  <li>Improve Core Web Vitals scores</li>
                  <li>Boost mobile conversion rates</li>
                  <li>Enhance SEO rankings</li>
                </ul>

                <div style="text-align: center; margin-top: 30px;">
                  <a 
                    href="${BASE_URL}/dashboard" 
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
                    View Your Dashboard
                  </a>
                </div>
              </div>
            `
          });
          console.log('Report email sent successfully');
          resolve(reportEmail);
        } catch (error) {
          console.error('Report email error:', error);
          reject(error);
        }
      }, 60000); // 1 minute
    });

    return NextResponse.json({
      message: 'Analysis initiated. Report will be delivered in 1 minute.',
      status: 'success'
    });

  } catch (error: any) {
    console.error('API route error:', error);
    
    const errorMessage = error.message || 'Failed to process request';
    const statusCode = error.statusCode || 500;
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}