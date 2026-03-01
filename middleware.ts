import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "./lib/session";

// Define protected and public routes
const protectedRoutes = ["/dashboard", "/profile", "/admin"];
const publicRoutes = ["/login", "/register", "/"];

export async function middleware(req: NextRequest) {
    // Check if the current route is protected or public
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some((route) =>
        path.startsWith(route)
    );

    // Verify session
    const session = await verifySession();

    // Redirect to home if user is not authenticated and trying to access a protected route
    if (isProtectedRoute && !session?.isAuth) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    // Optional: Redirect to a protected page if user is already authenticated and hits login/register
    // (If the project had standalone login/register pages)
    // if (isPublicRoute && session?.isAuth && (path === '/login' || path === '/register')) {
    //   return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    // }

    return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
