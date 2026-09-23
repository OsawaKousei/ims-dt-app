# ワークスペース初期化レビュー

確認日: 2026-09-23。対象: Linux 上のフロントエンド開発と AI 向け作業環境。

## 評価

当初は lint とフロントエンドビルドは成功しましたが、AI 向け指示の参照切れと検証基盤の不足がありました。
今回の修正により、フロントエンド開発を開始し、変更を機械的に検証できる状態にしています。
アプリケーション固有の要件・機能設計はまだありません。製品版デスクトップのリリース準備完了を意味しません。

## 指摘と対応

| 優先度 | 対象             | 確認した問題・判断                                                                                             | 対応                                                                                             |
| ------ | ---------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 高     | AI 指示          | AGENTS.md の 4 つのパスが実在しない                                                                            | 既存の文書名に合わせて参照を修正                                                                 |
| 高     | テスト           | 指針で指定された runner / DOM テストライブラリと実行コマンドがない                                             | Vitest、jsdom、React Testing Library、user-event、jest-dom を導入                                |
| 高     | ブラウザ動作     | 初期フォームが Tauri invoke に依存し、Chrome で失敗する                                                        | ローカル UI 操作に変更し、送信・空入力の回帰テストを追加                                         |
| 中     | 型検査           | 指針の noUncheckedIndexedAccess / noImplicitReturns / exactOptionalPropertyTypes が未設定                      | アプリ設定に追加                                                                                 |
| 中     | 設定の型検査     | 通常の tsc では参照先 Vite 設定の検査を保証できず、Node 型も抑制コメントで回避                                 | @types/node を導入し、アプリ・ツール設定を個別に検査                                             |
| 中     | ESLint           | 文書が許容する class / interface / 制御構文まで一律禁止し、無関係な Next.js / shadcn / Playwright の除外がある | 文書の方針に合わせて簡素化。ブラウザと Node のグローバルも分離                                   |
| 中     | 品質ゲート       | typecheck / test / format:check / CI がない                                                                    | npm run check と GitHub Actions を追加                                                           |
| 中     | セキュリティ設定 | CSP が null、.env の一般的な除外がない                                                                         | Tauri の本番・開発 CSP と .env* の除外を追加                                                     |
| 中     | 操作性           | 入力ラベルなし、キーボードのフォーカス輪郭を削除している                                                       | label / status / focus-visible と狭幅での折り返しを追加                                          |
| 低     | セットアップ     | README がテンプレートの説明だけ                                                                                | 環境・コマンド・構造・テスト・AI 作業手順を記載                                                  |
| 低     | エディタ         | Tailwind 未導入なのに拡張を推奨、Rust にも既定の Prettier が適用される                                         | 不要な推奨を外し、Vitest・ローカル TS SDK・Rust formatter を設定                                 |
| 低     | 資料整理         | 現行文書とローカル旧資料の役割が不明瞭                                                                         | 現行は guidelines、旧資料は archive、レビューは reviews と明文化。履歴文書は移動・削除していない |

## 依存関係と構成の判断

- React / Vite / TypeScript / ESLint / Tauri の既存依存は整合しており、一括更新は不要でした。
- `.node-version` と実行環境は Node 24.21.0 で一致。npm の lockfile は管理済みです。package.json に対応範囲を記載しました。
- TanStack Query / Zustand / Zod は規範に登場しますが、利用する API・共有状態・外部入力がまだないため機能追加時に導入します。
- ルーター、UI フレームワーク、Tailwind、Playwright、MSW、カバレッジ基盤は現状の要件からは必須ではありません。
- 初期画面だけの段階で空の features / routes / shared を作る必要はありません。機能追加時に責務に沿って配置します。
- Rust のサンプル greet、opener プラグイン、対応する既存権限・npm 依存は残っています。フロントエンドは利用しなくなりましたが、ネイティブ実装整理は現在の作業範囲外です。
- Git 管理対象の初期状態はクリーンでした。既存のローカル旧資料を削除していません。

## AI 実行環境

`.codex/config.toml` の workspace-write / on-request / live web search は
[公式設定リファレンス](https://learn.chatgpt.com/docs/config-file/config-reference) にある設定です。
プロジェクトファイルだけで、実行環境が強制する承認・サンドボックス設定を上書きできるわけではありません。
今回はサンドボックスの起動が `mountinfo path is not absolute` で失敗し、シェル操作には実行環境の承認経路を使用しました。
この起動障害はプロジェクト設定の修正では解消しておらず、通常の AI 作業効率に関わる環境側の残件です。

ファイル移動・削除を含む広い一括修正は自動承認レビューで拒否され、未実行です。
代わりに既存パスを保ち、参照修正と個別の設定修正を実施しました。

このセッションには Chrome DevTools の MCP ツールは公開されていませんでした。
インストール済み Chrome の DevTools Protocol を一時プロファイルで操作し、ブラウザ検証を実施しています。
恒久的なブラウザ接続・MCP 設定は今回追加していません。

## 検証範囲と残件

- ロックファイルからの `npm ci`、`npm run check`（型・lint・テスト 2 件・整形）、`npm run build`、`git diff --check` はすべて成功しました。`npm audit` は既知の脆弱性 0 件でした。
- DOM テスト 2 件: 名前を入力して送信、空白入力を Enter で送信。
- Chrome: 名前入力、Enter 送信、ボタン操作、800 / 375 px 幅での横方向のはみ出しとスクロール後の操作到達性を確認。コンソール例外・警告・通信失敗はありませんでした。
- `tauri info`: Rust / Cargo / WebKitGTK 等の環境要件を確認。Tauri 設定も認識されています。
- GitHub 上の CI 実行、Tauri 本番ビルド・WebView での CSP / HMR、Windows 固有動作は未検証です。CSP は通常の Vite ブラウザ画面には注入されません。
- `TAURI_DEV_HOST` を使う場合は開発 CSP に当該ホストと HMR ポートを追加する必要があります。
- ピクセル・配色等のデザイン品質は人間の目視確認が必要です。
- アプリ名・アイコン・Cargo の authors / description はテンプレート要素を含み、製品仕様確定時に整備します。

テスト構成は [Vitest](https://vitest.dev/guide/) と [Testing Library](https://testing-library.com/docs/react-testing-library/setup/)、
CSP は [Tauri の公式説明](https://v2.tauri.app/security/csp/)、
CI は [checkout](https://github.com/actions/checkout) と [setup-node](https://github.com/actions/setup-node) の公式設定を参照しています。
