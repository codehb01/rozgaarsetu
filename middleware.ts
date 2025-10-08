import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  
  // Simple pathname-based protection without using createRouteMatcher
  // This avoids the "Cannot assign to read only property 'params'" error
  const pathname = req.nextUrl.pathname;
  
  const protectedPaths = [
    '/workers',
    '/onboarding',
    '/worker',
    '/customers',
    '/customer',
  ];
  
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));
  
  if (!userId && isProtected) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
