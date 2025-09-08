import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { PROTECTED_ROUTES } from './lib/protected-routes';
 
const isSignInPage = createRouteMatcher(["/login"]);

// Protect the actual URL paths that are inside the (protected) folder
const isProtectedRoute = createRouteMatcher(PROTECTED_ROUTES); 

// Generate a nonce for CSP
function generateNonce(): string {
  return Buffer.from(crypto.randomUUID()).toString('base64');
}

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  // Generate nonce for this request
  const nonce = generateNonce();
  const isDev = process.env.NODE_ENV === 'development';
  
  // Create CSP header with nonce for scripts, unsafe-inline for styles
  const cspHeader = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''} https://assets.pipedream.net https://*.convex.cloud https://*.convex.dev`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' blob: data: https://assets.pipedream.net https://*.convex.cloud https://*.convex.dev",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://*.convex.cloud https://*.convex.dev https://assets.pipedream.net wss://*.convex.cloud wss://*.convex.dev",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');
  
  // Handle authentication logic
  let response: NextResponse | undefined;
  
  if (isSignInPage(request) && (await convexAuth.isAuthenticated())) {
    response = nextjsMiddlewareRedirect(request, "/workflows");
  } else if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
    response = nextjsMiddlewareRedirect(request, "/login");
  }
  
  // If we have a redirect response, add headers
  if (response) {
    response.headers.set('x-nonce', nonce);
    response.headers.set('Content-Security-Policy', cspHeader);
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    return response;
  }
  
  // For non-redirect responses, create a new response with headers
  const nextResponse = NextResponse.next();
  nextResponse.headers.set('x-nonce', nonce);
  nextResponse.headers.set('Content-Security-Policy', cspHeader);
  nextResponse.headers.set('X-Content-Type-Options', 'nosniff');
  nextResponse.headers.set('X-Frame-Options', 'DENY');
  nextResponse.headers.set('X-XSS-Protection', '1; mode=block');
  nextResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return nextResponse;
});
// Swap this out for the following line to disable auth middleware
// export default convexAuthNextjsMiddleware();

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};