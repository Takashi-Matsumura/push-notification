# Push Notification Demo

Next.js を使った通知デモアプリです。3 種類の通知方式を試すことができます。

## 機能

- **Sonner（トースト通知）** — アプリ内で表示されるトースト通知
- **Web Notification API** — OS のデスクトップ通知
- **Web Push** — Service Worker を使ったバックグラウンドプッシュ通知（Upstash Redis で購読情報を永続化）

## 技術スタック

- [Next.js](https://nextjs.org) 16
- [React](https://react.dev) 19
- [Tailwind CSS](https://tailwindcss.com) 4
- [shadcn/ui](https://ui.shadcn.com)
- [Sonner](https://sonner.emilkowal.dev)
- [web-push](https://github.com/web-push-libs/web-push)
- [Upstash Redis](https://upstash.com) — 購読情報の永続化

## ローカル開発

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開いてデモを確認できます。

Web Push 通知をローカルで動かすには `.env.local` に以下の環境変数が必要です：

```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

## Vercel へのデプロイ手順

### 1. Vercel CLI のインストールとログイン

```bash
npm i -g vercel
vercel login
```

### 2. プロジェクトのリンク

```bash
vercel link
```

### 3. VAPID キーの生成と設定

```bash
# キーペアを生成
npx web-push generate-vapid-keys --json

# Vercel の環境変数に登録
echo "<公開鍵>" | vercel env add NEXT_PUBLIC_VAPID_PUBLIC_KEY production
echo "<秘密鍵>" | vercel env add VAPID_PRIVATE_KEY production
```

### 4. Upstash Redis の追加

Vercel Marketplace から Upstash Redis を追加します。`KV_REST_API_URL` と `KV_REST_API_TOKEN` が自動で設定されます。

```bash
vercel integration add upstash/upstash-kv
```

### 5. デプロイ

```bash
vercel --prod
```

### 6. ローカル環境変数の同期

Vercel に設定した環境変数をローカルに引っ張ってくることもできます：

```bash
vercel env pull .env.local
```

## Vercel 環境での注意点

Vercel のサーバーレス環境（Vercel Functions）では、関数インスタンスがリクエストごとに起動・破棄される可能性があります。そのため **インメモリでのデータ保持は信頼できません**。

Web Push の購読情報は Upstash Redis（サーバーレス対応の Redis）に保存することで、異なる関数インスタンス間でもデータを共有できるようにしています。

## 動作状況

| 通知方式 | ローカル | Vercel |
|----------|----------|--------|
| Sonner（トースト） | OK | OK |
| Web Notification API | OK | OK |
| Web Push | OK | 未解決 |

### Web Push の既知の問題

Vercel 環境で Web Push のサーバー送信は成功（`sent: 1`）するが、ブラウザに通知が届かない現象を確認中。DevTools の Service Worker から直接 Push した場合は通知が表示されるため、Service Worker 自体は正常に動作している。サーバーからプッシュサービス（FCM）経由でブラウザに届くまでの経路に問題がある可能性がある。
