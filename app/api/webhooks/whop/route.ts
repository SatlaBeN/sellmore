
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("whop-signature");
  const raw = await req.text();
  if (!sig || sig.length < 10) return NextResponse.json({ ok: false }, { status: 401 });
  const body = JSON.parse(raw);

  if (body.type === "purchase.completed") {
    const purchaseId = body.data.id as string;
    const productSlug = body.data.item?.slug as string | undefined;
    if (productSlug) {
      const product = await prisma.product.findFirst({ where: { whopSkuSlug: productSlug } });
      if (product) {
        const order = await prisma.order.findFirst({ where: { productId: product.id, status: "pending" }, orderBy: { createdAt: "desc" } });
        if (order) await prisma.order.update({ where: { id: order.id }, data: { status: "paid", whopCheckoutId: purchaseId } });
      }
    }
  }

  if (body.type === "license.activated") {
    const id = body.data.user_id as string;
    await prisma.user.upsert({ where: { whopUserId: id }, update: {}, create: { whopUserId: id } });
  }

  return NextResponse.json({ ok: true });
}
