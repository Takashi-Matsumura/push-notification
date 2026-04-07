import { Redis } from "@upstash/redis";
import type { WebPushSubscription } from "./web-push";

const redis = Redis.fromEnv();

const SUBSCRIPTIONS_KEY = "push:subscriptions";

export async function addSubscription(subscription: WebPushSubscription) {
  await redis.hset(SUBSCRIPTIONS_KEY, {
    [subscription.endpoint]: JSON.stringify(subscription),
  });
}

export async function removeSubscription(endpoint: string) {
  await redis.hdel(SUBSCRIPTIONS_KEY, endpoint);
}

export async function getAllSubscriptions(): Promise<
  Map<string, WebPushSubscription>
> {
  const data = await redis.hgetall<Record<string, string>>(SUBSCRIPTIONS_KEY);
  const map = new Map<string, WebPushSubscription>();
  if (!data) return map;
  for (const [endpoint, value] of Object.entries(data)) {
    const sub =
      typeof value === "string"
        ? (JSON.parse(value) as WebPushSubscription)
        : (value as unknown as WebPushSubscription);
    map.set(endpoint, sub);
  }
  return map;
}
