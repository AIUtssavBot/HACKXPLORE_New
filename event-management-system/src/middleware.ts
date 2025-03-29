import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const publicPaths = ["/", "/auth/login", "/auth/register", "/auth/error"];
  const isPublicPath = publicPaths.includes(path) || path.startsWith("/_next") || path.startsWith("/api");
  
  // Redirect logic
  if (!isAuthenticated && !isPublicPath) {
    // If not authenticated and trying to access a protected route, redirect to login
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  
  if (isAuthenticated && (path === "/auth/login" || path === "/auth/register")) {
    // If authenticated and trying to access login/register pages, redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  // Role-based access control
  if (isAuthenticated && path.startsWith("/dashboard")) {
    const userRole = token.role as string;
    
    // Super Admin specific routes
    if (path.startsWith("/dashboard/super-admin") && userRole !== "super_admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    // Admin specific routes
    if (path.startsWith("/dashboard/admin") && userRole !== "admin" && userRole !== "super_admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    // Committee member specific routes
    if (path.startsWith("/dashboard/committee") && 
        userRole !== "committee_member" && 
        userRole !== "admin" && 
        userRole !== "super_admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    // Attendee specific routes
    if (path.startsWith("/dashboard/attendee") && userRole !== "attendee") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth routes
     * 2. /_next/static (static files)
     * 3. /_next/image (image optimization files)
     * 4. /favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
}; 