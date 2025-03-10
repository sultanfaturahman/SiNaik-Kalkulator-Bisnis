import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;

  // Define public paths that don't need authentication
  const isPublicPath = path === '/login' || 
                      path === '/register';

  // Get the token from the cookies
  const token = request.cookies.get('token')?.value;

  // Redirect logic
  if (isPublicPath && token) {
    // If user is already logged in and tries to access public paths
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!isPublicPath && !token) {
    // If user is not logged in and tries to access protected paths
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/login',
    '/register',
    '/dashboard',
    '/adminDashboard'
  ]
};
