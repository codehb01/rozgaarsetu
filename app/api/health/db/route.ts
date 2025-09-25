import { NextResponse } from "next/server";
import prisma, { testDatabaseConnection } from "@/lib/prisma";

export async function GET() {
  try {
    // Test basic connection
    const isConnected = await testDatabaseConnection();
    
    if (!isConnected) {
      return NextResponse.json(
        { 
          status: "error", 
          message: "Database connection failed",
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

    // Test a simple query
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      status: "healthy",
      message: "Database connection successful",
      userCount,
      timestamp: new Date().toISOString(),
      database: "Neon PostgreSQL"
    });
    
  } catch (error: any) {
    console.error("Database health check failed:", error);
    
    return NextResponse.json(
      {
        status: "error",
        message: "Database health check failed",
        error: error.message,
        code: error.code,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}