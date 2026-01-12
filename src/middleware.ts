import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected paths and their required roles
const protectedPaths: Record<string, string> = {
  "/admin": "admin",
  "/seller": "seller",
};

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Find if the path is protected
  const matchedPath = Object.keys(protectedPaths).find((p) =>
    path.startsWith(p)
  );

  if (!matchedPath) return NextResponse.next();

  // Read token and user from cookies
  const token = req.cookies.get("token")?.value;
  const userCookie = req.cookies.get("user")?.value;
  const user = userCookie ? JSON.parse(userCookie) : null;

  // Redirect to home if no auth
  if (!token || !user) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Check role
  const requiredRole = protectedPaths[matchedPath];
  if (user.role !== requiredRole) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to these paths
export const config = {
  matcher: ["/admin/:path*", "/seller/:path*"],
};
