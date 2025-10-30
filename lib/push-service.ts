import webpush from "web-push";
import prisma from "./prisma";

// Configure VAPID details
webpush.setVapidDetails(
  "mailto:support@rozgaarsetu.com",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export interface PushPayload {
  type: string;
  title: string;
  body: string;
  data?: Record<string, string | number | boolean | null>;
  tag?: string;
}

/**
 * Send push notification to a specific user
 * Handles multiple subscriptions and cleans up invalid ones
 */
export async function sendPushToUser(
  userId: string,
  payload: PushPayload
): Promise<{ sent: number; failed: number }> {
  try {
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
    });

    if (subscriptions.length === 0) {
      console.log(`No push subscriptions found for user ${userId}`);
    }

    let sent = 0;
    let failed = 0;

    // Send to all user's subscriptions
    await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          const pushSubscription = {
            endpoint: sub.endpoint,
            keys: sub.keys as { p256dh: string; auth: string },
          };

          await webpush.sendNotification(
            pushSubscription,
            JSON.stringify(payload)
          );
          sent++;
        } catch (error: unknown) {
          failed++;
          console.error(`Failed to send push to ${sub.endpoint}:`, error);

          // Remove invalid subscriptions (410 Gone, 404 Not Found)
          const webPushError = error as { statusCode?: number };
          if (
            webPushError?.statusCode === 410 ||
            webPushError?.statusCode === 404
          ) {
            console.log(`Removing invalid subscription: ${sub.id}`);
            await prisma.pushSubscription.delete({ where: { id: sub.id } });
          }
        }
      })
    );

    // Save notification to database for history
    await prisma.notification.create({
      data: {
        userId,
        type: payload.type,
        title: payload.title,
        body: payload.body,
        data: payload.data || {},
      },
    });

    return { sent, failed };
  } catch (error) {
    console.error("Error in sendPushToUser:", error);
    throw error;
  }
}

/**
 * Send push notification to multiple users
 */
export async function sendPushToUsers(
  userIds: string[],
  payload: PushPayload
): Promise<void> {
  await Promise.all(userIds.map((userId) => sendPushToUser(userId, payload)));
}

/**
 * Job event notification helpers
 */
export const notifyJobCreated = async (
  workerId: string,
  job: { id: string; description: string; charge: number }
) => {
  await sendPushToUser(workerId, {
    type: "JOB_CREATED",
    title: "New Job Available!",
    body: `${job.description} - ₹${job.charge}`,
    data: {
      jobId: job.id,
      url: `/worker/job`,
    },
    tag: `job-${job.id}`,
  });
};

export const notifyJobAccepted = async (
  customerId: string,
  job: { id: string; description: string }
) => {
  await sendPushToUser(customerId, {
    type: "JOB_ACCEPTED",
    title: "Job Accepted!",
    body: `Worker accepted your job: ${job.description}`,
    data: {
      jobId: job.id,
      url: `/customer/bookings`,
    },
    tag: `job-${job.id}`,
  });
};

export const notifyJobStarted = async (
  customerId: string,
  job: { id: string; description: string }
) => {
  await sendPushToUser(customerId, {
    type: "JOB_STARTED",
    title: "Work Started!",
    body: `Worker has arrived and started work on: ${job.description}`,
    data: {
      jobId: job.id,
      url: `/customer/bookings`,
    },
    tag: `job-${job.id}`,
  });
};

export const notifyJobCompleted = async (
  workerId: string,
  job: { id: string; description: string; workerEarnings?: number }
) => {
  await sendPushToUser(workerId, {
    type: "JOB_COMPLETED",
    title: "Job Completed!",
    body: `Payment received for: ${job.description}. You earned ₹${
      job.workerEarnings || 0
    }`,
    data: {
      jobId: job.id,
      url: `/worker/earnings`,
    },
    tag: `job-${job.id}`,
  });
};

export const notifyJobCancelled = async (
  userId: string,
  job: { id: string; description: string },
  cancelledBy: "customer" | "worker"
) => {
  const isCustomer = cancelledBy === "worker";
  await sendPushToUser(userId, {
    type: "JOB_CANCELLED",
    title: "Job Cancelled",
    body: `The ${cancelledBy} cancelled: ${job.description}`,
    data: {
      jobId: job.id,
      url: isCustomer ? `/customer/bookings` : `/worker/job`,
    },
    tag: `job-${job.id}`,
  });
};
