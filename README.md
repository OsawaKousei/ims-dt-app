# ims-dt-app

React + TypeScript + Vite のフロントエンドを Tauri で動かすデスクトップアプリです。
現在はフロントエンドの初期開発段階です。

## セットアップ

Node.js は `.node-version` のバージョン、npm は 11 系を使用します。
依存関係の再現にはコミット済みの `package-lock.json` を使用してください。

```sh
npm ci
npm run dev
```

ブラウザで <http://localhost:1420> を開きます。フロントエンド開発だけなら Rust は不要です。
1420 番ポートが使用中の場合は起動に失敗します。Tauri と URL を揃えるための設定です。

デスクトップ実行には Rust と OS ごとの依存パッケージが必要です。
環境は `npm run tauri -- info` で確認できます。

```sh
npm run tauri -- dev
npm run tauri -- build
```

## 開発・検証コマンド

| コマンド               | 用途                                         |
| ---------------------- | -------------------------------------------- |
| `npm run typecheck`    | アプリ・テスト・Vite/Vitest 設定の型チェック |
| `npm run lint`         | ESLint。警告も失敗として扱う                 |
| `npm test`             | テストを一度だけ実行                         |
| `npm run test:watch`   | 変更を監視してテスト                         |
| `npm run format`       | Prettier による整形                          |
| `npm run format:check` | ファイルを書き換えず整形を検査               |
| `npm run check`        | 型・lint・テスト・整形をまとめて検査         |
| `npm run build`        | 型チェック後にフロントエンドをビルド         |
| `npm run preview`      | ビルド済みフロントエンドをブラウザで確認     |

GitHub Actions は push / pull request 時に `npm ci`、`npm run check`、`npm run build` を実行します。
Tauri のネイティブビルドと署名・配布は、この CI の対象外です。

## 構成と AI との開発

- `AGENTS.md`: AI 向けの作業範囲・ガイドラインの入口。
- `docs/guidelines/`: 現行の規範。作業に関係する文書を参照します。
- `docs/reviews/`: レビュー結果・確認範囲。
- `docs/archive/`: ローカルの旧資料。Git 管理と規範の対象外です。
- `src/App.tsx`: 初期画面。現在の挨拶フォームはローカル UI 状態だけで動作します。
- `src/test/setup.ts`: Testing Library のマッチャーとテスト後のクリーンアップ。
- `src-tauri/`: 既存のデスクトップランタイム。Rust 機能追加は明示的な依頼時に扱います。

機能が増えたら `src/features/<feature>/` にコードとテストをまとめます。
必要に応じて `src/app/` に構成処理、`src/routes/` にルート、`src/shared/` に実際に共有するコードを置きます。
空のディレクトリや未使用の抽象化は先に作りません。
UI の責務は Layout → Widget → Pure View に分離します。

テストは対象の隣に `*.test.ts` / `*.test.tsx` として配置します。
既定環境は Node、DOM テストの先頭には `// @vitest-environment jsdom` を付けます。
Vitest の API は明示的に import します。
UI 変更時には Chrome で操作、コンソール、通信、レイアウトも確認してください。
利用可能なエージェントツールがなければ、ブラウザ検証未実施と明記します。

AI への依頼には、実現したい操作・受け入れ条件・対象範囲を記載すると進めやすくなります。
完了時は `npm run check` と必要なビルド・ブラウザ検証の結果を確認します。
`.codex/config.toml` はプロジェクト用の設定です。実際の承認・サンドボックス制約には実行環境側の設定も適用されます。

## 機能追加時に導入するもの

- 外部 API / 非同期リソース: TanStack Query。
- 複数 Widget にまたがるクライアント状態: Zustand。
- 外部データや環境変数の実行時検証: Zod。フロントエンド設定は `src/env.ts` に集約。

現時点では上記の利用箇所がないため未導入です。
`VITE_*` は利用者に見える公開情報です。秘密鍵・パスワード・API シークレットを含めないでください。
`.env*` は Git から除外し、共有用の公開設定例だけ `.env.example` に置けます。

Tauri の CSP はローカル資源と既存 IPC を許可し、開発時だけ localhost の Vite / WebSocket を追加しています。
外部 API を追加する際は、必要な HTTPS オリジンだけ `csp` / `devCsp` の `connect-src` に追加してください。
`TAURI_DEV_HOST` を使った別ホスト・1421 番ポートの HMR は、その開発オリジンの明示追加が必要です。
CSP の最終動作は Tauri WebView でも確認してください。

初期レビューの詳細は [ワークスペースレビュー](docs/reviews/workspace-initialization.md) を参照してください。
