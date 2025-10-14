
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { title, description, priceCents, whopSkuSlug } = await req.json();
  const owner = await prisma.user.findFirst({});
  if (!owner) return NextResponse.json({ ok: false }, { status: 403 });
  const created = await prisma.product.create({ data: { ownerId: owner.id, title, description, priceCents, whopSkuSlug } });
  return NextResponse.json({ ok: true, id: created.id });
}
