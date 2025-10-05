import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/workers(.*)",
  "/onboarding(.*)",
  "/worker(.*)",
  "/customers(.*)",
  "/customer(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  // Call the route matcher with a pathname string (not the full request object).
  // Some matcher implementations mutate the passed object (assigning to `.params`),
  // which can throw when NextRequest exposes a read-only `params` proxy. Passing
  // only the pathname avoids that class of runtime errors.
  const pathname = (req as any)?.nextUrl?.pathname ?? new URL(req.url).pathname;
  // Provide a plain JS object so the matcher may mutate `params` on it if needed.
  const matchTarget = { pathname };
  if (!userId && isProtectedRoute(matchTarget as any)) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?  |css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
