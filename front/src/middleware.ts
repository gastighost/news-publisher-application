import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const unprotectedRoutes = ["/", "/signin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to unprotected routes
  if (unprotectedRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if the session cookie exists
  const sessionCookie = request.cookies.get(process.env.SESSION_COOKIE_NAME!);

  if (!sessionCookie) {
    const signInUrl = new URL("/signin", request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Validate the session cookie with the backend
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/status`,
      {
        method: "GET",
        headers: {
          Cookie: `${sessionCookie.name}=${sessionCookie.value}`,
        },
        credentials: "include",
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.authenticated) {
        return NextResponse.next();
      }
    }

    console.log("Session validation failed. Redirecting to /signin.");
  } catch (error) {
    console.error("Error validating session cookie:", error);
  }

  // Redirect unauthenticated users to the sign-in page
  const signInUrl = new URL("/signin", request.url);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|appspecific).*)",
  ],
};
