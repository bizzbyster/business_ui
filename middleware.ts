import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: ["/", "/about", "/unauthorized", "/sign-in", "/sign-up"],
});
 
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};