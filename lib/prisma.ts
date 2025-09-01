import { PrismaClient } from "@prisma/client";

/**
 * Returns a singleton instance of the PrismaClient.
 *
 * The singleton instance is stored in a global variable, so that subsequent
 * calls to this function will return the same instance.
 *
 * The singleton instance is created on the first call to this function, and
 * will be reused on subsequent calls.
 */
const prismaClientSinglton = () => {
  return new PrismaClient();
};

// type safety
type prismaClientSinglton = ReturnType<typeof prismaClientSinglton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSinglton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
export default prisma;
