import { SonnerDemo } from "@/components/sonner-demo";
import { WebNotificationDemo } from "@/components/web-notification-demo";
import { WebPushDemo } from "@/components/web-push-demo";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">
          通知デモ
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          アプリ内トースト通知（Sonner）、OS デスクトップ通知（Web Notification API）、
          バックグラウンドプッシュ通知（Web Push）のサンプルです。
        </p>
      </header>
      <div className="grid gap-8 md:grid-cols-2">
        <SonnerDemo />
        <WebNotificationDemo />
      </div>
      <div className="mt-8">
        <WebPushDemo />
      </div>
    </main>
  );
}
