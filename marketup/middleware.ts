import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const FINGERPRINT_COOKIE = "mktp_fp";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Fingerprint handling
  let fingerprint = request.cookies.get(FINGERPRINT_COOKIE)?.value || null;
  if (!fingerprint) {
    fingerprint = crypto.randomUUID();
    response.cookies.set(FINGERPRINT_COOKIE, fingerprint, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  const clientIp = (request.headers.get("x-forwarded-for") || request.ip || "").split(",")[0];
  if (fingerprint) response.headers.set("x-fingerprint", fingerprint);
  if (clientIp) response.headers.set("x-client-ip", clientIp);

  // Dashboard protection
  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (!token) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};


