import { NextRequest, NextResponse } from "next/server";
import { subscriptions } from "@/lib/web-push";
import type webpush from "web-push";

export async function POST(request: NextRequest) {
  const { subscription } = (await request.json()) as {
    subscription: webpush.PushSubscription;
  };

  subscriptions.set(subscription.endpoint, subscription);

  return NextResponse.json({ success: true }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { endpoint } = (await request.json()) as { endpoint: string };

  subscriptions.delete(endpoint);

  return NextResponse.json({ success: true });
}
