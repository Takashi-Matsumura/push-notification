import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:demo@example.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export const subscriptions = new Map<string, webpush.PushSubscription>();

export { webpush };
