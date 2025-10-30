// Service Worker for Push Notifications
console.log("Service Worker loaded");

self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(clients.claim());
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    console.log("Received SKIP_WAITING message");
    self.skipWaiting();
  }
});

self.addEventListener("push", (event) => {
  console.log("Push event received:", event);

  if (!event.data) {
    console.log("No data in push event");
    return;
  }

  try {
    const payload = event.data.json();
    console.log("Push payload:", payload);

    const title = payload.title || "RozgaarSetu";
    const options = {
      body: payload.body || "",
      icon: "/icon-192.png",
      badge: "/badge-72.png",
      data: payload.data || {},
      tag: payload.tag || "notification",
      requireInteraction: false,
      actions: payload.actions || [],
    };

    event.waitUntil(
      self.registration
        .showNotification(title, options)
        .then(() => console.log("Notification shown"))
        .catch((error) => console.error("Error showing notification:", error))
    );
  } catch (error) {
    console.error("Error parsing push data:", error);
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        // Check if there's already a window open
        for (let client of windowClients) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

self.addEventListener("pushsubscriptionchange", (event) => {
  event.waitUntil(
    self.registration.pushManager
      .subscribe(event.oldSubscription.options)
      .then((subscription) => {
        return fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscription }),
        });
      })
  );
});
