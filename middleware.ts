import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // Create supabase client
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Get user
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const path = request.nextUrl.pathname

    // PROTECTED ROUTES (Require Login OR Member Access)
    const protectedRoutes = ['/dashboard', '/crafting', '/treasury', '/hierarchy']
    const adminOnlyRoutes = ['/admin', '/gallery/upload']
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
    const isAdminOnlyRoute = adminOnlyRoutes.some(route => path.startsWith(route))

    // Check for member access cookie
    const hasMemberAccess = request.cookies.get('ryu_member_access')?.value === 'true'

    // Member routes (dashboard, crafting, treasury, hierarchy) - allow if user OR member access
    if (isProtectedRoute && !user && !hasMemberAccess) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Admin-only routes - require actual user login
    if (isAdminOnlyRoute && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // AUTH ROUTES (Redirect to Dashboard if already logged in)
    const authRoutes = ['/login', '/signup']
    const isAuthRoute = authRoutes.some(route => path.startsWith(route))

    if (isAuthRoute && user) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
