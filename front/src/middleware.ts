import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Add /post to unprotected routes
export const unprotectedRoutes = ["/", "/signin", "/user", "/post"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    unprotectedRoutes.some(
      (route) =>
        pathname === route ||
        (route !== "/" && pathname.startsWith(`${route}/`))
    )
  ) {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get(
    process.env.SESSION_COOKIE_NAME || "connect.sid"
  )

  if (!sessionCookie) {
    const signInUrl = new URL("/signin", request.url)
    return NextResponse.redirect(signInUrl)
  }

  try {
    const cookieHeader = request.headers.get("cookie") || ""
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/status`,
      {
        method: "GET",
        headers: {
          Cookie: cookieHeader,
          Accept: "application/json",
        },
      }
    )

    if (response.ok) {
      const data = await response.json()
      if (data.authenticated && data.user) {
        return NextResponse.next()
      }
    }
  } catch (error) {
    console.error(error)
  }

  const signInUrl = new URL("/signin", request.url)
  return NextResponse.redirect(signInUrl)
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|appspecific).*)",
  ],
}
