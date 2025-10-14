
import { NextRequest, NextResponse } from "next/server";
import { buildWhopCheckoutUrl } from "@/lib/whop";

const MAP: Record<string, string> = {
  free: process.env.WHOP_PRICE_FREE as string,
  mid: process.env.WHOP_PRICE_MID as string,
  pro: process.env.WHOP_PRICE_PRO as string
};

export async function POST(req: NextRequest) {
  const { tier } = await req.json();
  const slug = MAP[tier as keyof typeof MAP];
  if (!slug) return NextResponse.json({ error: "bad_tier" }, { status: 400 });
  const url = buildWhopCheckoutUrl(slug, { quantity: 1 });
  return NextResponse.json({ url });
}
