import { NextRequest, NextResponse } from "next/server";
import type { WebPushSubscription } from "@/lib/web-push";
import { addSubscription, removeSubscription } from "@/lib/redis";

export async function POST(request: NextRequest) {
  const { subscription } = (await request.json()) as {
    subscription: WebPushSubscription;
  };

  await addSubscription(subscription);

  return NextResponse.json({ success: true }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { endpoint } = (await request.json()) as { endpoint: string };

  await removeSubscription(endpoint);

  return NextResponse.json({ success: true });
}
