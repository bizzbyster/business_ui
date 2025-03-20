import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');
    const domain = searchParams.get('domain');
    const email = searchParams.get('email');
    
    console.log("Magic link handler called with domain:", domain, "email:", email);
    
    if (!domain) {
      console.log("Missing domain parameter");
      return NextResponse.json(
        { error: 'Missing domain parameter' },
        { status: 400 }
      );
    }
    
    // For the demo, redirect to an intermediate page that can handle auth and domain capture
    const targetUrl = `/domain-handler?domain=${encodeURIComponent(domain)}`;
    console.log("Redirecting to:", targetUrl);
    
    return NextResponse.redirect(
      new URL(targetUrl, request.url)
    );
  } catch (error) {
    console.error('Magic link error:', error);
    return NextResponse.json(
      { error: 'Failed to process magic link' },
      { status: 500 }
    );
  }
}