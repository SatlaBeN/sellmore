
import { PrismaClient } from "@prisma/client";

export const prisma: PrismaClient = (globalThis as any).prisma || new PrismaClient();
if (!(globalThis as any).prisma) {
  (globalThis as any).prisma = prisma;
}
