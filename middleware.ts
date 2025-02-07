import { clerkMiddleware } from '@clerk/nextjs/server'

// Enable debug to see what's happening
export default clerkMiddleware({
  debug: true
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(jpg|jpeg|gif|png|svg|ico|css|js|zip)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};