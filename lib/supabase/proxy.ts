// import { createServerClient } from "@supabase/ssr";
// import { NextResponse, type NextRequest } from "next/server";

// export async function updateSession(request: NextRequest) {
//   let supabaseResponse = NextResponse.next({ request });

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     // If your project uses ANON key, prefer:
//     // process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//     process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll();
//         },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
//           supabaseResponse = NextResponse.next({ request });
//           cookiesToSet.forEach(({ name, value, options }) => {
//             supabaseResponse.cookies.set(name, value, options);
//           });
//         },
//       },
//     }
//   );

//   // Validates JWT against project’s public keys + refreshes if needed
//   const { data } = await supabase.auth.getClaims();
//   const user = data?.claims;

//   const pathname = request.nextUrl.pathname;

//   const authPages = ["/auth/login", "/auth/signup", "/auth/check-email"];
//   const isAuthPage = authPages.some((p) => pathname.startsWith(p));

//   const publicPrefixes = [
//     "/auth/login",
//     "/auth/signup",
//     "/auth/check-email",
//     "/auth/callback",
//     "/auth/error", // ✅ allow your generic error page
//   ];
//   const isPublic = publicPrefixes.some((p) => pathname.startsWith(p));

//   // ✅ Avoid redirect loops: only do protection redirects on GET navigations
//   if (request.method === "GET") {
//     // If already logged in, don't allow auth pages
//     if (user && isAuthPage) {
//       const url = request.nextUrl.clone();
//       url.pathname = "/dashboard";
//       return NextResponse.redirect(url);
//     }

//     // If not logged in, protect non-public pages
//     if (!user && !isPublic) {
//       const url = request.nextUrl.clone();
//       url.pathname = "/auth/login";
//       return NextResponse.redirect(url);
//     }
//   }

//   return supabaseResponse;
// }


import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Validates JWT against project’s public keys + refreshes if needed
  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  const pathname = request.nextUrl.pathname

  const authPages = [
    "/auth/login",
    "/auth/signup",
    "/auth/check-email",
  ]

  const isAuthPage = authPages.some((p) => pathname.startsWith(p))

  if (user && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  // const publicPrefixes = [
  //   "/auth/login",
  //   "/auth/signup",
  //   "/auth/check-email",
  //   "/auth/callback",
  // ]
  const publicPrefixes = [
    "/auth/login",
    "/auth/signup",
    "/auth/check-email",
    "/auth/callback",
    "/auth/error",
    "/auth/reset-callback",
    "/auth/reset-password",
    "/auth/forgot-password",
  ];

  const isPublic = publicPrefixes.some((p) => pathname.startsWith(p))

  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}