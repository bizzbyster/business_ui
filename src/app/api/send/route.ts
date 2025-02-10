import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { domain, email } = await req.json();

    if (!domain || !email) {
      return NextResponse.json(
        { error: 'Domain and email are required' },
        { status: 400 }
      );
    }

    // Send immediate confirmation email
    try {
      const result = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Clippo Analysis Started',
        html: `
          <h1>We're analyzing ${domain}</h1>
          <p>Your innovation potential report will be ready in approximately 10 minutes.</p>
          <p>Discover how Clippo can transform your business strategy and unlock new opportunities.</p>
        `
      });
      console.log('Confirmation email result:', result);
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      throw emailError;
    }

    // Schedule the insights report
    setTimeout(async () => {
      try {
        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: email,
          subject: `Clippo Analysis for ${domain}`,
          html: `
            <h1>Innovation Report for ${domain}</h1>
            <h2>Key Insights:</h2>
            <ul>
              <li>Digital Transformation Score: 82/100</li>
              <li>Innovation Readiness: Advanced</li>
              <li>Market Opportunity Index: High</li>
              <li>Competitive Edge Rating: Strong</li>
              <li>Growth Potential: Exceptional</li>
            </ul>
            <h2>Ready to accelerate your growth?</h2>
            <p>Start your free trial with Clippo today and unlock your business's full potential with our cutting-edge solutions.</p>
            <a href="https://snappi.ai/sign-up" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px;">Start Free Trial</a>
          `
        });
        console.log('Innovation report sent successfully');
      } catch (error) {
        console.error('Error sending innovation report:', error);
      }
    }, 600000); // 10 minutes

    return NextResponse.json({
      message: 'Analysis initiated. Report will be delivered in 10 minutes.'
    });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}