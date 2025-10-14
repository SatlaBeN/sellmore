
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.upsert({
    where: { whopUserId: "seed_user" },
    update: {},
    create: { whopUserId: "seed_user", email: "seed@sellmore.app" }
  });
  const p1 = await prisma.product.upsert({
    where: { id: "seed_p1" },
    update: {},
    create: {
      id: "seed_p1",
      ownerId: user.id,
      title: "UGC Starter Pack",
      description: "3 edited videos",
      priceCents: 9900,
      whopSkuSlug: "your-whop-sku-slug"
    }
  });
  console.log({ user: user.id, product: p1.id });
}
main().then(()=>prisma.$disconnect()).catch(async(e)=>{console.error(e); await prisma.$disconnect(); process.exit(1);});
