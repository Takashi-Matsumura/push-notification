"use client";

import { useState, useEffect } from "react";

type Browser = "chrome" | "safari" | "edge" | "unknown";

function detectBrowser(): Browser {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Edg/")) return "edge";
  if (ua.includes("Chrome/") && !ua.includes("Edg/")) return "chrome";
  if (ua.includes("Safari/") && !ua.includes("Chrome/")) return "safari";
  return "unknown";
}

const browserLabels: Record<Browser, string> = {
  chrome: "Chrome",
  safari: "Safari",
  edge: "Edge",
  unknown: "ブラウザ",
};

function ChromeGuide() {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold">方法1: アドレスバーから（簡単）</h4>
      <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
        <li>アドレスバー左の <strong>🔒 アイコン（またはⓘ）</strong>をクリック</li>
        <li><strong>「通知」</strong>を<strong>「許可」</strong>に変更</li>
        <li>ページをリロード</li>
      </ol>
      <h4 className="text-sm font-semibold">方法2: 設定から</h4>
      <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
        <li>右上の <strong>⋮</strong> → <strong>設定</strong> → <strong>プライバシーとセキュリティ</strong> → <strong>サイトの設定</strong></li>
        <li><strong>「通知」</strong>をクリック</li>
        <li>「通知の送信を許可するサイト」に <code className="rounded bg-muted px-1 py-0.5 text-xs">localhost:3000</code> を追加</li>
      </ol>
      <div className="rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
        <strong>注意:</strong> シークレットモードではデフォルトで通知がブロックされます。通常モードで試してください。
      </div>
    </div>
  );
}

function SafariGuide() {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold">Safari の設定</h4>
      <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
        <li>メニューバーの <strong>Safari</strong> → <strong>設定...</strong>（⌘,）</li>
        <li><strong>「Webサイト」</strong>タブを選択</li>
        <li>左側で<strong>「通知」</strong>を選択</li>
        <li><code className="rounded bg-muted px-1 py-0.5 text-xs">localhost</code> を<strong>「許可」</strong>に変更</li>
      </ol>
      <h4 className="text-sm font-semibold">macOS システム設定も必要</h4>
      <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
        <li><strong>システム設定</strong> → <strong>通知</strong> → <strong>Safari</strong> を選択</li>
        <li><strong>「通知を許可」</strong>をオンにする</li>
      </ol>
    </div>
  );
}

function EdgeGuide() {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold">方法1: アドレスバーから（簡単）</h4>
      <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
        <li>アドレスバー左の <strong>🔒 アイコン</strong>をクリック</li>
        <li><strong>「通知」</strong>を<strong>「許可」</strong>に変更</li>
        <li>ページをリロード</li>
      </ol>
      <h4 className="text-sm font-semibold">方法2: 設定から</h4>
      <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
        <li>右上の <strong>⋯</strong> → <strong>設定</strong> → <strong>Cookie とサイトのアクセス許可</strong></li>
        <li><strong>「通知」</strong>をクリック</li>
        <li>「許可」セクションに <code className="rounded bg-muted px-1 py-0.5 text-xs">localhost:3000</code> を追加</li>
      </ol>
    </div>
  );
}

function UnknownGuide() {
  return (
    <p className="text-sm text-muted-foreground">
      ブラウザの設定画面から、このサイトの通知を「許可」に変更してください。
    </p>
  );
}

const guides: Record<Browser, () => React.ReactNode> = {
  chrome: ChromeGuide,
  safari: SafariGuide,
  edge: EdgeGuide,
  unknown: UnknownGuide,
};

export function NotificationGuide() {
  const [browser, setBrowser] = useState<Browser>("unknown");
  const [activeTab, setActiveTab] = useState<Browser>("unknown");

  useEffect(() => {
    const detected = detectBrowser();
    setBrowser(detected);
    setActiveTab(detected);
  }, []);

  const tabs: Browser[] = ["chrome", "safari", "edge"];
  const GuideComponent = guides[activeTab];

  return (
    <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
      <h3 className="text-sm font-semibold text-destructive">
        通知の許可が必要です
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">
        一度拒否すると、ブラウザの設定から手動で変更する必要があります。
        {browser !== "unknown" && (
          <>（お使いのブラウザ: <strong>{browserLabels[browser]}</strong>）</>
        )}
      </p>

      {/* タブ切り替え */}
      <div className="mt-3 flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === tab
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {browserLabels[tab]}
            {tab === browser && " ●"}
          </button>
        ))}
      </div>

      {/* ガイド内容 */}
      <div className="mt-3">
        <GuideComponent />
      </div>

      {/* macOS 共通注意 */}
      <div className="mt-3 rounded-md bg-blue-50 border border-blue-200 px-3 py-2 text-xs text-blue-800">
        <strong>macOS の場合:</strong> ブラウザの設定に加えて、
        <strong>システム設定 → 通知 → {browserLabels[activeTab]}</strong>
        で「通知を許可」をオンにしてください。
        {activeTab !== "safari" && (
          <>
            ブラウザが複数表示される場合は、<strong>「バッジ、サウンド、デスクトップ」</strong>
            と表示されている方を有効にしてください。
          </>
        )}
      </div>
    </div>
  );
}
