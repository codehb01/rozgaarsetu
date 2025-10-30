"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";

/**
 * PushNotificationManager
 * Handles service worker registration and push subscription
 * Place this component in the root layout to enable notifications app-wide
 */
export function PushNotificationManager() {
  const { userId, isLoaded } = useAuth();
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const subscribeToPush = useCallback(
    async (reg: ServiceWorkerRegistration) => {
      if (isSubscribing) {
        console.log("Subscription already in progress, skipping...");
        return;
      }

      try {
        setIsSubscribing(true);

        // Wait for service worker to be ready
        const readyReg = await navigator.serviceWorker.ready;
        console.log("Service worker ready for subscription");

        // Get existing subscription first
        let subscription = await readyReg.pushManager.getSubscription();

        if (subscription) {
          console.log("Using existing push subscription");

          // Send existing subscription to server
          try {
            const response = await fetch("/api/push/subscribe", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(subscription.toJSON()),
            });

            if (response.ok) {
              console.log("Existing subscription saved to server");
            }
          } catch (err) {
            console.error("Failed to save existing subscription:", err);
          }
          return;
        }

        // Create new subscription
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidPublicKey) {
          console.error("VAPID public key not found in environment variables");
          console.error(
            "Make sure NEXT_PUBLIC_VAPID_PUBLIC_KEY is set in .env"
          );
          return;
        }

        console.log("VAPID key found, creating new subscription...");

        try {
          const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
          console.log("VAPID key converted to Uint8Array");

          subscription = await readyReg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey as BufferSource,
          });

          console.log("✅ Push subscription created successfully!");
        } catch (subscribeError) {
          if (subscribeError instanceof Error) {
            console.error("❌ Push subscription failed:");
            console.error("  Error name:", subscribeError.name);
            console.error("  Error message:", subscribeError.message);

            if (subscribeError.name === "AbortError") {
              console.error("  🔍 AbortError detected - Possible causes:");
              console.error(
                "  1. Browser's push service might be temporarily unavailable"
              );
              console.error(
                "  2. Try refreshing the page or restarting the browser"
              );
              console.error(
                "  3. Check if browser has push notifications enabled in settings"
              );
              console.error(
                "  4. Some browsers require a user gesture before subscribing"
              );

              // Retry logic for AbortError
              if (retryCount < maxRetries) {
                console.log(
                  `  🔄 Retrying... (attempt ${retryCount + 1}/${maxRetries})`
                );
                setIsSubscribing(false);
                setRetryCount((prev) => prev + 1);

                // Retry after a delay
                setTimeout(() => {
                  subscribeToPush(readyReg);
                }, 2000 * (retryCount + 1)); // Exponential backoff
                return;
              } else {
                console.error(
                  "  ❌ Max retries reached. Please try again later."
                );
              }
            }
          }
          throw subscribeError;
        }

        // Reset retry count on success
        setRetryCount(0);

        // Send subscription to server
        console.log("Saving subscription to server...");
        const response = await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscription.toJSON()),
        });

        if (response.ok) {
          console.log("✅ Push subscription saved to server successfully");
        } else {
          const error = await response.text();
          console.error("❌ Failed to save subscription to server:", error);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            "Failed to subscribe to push:",
            error.name,
            error.message
          );
        } else {
          console.error("Failed to subscribe to push:", error);
        }
      } finally {
        setIsSubscribing(false);
      }
    },
    [isSubscribing, retryCount, maxRetries]
  );

  const initializePushNotifications = useCallback(async () => {
    try {
      // Check current permission
      setPermission(Notification.permission);

      console.log("Registering service worker...");

      // Register service worker with proper scope
      const reg = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      console.log("Service worker registered, waiting for it to be ready...");

      // Wait for the service worker to be fully ready
      await navigator.serviceWorker.ready;

      // Additional check: ensure the service worker is actually active
      if (reg.active) {
        console.log("✅ Service worker is active and ready");
      } else if (reg.installing) {
        console.log(
          "⏳ Service worker is installing, waiting for activation..."
        );
        await new Promise<void>((resolve) => {
          const checkState = () => {
            if (reg.active) {
              console.log("✅ Service worker activated");
              resolve();
            } else {
              setTimeout(checkState, 100);
            }
          };
          checkState();
        });
      } else if (reg.waiting) {
        console.log("⏳ Service worker is waiting, activating...");
        reg.waiting.postMessage({ type: "SKIP_WAITING" });
        await new Promise<void>((resolve) => {
          navigator.serviceWorker.addEventListener(
            "controllerchange",
            () => {
              console.log("✅ Service worker activated");
              resolve();
            },
            { once: true }
          );
        });
      }

      setRegistration(reg);
      console.log("Service Worker registered:", reg.scope);

      // If permission already granted, subscribe immediately
      if (Notification.permission === "granted") {
        console.log("Permission already granted, subscribing to push...");
        // Add a small delay to ensure everything is ready
        setTimeout(() => {
          subscribeToPush(reg);
        }, 1000);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          "Failed to initialize push notifications:",
          error.name,
          error.message
        );
      } else {
        console.error("Failed to initialize push notifications:", error);
      }
    }
  }, [subscribeToPush]);

  useEffect(() => {
    if (!isLoaded || !userId) return;

    // Check if service worker and push are supported
    if (!("serviceWorker" in navigator)) {
      console.warn("❌ Service Workers not supported in this browser");
      return;
    }

    if (!("PushManager" in window)) {
      console.warn("❌ Push notifications not supported in this browser");
      return;
    }

    // Check if we're in a secure context (HTTPS or localhost)
    if (!window.isSecureContext) {
      console.warn("❌ Push notifications require HTTPS or localhost");
      return;
    }

    // Check browser compatibility for push notifications
    if (!navigator.serviceWorker.ready) {
      console.warn("❌ Service Worker ready promise not supported");
      return;
    }

    console.log("✅ Browser supports push notifications");
    console.log("🌐 Secure context:", window.isSecureContext);
    console.log("👤 User ID:", userId);

    // Initialize notification system with a delay to ensure DOM is ready
    const initTimer = setTimeout(() => {
      console.log("🚀 Initializing push notifications...");
      initializePushNotifications();
    }, 1000); // Increased delay to 1 second

    return () => clearTimeout(initTimer);
  }, [userId, isLoaded, initializePushNotifications]);

  const requestPermission = useCallback(async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === "granted") {
        // Use the stored registration or get it
        const reg =
          registration || (await navigator.serviceWorker.getRegistration());
        if (reg) {
          await subscribeToPush(reg);
        } else {
          console.error("No service worker registration found");
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          "Failed to request notification permission:",
          error.message
        );
      } else {
        console.error("Failed to request notification permission:", error);
      }
    }
  }, [subscribeToPush, registration]);

  // Show permission prompt if not decided
  useEffect(() => {
    if (permission === "default" && userId && isLoaded) {
      // Wait for service worker to be registered before requesting permission
      const timer = setTimeout(() => {
        if (registration) {
          requestPermission();
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [permission, userId, isLoaded, registration, requestPermission]);

  // This component doesn't render anything
  return null;
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  try {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    console.log(
      "VAPID key converted successfully, length:",
      outputArray.length
    );
    return outputArray;
  } catch (error) {
    console.error("Failed to convert VAPID key:", error);
    throw new Error("Invalid VAPID key format");
  }
}
