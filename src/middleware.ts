import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isPublicPath = path === "/signin" || path === "/signup";

  const token = req.cookies.get("token")?.value || "";

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/signin", req.nextUrl));
  }
}


export const config = {
  matcher: ["/", "/profile/:path*", "/signin", "/signup"],
};
