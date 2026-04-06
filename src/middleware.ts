import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Ignore creating a client if SUPABASE_URL isn't set, useful for initial build 
  // without env variables populated yet.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          supabaseResponse.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          supabaseResponse.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // 1. Admin routes matching logic
  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com' 
    
    // Admin requirement: must be logged in with matching email AND it must NOT be via OAuth
    if (!user || user.email !== adminEmail || user.app_metadata.provider) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // 2. User routes (/saved) require a session. Wait, /me is a user route, but our /me page 
  // explicitly handles the logged out view itself (showing browse as guest/login).
  // So we'll only protect /saved strictly.
  const protectedRoutes = ['/saved']
  if (protectedRoutes.some(r => path.startsWith(r))) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
