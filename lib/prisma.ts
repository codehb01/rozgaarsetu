import { PrismaClient } from "@prisma/client";

/**
 * Returns a singleton instance of the PrismaClient with enhanced error handling.
 *
 * The singleton instance is stored in a global variable, so that subsequent
 * calls to this function will return the same instance.
 *
 * The singleton instance is created on the first call to this function, and
 * will be reused on subsequent calls.
 */
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    errorFormat: "pretty",
  });
};

// type safety
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Enhanced connection test with retry logic
export async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}

// Wrapper function with error handling for database operations
export async function withDatabaseErrorHandling<T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<T | null> {
  try {
    return await operation();
  } catch (error: any) {
    console.error("Database operation failed:", error);
    
    // Check if it's a connection error
    if (error?.code === 'P1001' || error?.message?.includes("Can't reach database server")) {
      console.error("🔥 Database server unreachable. Please check:");
      console.error("1. Neon database status");
      console.error("2. DATABASE_URL environment variable");
      console.error("3. Network connectivity");
    }
    
    return fallback ?? null;
  }
}

export default prisma;
