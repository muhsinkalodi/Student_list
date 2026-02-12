
import { NextResponse } from 'next/server';
import { decrypt } from './lib/auth';
import { cookies } from 'next/headers';

// 1. Specify protected and public routes
const protectedRoutes = ['/admin', '/dashboard'];
const publicRoutes = ['/login', '/api/auth/login'];

export default async function middleware(req) {
    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
    const isPublicRoute = publicRoutes.some(route => path.startsWith(route));

    // 3. Decrypt the session from the cookie
    const cookie = cookies().get('session')?.value;
    const session = await decrypt(cookie);

    // 4. Redirect to /login if the user is not authenticated
    if (path === '/' && !session) {
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    // 5. Redirect to /dashboard if the user is authenticated and trying to access login
    if (isPublicRoute && session && path !== '/api/auth/login') {
        return NextResponse.redirect(new URL('/', req.nextUrl));
    }

    return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
