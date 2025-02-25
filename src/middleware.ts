// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Dashboard is accessible without onboarding completion initially
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

// Only protect onboarding routes when a user has started but not completed onboarding
const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"]);

const unauthenticatedUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/unauthorized`;

export default clerkMiddleware(async (auth, req) => {
  // General authentication protection for dashboard
  if (isProtectedRoute(req)) {
    await auth.protect(undefined, {
      unauthenticatedUrl,
    });
  }

  // Handle onboarding flow - if user has started onboarding (onboardingStep exists)
  // but hasn't completed it (onboardingCompleted is not true)
  if (auth.userId && 
      auth.user?.unsafeMetadata?.onboardingStep && 
      !auth.user?.unsafeMetadata?.onboardingCompleted) {
    
    // If trying to access dashboard after starting onboarding, redirect back to onboarding
    if (isProtectedRoute(req) && !isOnboardingRoute(req)) {
      const onboardingUrl = new URL('/onboarding', req.url);
      return NextResponse.redirect(onboardingUrl);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};