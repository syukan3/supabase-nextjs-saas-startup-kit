# SaaS Starter Kit with Supabase, Next.js, and Stripe (App Router)

このリポジトリは、Supabase、Next.js (App Router)、Stripe を使用して構築された SaaS アプリケーションのスターターキットです。
認証、データベース、支払い処理などの基本的な機能を備えており、SaaS アプリケーションの開発を迅速に開始できます。

---

## 主な特徴

- **認証機能 (Supabase Auth)**  
  メール・パスワード、OAuth などを簡単に実装可能
- **サブスクリプション課金 (Stripe)**  
  月額や年額など、柔軟なサブスクプランの運用が可能
- **国際化 (i18n)**  
  `react-i18next` を利用し、日本語・英語など多言語サポートに対応
- **ダークモード対応**  
  `next-themes` を使い、ライト/ダーク/システムテーマを簡単切り替え
- **Tailwind CSS**  
  ユーザーインタフェースを素早くカスタマイズしやすい設計
- **TypeScript**  
  型安全で保守性の高いコードベース

---

## 技術スタック

- **Next.js 15+ (App Router)**
- **Supabase** (認証、データベース、ストレージ)
- **Stripe** (課金・決済処理)
- **React 19+ / TypeScript 5+**
- **Tailwind CSS**
- その他、Radix UI、Lucide Icons、i18n、ESLint など

---

## セットアップ方法

### 1. リポジトリをクローン

```bash
git clone https://github.com/syukan3/supabase-nextjs-saas-startup-kit.git
cd supabase-nextjs-saas-startup-kit
```

### 2. パッケージをインストール

```bash
npm install
# または
yarn install
```

### 3. 環境変数を設定

ルートに `.env.local` ファイルを作成し、以下の変数を設定してください。

```
# サイトのURL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_PRICE_ID=your_stripe_price_id
```

> **Note:** `YOUR_SUPABASE_URL`・`YOUR_SUPABASE_ANON_KEY` は Supabase プロジェクトから取得し、  
> `YOUR_STRIPE_SECRET_KEY`・`YOUR_STRIPE_PUBLISHABLE_KEY` は Stripe ダッシュボードから取得してください。

### 4. Supabase プロジェクトの準備

- Supabase CLI を利用する場合:
  - ローカル環境構築:
    ```bash
    supabase login
    supabase link --project-ref <project-id>
    supabase start
    ```
  - マイグレーション作成:
    ```bash
    supabase migration new <migration_name>
    ```
  - ローカル環境へマイグレーションを適用 (docker が起動している必要あり):
    ```bash
    supabase db reset
    ```
  - 本番環境へマイグレーションを適用:
    ```bash
    supabase db push
    ```
  - 本番環境へマイグレーションを適用 (dry-run):
    ```bash
    supabase db push --dry-run
    ```
  - 本番環境のマイグレーションをリバート:
    ```bash
    supabase migration repair --status reverted
    ```
- あるいは、既存の Supabase プロジェクトをお持ちの場合は、プロジェクトの URL と API キーを `.env.local` に設定し、`migrations/` の内容を手動または CLI で反映してください。

### 5. Stripe の設定

- Stripe ダッシュボードで「製品」や「価格 (Price)」を作成し、`stripe_price_id` 等を Supabase のテーブルに登録します。
- Webhook 等が必要な場合は適宜設定してください。

### 6. 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスするとアプリが表示されます。

---

## 使い方の概要

1. **ログイン**  
   ホームページまたは `/login` ページからユーザー登録/ログインを行います。  
2. **認証ルール**  
   `middleware.ts` と `utils/supabase/middleware.ts` で認証状態が管理され、未ログイン時は `/login` にリダイレクトされる仕組みになっています。  
3. **ダッシュボード**  
   ログイン後は `/dashboard` にアクセス可能。ユーザーごとのデータやサブスクリプション状況を表示できます。  
4. **サブスクリプション管理**  
   Stripe と連携し、必要に応じて課金処理、プラン変更、キャンセルなどを実装できます。

---

## カスタマイズ

- **UI/デザイン**: `components/` ディレクトリ直下、および `ui/` サブディレクトリ内のコンポーネントを編集してください。  
- **国際化 (i18n)**: `public/locales/` に言語別の JSON を配置、`app/i18n-provider.tsx` 内の設定を調整して追加言語をサポート可能です。  
- **データベース**: `supabase/migrations/` でテーブルスキーマを管理しています。必要に応じてテーブルの追加・変更を行ってください。  
- **API/サーバーサイドロジック**: 新しいエンドポイントを作る場合は、`app/` 配下に Route Handler (`route.ts`) を追加します。

---

## 今後のロードマップ

- E2E/Unit テストの追加 (Jest, Playwright 等)
- Stripe Webhook を使ったリアルタイムなサブスクリプション更新管理
- 管理画面 (Admin ページ) の拡充
- イベント監視やカスタム通知機能の強化
