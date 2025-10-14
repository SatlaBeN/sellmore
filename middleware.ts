
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED = (process.env.NEXT_PUBLIC_SUPPORTED_LOCALES || "en").split(",");
const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "en";

export const config = { matcher: ["/((?!_next|api|favicon.ico).*)"] };

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasLocale = SUPPORTED.some((l) => pathname.startsWith(`/${l}`));
  if (hasLocale) {
    return NextResponse.next();
  }
  const url = req.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
  return NextResponse.redirect(url);
}
