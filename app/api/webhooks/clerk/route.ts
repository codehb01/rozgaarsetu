import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  // Get the webhook secret from environment variables
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add CLERK_WEBHOOK_SECRET to .env file");
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error: Verification failed", {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, phone_numbers, first_name, last_name } = evt.data;

    try {
      // Create user in database
      await prisma.user.create({
        data: {
          clerkUserId: id,
          email: email_addresses[0]?.email_address || "",
          phone: phone_numbers[0]?.phone_number || null,
          name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
          role: "UNASSIGNED",
        },
      });

      console.log(`User ${id} created in database`);
    } catch (error) {
      console.error("Error creating user in database:", error);
      return new Response("Error: Failed to create user in database", {
        status: 500,
      });
    }
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, phone_numbers, first_name, last_name } = evt.data;

    try {
      // Update user in database
      await prisma.user.update({
        where: { clerkUserId: id },
        data: {
          email: email_addresses[0]?.email_address || undefined,
          phone: phone_numbers[0]?.phone_number || undefined,
          name: `${first_name || ""} ${last_name || ""}`.trim() || undefined,
        },
      });

      console.log(`User ${id} updated in database`);
    } catch (error) {
      console.error("Error updating user in database:", error);
      // Don't fail if user doesn't exist yet
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    try {
      // Delete user from database
      await prisma.user.delete({
        where: { clerkUserId: id },
      });

      console.log(`User ${id} deleted from database`);
    } catch (error) {
      console.error("Error deleting user from database:", error);
      // Don't fail if user doesn't exist
    }
  }

  return new Response("Webhook processed successfully", { status: 200 });
}
