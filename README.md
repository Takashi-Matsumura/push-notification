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
| Web Push | OK | OK |

### 検証済みプラットフォーム

| OS | ブラウザ | Web Push |
|----|----------|----------|
| macOS | Chrome | OK |
| macOS | Safari | OK |
| Windows | Chrome | OK |
| Windows | Edge | OK（通知の手動許可が必要） |

## ブラウザの通知許可設定

Web Push を受信するには、ブラウザで通知を許可する必要があります。「プッシュ通知を購読する」ボタンを押した際に許可ダイアログが表示されない場合は、以下の手順で手動設定してください。

### macOS Chrome

1. アドレスバー左の鍵アイコン（またはスライダーアイコン）をクリック
2. 「通知」を「許可」に変更
3. macOS の **システム設定 → 通知 → Google Chrome** で通知が有効になっていることを確認

### macOS Safari

1. Safari メニュー → **設定 → Webサイト → 通知** で該当サイトを「許可」に設定
2. macOS の **システム設定 → 通知 → Safari** で通知が有効になっていることを確認

### Windows Chrome

- 購読時に表示される許可ダイアログで「許可」をクリック
- 表示されない場合：アドレスバー左の鍵アイコン → 「通知」を「許可」に変更

### Windows Edge

Edge では購読時に許可ダイアログが表示されない場合があります。事前に手動で許可設定が必要です：

1. `edge://settings/content/notifications` をアドレスバーに入力
2. 「通知の送信が許可されています」の「サイトの追加」をクリック
3. デプロイ先の URL を追加

> **注意:** 組織のポリシーで通知が制限されている場合、Edge では通知を受け取れない場合があります。

## Web Push の仕組み

- 「テスト通知を送信」は Redis に保存された**全購読者**にブロードキャスト送信します
- 複数のブラウザ・デバイスで購読すると、すべてに通知が届きます
- 特定のブラウザへの通知を止めたい場合は、そのブラウザで「購読を解除」してください（Redis からエンドポイントが削除されます）
- macOS では Safari を終了していても、OS の通知システム（APNs）経由でプッシュ通知が届きます
