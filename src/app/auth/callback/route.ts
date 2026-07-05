import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as 'recovery' | 'signup' | 'email' | null;
  const next = searchParams.get('next') ?? '/discover';

  const redirectTo = NextResponse.redirect(`${origin}${next}`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            redirectTo.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      const msg = error.message.toLowerCase().includes('expired')
        ? 'link_expired'
        : 'auth_callback_failed';
      return NextResponse.redirect(`${origin}/auth/sign-in?error=${msg}`);
    }
    return redirectTo;
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (error) {
      const msg = error.message.toLowerCase().includes('expired')
        ? 'link_expired'
        : 'auth_callback_failed';
      return NextResponse.redirect(`${origin}/auth/sign-in?error=${msg}`);
    }
    // recovery type should land on reset-password regardless of `next`
    const destination = type === 'recovery' ? '/auth/reset-password' : next;
    return NextResponse.redirect(`${origin}${destination}`);
  }

  return NextResponse.redirect(`${origin}/auth/sign-in?error=missing_code`);
}
