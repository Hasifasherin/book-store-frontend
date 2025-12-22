import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define admin & seller protected paths
const protectedPaths: { [key: string]: string } = {
  "/admin": "admin",
  "/seller": "seller",
};

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Only protect defined paths
  const requiredRole = Object.keys(protectedPaths).find((p) =>
    path.startsWith(p)
  );

  if (!requiredRole) return NextResponse.next();

  // Get token & user from cookies
  const token = req.cookies.get("token")?.value;
  const userCookie = req.cookies.get("user")?.value;
  const user = userCookie ? JSON.parse(userCookie) : null;

  // If no token or no user → redirect to home
  if (!token || !user) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Check role
  const roleRequired = protectedPaths[requiredRole];
  if (user.role !== roleRequired) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Specify paths middleware applies to
export const config = {
  matcher: ["/admin/:path*", "/seller/:path*"],
};
