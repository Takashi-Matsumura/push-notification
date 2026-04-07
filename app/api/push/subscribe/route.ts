import { NextRequest, NextResponse } from "next/server";
import { subscriptions, type WebPushSubscription } from "@/lib/web-push";

export async function POST(request: NextRequest) {
  const { subscription } = (await request.json()) as {
    subscription: WebPushSubscription;
  };

  subscriptions.set(subscription.endpoint, subscription);

  return NextResponse.json({ success: true }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { endpoint } = (await request.json()) as { endpoint: string };

  subscriptions.delete(endpoint);

  return NextResponse.json({ success: true });
}
