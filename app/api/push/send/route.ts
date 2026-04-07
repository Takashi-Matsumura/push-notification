import { NextRequest, NextResponse } from "next/server";
import { getWebPush } from "@/lib/web-push";
import { getAllSubscriptions, removeSubscription } from "@/lib/redis";

export async function POST(request: NextRequest) {
  const { title, body } = (await request.json()) as {
    title: string;
    body: string;
  };

  const payload = JSON.stringify({ title, body, icon: "/next.svg" });
  const subscriptions = await getAllSubscriptions();

  let sent = 0;
  const errorDetails: string[] = [];

  for (const [endpoint, subscription] of subscriptions) {
    try {
      await getWebPush().sendNotification(subscription, payload);
      sent++;
    } catch (error: unknown) {
      const statusCode =
        error instanceof Error && "statusCode" in error
          ? (error as { statusCode: number }).statusCode
          : undefined;
      const message =
        error instanceof Error ? error.message : String(error);
      if (statusCode === 410 || statusCode === 404) {
        await removeSubscription(endpoint);
        errorDetails.push(`expired(${statusCode})`);
      } else {
        errorDetails.push(`${statusCode ?? "unknown"}: ${message}`);
      }
    }
  }

  return NextResponse.json({
    success: true,
    sent,
    totalSubscriptions: subscriptions.size,
    errors: errorDetails,
  });
}
