# SaaS Starter Kit with Supabase, Next.js, and Stripe (App Router)

このリポジトリは、Supabase、Next.js (App Router)、Stripe を使用して構築された SaaS アプリケーションのスターターキットです。
認証、データベース、支払い処理などの基本的な機能を備えており、SaaS アプリケーションの開発を迅速に開始できます。

## 技術スタック

- **Next.js (App Router):** React フレームワーク。サーバーサイドレンダリング、ルーティング、データフェッチを効率的に行うための新しい App Router を採用しています。
- **Supabase:** オープンソースの Firebase の代替となる BaaS (Backend-as-a-Service)。PostgreSQL データベース、認証、ストレージなどを提供します。
- **Stripe:** オンライン決済プラットフォーム。サブスクリプションや単発の支払い処理を容易にします。
- **TypeScript:** JavaScript のスーパーセット。型安全性とコードの保守性を向上させます。

## セットアップ

### 前提条件

- Node.js (v18 以上)
- npm または yarn
- Supabase アカウント
- Stripe アカウント

### 手順

1. **リポジトリのクローン:**

   ```bash
   git clone [リポジトリのURL]
   cd [リポジトリ名]
   ```

2. **依存関係のインストール:**

   ```bash
   npm install
   # または
   yarn install
   ```

3. **環境変数の設定:**

   `.env.local` ファイルを作成し、以下の環境変数を設定します。

   ```env
   NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=YOUR_STRIPE_PUBLISHABLE_KEY
   ```

   - `YOUR_SUPABASE_URL` と `YOUR_SUPABASE_ANON_KEY` は、Supabase プロジェクトの設定から取得できます。
   - `YOUR_STRIPE_SECRET_KEY` と `YOUR_STRIPE_PUBLISHABLE_KEY` は、Stripe ダッシュボードから取得できます。

4. **Supabase データベースのセットアップ:**

   Supabase プロジェクトで、必要なテーブルとスキーマを作成します。このスターターキットでは、`users` テーブルと `subscriptions` テーブルが使用されます。

5. **Stripe の設定:**

   Stripe ダッシュボードで、製品と価格を設定します。このスターターキットでは、サブスクリプションプランが使用されます。

6. **開発サーバーの起動:**

   ```bash
   npm run dev
   # または
   yarn dev
   ```

   ブラウザで `http://localhost:3000` にアクセスしてアプリケーションを確認します。

## 機能

- **認証:** Supabase Auth を使用したユーザー登録、ログイン、ログアウト。
- **サブスクリプション:** Stripe を使用したサブスクリプションの作成、管理、キャンセル。
- **ユーザー管理:** ユーザープロフィールの表示と編集。
- **ダッシュボード:** ユーザーのサブスクリプション状況の表示。

## ディレクトリ構造

```
├── app/              # Next.js App Router のルートディレクトリ
│   ├── api/          # API エンドポイント
│   ├── auth/         # 認証関連のページ
│   ├── dashboard/    # ダッシュボード関連のページ
│   ├── components/   # React コンポーネント
│   ├── lib/          # ユーティリティ関数と Supabase クライアント
│   └── layout.tsx    # ルートレイアウト
│   └── page.tsx      # ホームページ
├── styles/           # スタイルシート
├── .env.local        # 環境変数
├── package.json
└── README.md
```

## カスタマイズ

- **UI の変更:** `app/components` ディレクトリ内の React コンポーネントを編集して、UI をカスタマイズできます。
- **機能の追加:** `app/api` ディレクトリに新しい API エンドポイントを追加して、新しい機能を追加できます。
- **データベースの変更:** Supabase プロジェクトでデータベーススキーマを変更して、アプリケーションの要件に合わせて調整できます。
- **ルーティングの変更:** `app` ディレクトリ内のファイル構造を変更して、ルーティングをカスタマイズできます。

## 今後の開発

- テストの追加
- より高度なサブスクリプション管理機能
- その他の機能

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

