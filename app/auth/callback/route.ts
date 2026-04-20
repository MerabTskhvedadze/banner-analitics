//* callback for 3rd party auth (Google, LinkedIn) *//

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next");

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      const errorUrl = new URL("/auth/error", request.url);
      errorUrl.searchParams.set("provider", "oauth");
      errorUrl.searchParams.set("error", "code_exchange_failed");
      errorUrl.searchParams.set("error_description", error.message);
      return NextResponse.redirect(errorUrl);
    }
  }

  const destination = new URL("/auth/2fa", request.url);
  if (next && next.startsWith("/")) {
    destination.searchParams.set("next", next);
  }

  return NextResponse.redirect(destination);
}
