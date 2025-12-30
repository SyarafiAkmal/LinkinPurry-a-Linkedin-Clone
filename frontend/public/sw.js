self.addEventListener("push", async (event) => {
  const data = event.data.json();
  const title = data.title || "Notification";
  const body = data.body || "";
  const icon = data.icon || "";
  const url = data.data?.url || "/";

  const notificationOptions = {
    body: body,
    tag: "v0",
    icon: icon,
    data: {
      url: url,
    },
  };

  await self.registration.showNotification(title, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  }
});
