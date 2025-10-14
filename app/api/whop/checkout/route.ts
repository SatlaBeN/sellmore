
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildWhopCheckoutUrl } from "@/lib/whop";

export async function POST(req: NextRequest) {
  const { productId } = await req.json();
  const p = await prisma.product.findUnique({ where: { id: productId } });
  if (!p || !p.whopSkuSlug) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const url = buildWhopCheckoutUrl(p.whopSkuSlug, { quantity: 1 });
  await prisma.order.create({ data: { buyerId: (await prisma.user.findFirst({}))!.id, productId: p.id, amountCents: p.priceCents, status: "pending" } });
  return NextResponse.json({ url });
}
