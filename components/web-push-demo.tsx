"use client";

import { useState, useEffect } from "react";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function WebPushDemo() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      navigator.serviceWorker.register("/sw.js").then((reg) => {
        setRegistration(reg);
        reg.pushManager.getSubscription().then((sub) => {
          setIsSubscribed(!!sub);
        });
      });
    }
  }, []);

  const subscribe = async () => {
    if (!registration) return;
    setIsLoading(true);
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ) as BufferSource,
      });
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription }),
      });
      setIsSubscribed(true);
    } catch (error) {
      console.error("購読に失敗しました:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribe = async () => {
    if (!registration) return;
    setIsLoading(true);
    try {
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
      }
      setIsSubscribed(false);
    } catch (error) {
      console.error("購読解除に失敗しました:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestNotification = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Web Push テスト",
          body: message || "バックグラウンドで受信できるプッシュ通知です。",
        }),
      });
    } catch (error) {
      console.error("送信に失敗しました:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">
          Web Push 通知
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          このブラウザは Service Worker または PushManager をサポートしていません。
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-card-foreground">
        Web Push 通知
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Service Worker を使ったプッシュ通知です。タブを閉じていても受信できます（ブラウザが起動している必要があります）。
      </p>

      <div className="mt-3 rounded-md bg-muted px-3 py-2 text-sm">
        ステータス:{" "}
        <span className="font-medium">
          {isSubscribed ? "✅ 購読中" : "⏳ 未購読"}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {!isSubscribed ? (
          <button
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            onClick={subscribe}
            disabled={isLoading}
          >
            {isLoading ? "処理中..." : "プッシュ通知を購読する"}
          </button>
        ) : (
          <>
            <div className="flex w-full gap-2">
              <input
                type="text"
                placeholder="通知メッセージ（省略可）"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
              />
              <button
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap"
                onClick={sendTestNotification}
                disabled={isLoading}
              >
                {isLoading ? "送信中..." : "テスト通知を送信"}
              </button>
            </div>
            <button
              className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50"
              onClick={unsubscribe}
              disabled={isLoading}
            >
              購読を解除する
            </button>
          </>
        )}
      </div>

      <div className="mt-3 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground space-y-1">
        <p>
          <strong>Web Notification API との違い:</strong>{" "}
          Web Push はサーバーから通知を送信するため、タブを閉じていても通知を受信できます。
          Web Notification API はアプリが開いている時のみ動作します。
        </p>
        <p>
          <strong>注意:</strong>{" "}
          このデモではサーバーのメモリに購読情報を保存しているため、サーバー再起動時に購読情報が消えます。
          その場合は一度「購読を解除」してから再度「購読」してください。
        </p>
      </div>
    </section>
  );
}
