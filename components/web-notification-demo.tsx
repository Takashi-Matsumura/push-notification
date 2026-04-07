"use client";

import { useState, useEffect } from "react";
import { NotificationGuide } from "@/components/notification-guide";

export function WebNotificationDemo() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setIsSupported(false);
      return;
    }
    setPermission(Notification.permission);
  }, []);

  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  const [tagCount, setTagCount] = useState(0);

  const playNotificationSound = () => {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    oscillator.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  };

  const sendNotification = (
    title: string,
    options?: NotificationOptions
  ) => {
    new Notification(title, options);
    if (!options?.silent) {
      playNotificationSound();
    }
  };

  if (!isSupported) {
    return (
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-card-foreground">
          OS デスクトップ通知
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          このブラウザは Web Notification API をサポートしていません。
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-card-foreground">
        OS デスクトップ通知
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Web Notification API を使って OS のデスクトップ通知を表示します。
      </p>

      <div className="mt-3 rounded-md bg-muted px-3 py-2 text-sm">
        現在のステータス:{" "}
        <span className="font-medium">
          {permission === "granted" && "✅ 許可済み"}
          {permission === "denied" && "❌ 拒否"}
          {permission === "default" && "⏳ 未設定"}
        </span>
      </div>

      {permission === "default" && (
        <div className="mt-4">
          <button
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            onClick={requestPermission}
          >
            通知を許可する
          </button>
        </div>
      )}

      {permission === "denied" && <NotificationGuide />}

      {permission === "granted" && (
        <>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              onClick={() =>
                sendNotification("こんにちは！", {
                  body: "これは基本的なデスクトップ通知です。",
                })
              }
            >
              基本通知
            </button>
            <button
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              onClick={() =>
                sendNotification("アイコン付き通知", {
                  body: "アイコン画像付きの通知です。",
                  icon: "/next.svg",
                })
              }
            >
              アイコン付き
            </button>
            <button
              className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
              onClick={() => {
                const count = tagCount + 1;
                setTagCount(count);
                sendNotification(`タグ付き通知（${count}回目）`, {
                  body: `この通知は前の通知を置き換えます。クリック回数: ${count}`,
                  tag: "update",
                  renotify: true,
                });
              }}
            >
              タグ付き（置換）
            </button>
            <button
              className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
              onClick={() =>
                sendNotification("サイレント通知", {
                  body: "この通知は音が鳴りません。",
                  silent: true,
                })
              }
            >
              サイレント
            </button>
          </div>
          <div className="mt-3 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground space-y-1">
            <p>
              <strong>通知音について:</strong>{" "}
              Web Notification API の通知音はOSとブラウザの組み合わせにより挙動が異なります。
              macOS + Chrome / Edge ではシステム通知音が鳴らないことがあるため、
              このデモではアプリ側で通知音を再生しています（サイレント通知を除く）。
            </p>
            <p>
              Windows では Chrome / Edge / Firefox いずれもシステム通知音が鳴ります。
            </p>
          </div>
        </>
      )}
    </section>
  );
}
