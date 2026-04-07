"use client";

import { toast } from "sonner";

export function SonnerDemo() {
  const handlePromise = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: "読み込み中...",
        success: "正常に完了しました！",
        error: "エラーが発生しました",
      }
    );
  };

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-card-foreground">
        アプリ内通知（Sonner）
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        ブラウザ内にトースト通知を表示します。
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          onClick={() => toast("イベントが作成されました")}
        >
          Default
        </button>
        <button
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          onClick={() => toast.success("保存に成功しました！")}
        >
          Success
        </button>
        <button
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          onClick={() => toast.error("エラーが発生しました")}
        >
          Error
        </button>
        <button
          className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
          onClick={() => toast.warning("入力内容を確認してください")}
        >
          Warning
        </button>
        <button
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          onClick={() => toast.info("新しいアップデートがあります")}
        >
          Info
        </button>
        <button
          className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
          onClick={handlePromise}
        >
          Promise
        </button>
        <button
          className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
          onClick={() =>
            toast("ファイルがアップロードされました", {
              description: "report_2024.pdf (2.4 MB)",
            })
          }
        >
          説明付き
        </button>
        <button
          className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
          onClick={() =>
            toast("メッセージを削除しますか？", {
              action: {
                label: "元に戻す",
                onClick: () => toast.success("元に戻しました"),
              },
            })
          }
        >
          アクション付き
        </button>
      </div>
    </section>
  );
}
