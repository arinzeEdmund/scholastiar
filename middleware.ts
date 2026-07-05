import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/discover',
  '/saved',
  '/applications',
  '/alerts',
  '/profile',
  '/documents',
  '/onboarding',
  '/jobs/apply',
  '/employer',
  '/admin',
];

const AUTH_ROUTES = ['/auth/sign-in', '/auth/sign-up', '/auth/forgot-password'];

function clearSupabaseAuthCookies(request: NextRequest, response: NextResponse) {
  request.cookies
    .getAll()
    .filter((cookie) => cookie.name.startsWith('sb-'))
    .forEach((cookie) => {
      response.cookies.set(cookie.name, '', {
        path: '/',
        maxAge: 0,
      });
    });
}

function sanitizeSignInUrl(request: NextRequest) {
  if (request.nextUrl.pathname !== '/auth/sign-in') return null;

  const hasCredentialParams =
    request.nextUrl.searchParams.has('email') ||
    request.nextUrl.searchParams.has('password');

  if (!hasCredentialParams) return null;

  const cleanUrl = request.nextUrl.clone();
  cleanUrl.searchParams.delete('email');
  cleanUrl.searchParams.delete('password');
  return NextResponse.redirect(cleanUrl);
}

export async function middleware(request: NextRequest) {
  const credentialRedirect = sanitizeSignInUrl(request);
  if (credentialRedirect) return credentialRedirect;

  const { pathname } = request.nextUrl;
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.some((p) => pathname.startsWith(p));
  const hasStaleAuthCookies =
    !user &&
    authError &&
    /refresh token|invalid token|jwt/i.test(authError.message);

  if (!user && isProtected) {
    const signIn = request.nextUrl.clone();
    signIn.pathname = '/auth/sign-in';
    signIn.searchParams.set('next', pathname);
    const redirectResponse = NextResponse.redirect(signIn);
    if (hasStaleAuthCookies) clearSupabaseAuthCookies(request, redirectResponse);
    return redirectResponse;
  }

  if (hasStaleAuthCookies) {
    clearSupabaseAuthCookies(request, response);
  }

  if (user && isAuthRoute) {
    const home = request.nextUrl.clone();
    home.pathname = '/discover';
    return NextResponse.redirect(home);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|manifest\\.webmanifest|sw\\.js|icons/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
