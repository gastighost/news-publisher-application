import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const unprotectedRoutes = ["/", "/signin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (unprotectedRoutes.includes(pathname)) {
    return NextResponse.next();
  }
  const cookieName = process.env.SESSION_COOKIE_NAME!;

  const sessionCookie = request.cookies.get(cookieName);
  if (!sessionCookie) {
    const signInUrl = new URL("/signin", request.url);
    return NextResponse.redirect(signInUrl);
  }
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
  const signInUrl = new URL("/signin", request.url);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|appspecific).*)",
  ],
};
