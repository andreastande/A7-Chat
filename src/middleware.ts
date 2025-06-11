import { getSessionCookie } from "better-auth/cookies"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

// pages *for* authentication, not pages that *need* authentication
const AUTH_ROUTES = ["/login", "/signup"] as const

export async function middleware(req: NextRequest) {
  const sessionCookie = getSessionCookie(req)
  const { nextUrl } = req

  // true if we're on one of the login/signup routes
  const isAuthPage = AUTH_ROUTES.includes(nextUrl.pathname as (typeof AUTH_ROUTES)[number])

  // redirect if:
  // - logged in user hits an auth route (they don't need login/signup)
  // - guest user hits any non-auth route (protected pages)
  if ((sessionCookie && isAuthPage) || (!sessionCookie && !isAuthPage)) {
    nextUrl.pathname = sessionCookie ? "/" : "/login"
    return NextResponse.redirect(nextUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images).*)"],
}
