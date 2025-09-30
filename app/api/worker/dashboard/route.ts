import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const worker = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        workerProfile: true,
        jobsAssigned: {
          include: {
            customer: {
              select: { name: true }
            }
          },
          orderBy: { createdAt: "desc" },
          take: 10
        }
      }
    });

    if (!worker || worker.role !== "WORKER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Calculate stats
    const totalJobs = await prisma.job.count({
      where: { workerId: worker.id }
    });

    const completedJobs = await prisma.job.count({
      where: { 
        workerId: worker.id,
        status: "COMPLETED"
      }
    });

    const pendingJobs = await prisma.job.count({
      where: { 
        workerId: worker.id,
        status: "PENDING"
      }
    });

    const inProgressJobs = await prisma.job.count({
      where: { 
        workerId: worker.id,
        status: "IN_PROGRESS"
      }
    });

    // Calculate total earnings from completed jobs
    const earningsResult = await prisma.job.aggregate({
      where: {
        workerId: worker.id,
        status: "COMPLETED"
      },
      _sum: {
        charge: true
      }
    });

    const totalEarnings = earningsResult._sum.charge || 0;

    // Get recent reviews
    const recentReviews = await prisma.review.findMany({
      where: { workerId: worker.id },
      include: {
        customer: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 5
    });

    const stats = {
      totalJobs,
      completedJobs,
      pendingJobs,
      inProgressJobs,
      totalEarnings,
      recentJobs: worker.jobsAssigned,
      recentReviews
    };

    return NextResponse.json({ 
      worker: {
        ...worker,
        workerProfile: worker.workerProfile
      },
      stats 
    });

  } catch (error) {
    console.error("GET /api/worker/dashboard error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}