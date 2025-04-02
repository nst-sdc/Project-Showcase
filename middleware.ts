import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/login" || path === "/signup" || path === "/" || path === "/projects"

  // Check if the user is authenticated using NextAuth
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // If the path requires authentication and the user is not authenticated, redirect to login
  if (!isPublicPath && !session) {
    // Create the redirect URL
    const url = new URL("/login", request.url)
    
    // Prevent redirect loops by checking the referer and current path
    const referer = request.headers.get("referer")
    if (referer) {
      const refererUrl = new URL(referer)
      // Don't add callbackUrl if we're coming from the login page to prevent loops
      if (!refererUrl.pathname.includes("/login")) {
        url.searchParams.set("callbackUrl", encodeURI(request.url))
      }
    } else {
      // If no referer, add the callbackUrl (first-time visit)
      url.searchParams.set("callbackUrl", encodeURI(request.url))
    }
    
    return NextResponse.redirect(url)
  }

  // If the user is authenticated and trying to access login or signup, redirect to dashboard
  if (isPublicPath && path !== "/" && path !== "/projects" && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup", "/profile", "/settings", "/projects/:path*"],
}

