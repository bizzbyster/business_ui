import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);
const BASE_URL = 'http://localhost:3000';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(req: Request, { waitUntil }: { waitUntil: (promise: Promise<any>) => void }) {
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

    // Send first email immediately
    await resend.emails.send({
      from: 'onboarding@snappi.ai',
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
    });

    // Schedule the delayed email using waitUntil
    waitUntil(
      (async () => {
        try {
          await delay(60000);
          await resend.emails.send({
            from: 'onboarding@snappi.ai',
            to: email,
            subject: `Performance Analysis for ${domain}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <!-- ... rest of the email HTML ... -->
              </div>
            `
          });
          console.log('Analysis report sent successfully');
        } catch (error) {
          console.error('Error sending second email:', error);
        }
      })()
    );

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