self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = { title: "プッシュ通知", body: event.data.text() };
    }
  }
  const title = data.title || "プッシュ通知";
  const options = {
    body: data.body || "",
    icon: data.icon || "/next.svg",
  };
  event.waitUntil(
    Notification.permission === "granted"
      ? self.registration.showNotification(title, options)
      : self.clients.matchAll({ type: "window" }).then((clients) => {
          clients.forEach((client) =>
            client.postMessage({
              type: "PUSH_RECEIVED_NO_PERMISSION",
              title,
              body: options.body,
            })
          );
        })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow("/");
    })
  );
});
