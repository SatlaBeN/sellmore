
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const items = await prisma.product.findMany({ where: { active: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ items });
}
