import { NextRequest, NextResponse } from "next/server";
import { webpush, subscriptions } from "@/lib/web-push";

export async function POST(request: NextRequest) {
  const { title, body } = (await request.json()) as {
    title: string;
    body: string;
  };

  const payload = JSON.stringify({ title, body, icon: "/next.svg" });

  let sent = 0;
  const errors: string[] = [];

  for (const [endpoint, subscription] of subscriptions) {
    try {
      await webpush.sendNotification(subscription, payload);
      sent++;
    } catch (error: unknown) {
      const statusCode =
        error instanceof Error && "statusCode" in error
          ? (error as { statusCode: number }).statusCode
          : undefined;
      if (statusCode === 410 || statusCode === 404) {
        subscriptions.delete(endpoint);
      } else {
        errors.push(endpoint);
      }
    }
  }

  return NextResponse.json({ success: true, sent, errors: errors.length });
}
