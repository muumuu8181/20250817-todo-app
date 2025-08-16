# 📚 ドキュメント総合インデックス
最終更新: 2025-01-10

## 🎯 初心者向け - まずはここから

### 📖 必ず読むべきドキュメント（順番通りに）
1. **[プロジェクトREADME](../README.md)** - プロジェクト全体の概要
2. **[AI開発ルール](ai-development/AI_DEVELOPMENT_RULES.md)** - ⚠️ **AI必読！サブエージェント使用ルール**
3. **[使用方法ガイド](guides/HOW_TO_USE_TEMPLATE.md)** - テンプレートの基本的な使い方
4. **[必須要件](guides/MANDATORY_REQUIREMENTS.md)** - 守るべきルールと制約

### 🚀 セットアップ手順（この順番で）
1. **[Firebase設定ガイド](setup/FIREBASE_SETUP_GUIDE.md)** - Firebaseの初期設定
2. **[Google認証実装](setup/GOOGLE_AUTH_IMPLEMENTATION_SUMMARY.md)** - 認証の設定方法
3. **[GitHub Pages設定](setup/GITHUB_PAGES_MANUAL.md)** - Web公開の手順

---

## 📁 フォルダ構成（詳細）

### 📖 guides/ - 使い方ガイド
| ファイル名 | 説明 | 対象者 |
|-----------|------|--------|
| [HOW_TO_USE_TEMPLATE.md](guides/HOW_TO_USE_TEMPLATE.md) | テンプレートの基本的な使い方 | 🔰 初心者 |
| [COMPONENT_GUIDE.md](guides/COMPONENT_GUIDE.md) | UIコンポーネントの作成方法 | 👨‍💻 開発者 |
| [CUSTOMIZATION_GUIDE.md](guides/CUSTOMIZATION_GUIDE.md) | カスタマイズ方法（TODO/メモアプリへの変換） | 👨‍💻 開発者 |
| [MANDATORY_REQUIREMENTS.md](guides/MANDATORY_REQUIREMENTS.md) | 必須要件とルール | 🔰 全員必読 |
| [TUTORIAL_STRETCH_APP.md](guides/TUTORIAL_STRETCH_APP.md) | ストレッチアプリ作成チュートリアル | 📚 学習者 |
| [UI_SIMPLIFICATION_PLAN.md](guides/UI_SIMPLIFICATION_PLAN.md) | UI簡素化の計画 | 🎨 デザイナー |

### 🔧 setup/ - セットアップガイド
| ファイル名 | 説明 | 重要度 |
|-----------|------|--------|
| [FIREBASE_SETUP_GUIDE.md](setup/FIREBASE_SETUP_GUIDE.md) | Firebase初期設定 | ⭐⭐⭐ |
| [REAL_FIREBASE_SETUP_REQUIRED.md](setup/REAL_FIREBASE_SETUP_REQUIRED.md) | 実際のFirebase設定が必要な理由 | ⭐⭐ |
| [GOOGLE_AUTH_IMPLEMENTATION_SUMMARY.md](setup/GOOGLE_AUTH_IMPLEMENTATION_SUMMARY.md) | Google認証の実装詳細 | ⭐⭐⭐ |
| [GITHUB_PAGES_MANUAL.md](setup/GITHUB_PAGES_MANUAL.md) | GitHub Pagesへのデプロイ方法 | ⭐⭐ |

### 🐛 issues/ - 既知の問題（NEW!）
| ファイル名 | 説明 | 状態 |
|-----------|------|------|
| [20250110_documentation_inconsistencies.md](issues/20250110_documentation_inconsistencies.md) | ドキュメントの不整合問題 | 🔧 修正済 |
| [20250110_grid_nesting_problem.md](issues/20250110_grid_nesting_problem.md) | グリッド入れ子構造の問題 | ✅ v0.2.3で修正済 |

### ✅ fixes/ - 修正履歴（NEW!）
| ファイル名 | 説明 | 日付 |
|-----------|------|------|
| [20250110_v022_documentation_update.md](fixes/20250110_v022_documentation_update.md) | v0.2.2ドキュメント更新 | 2025-01-10 |

### 📜 history/ - 開発履歴
- **[INCIDENT_REPORT.md](history/INCIDENT_REPORT.md)** - 過去の問題と解決策

### 🤖 ai-development/ - AI開発ルール（NEW!）
| ファイル名 | 説明 | 重要度 |
|-----------|------|--------|
| [AI_DEVELOPMENT_RULES.md](ai-development/AI_DEVELOPMENT_RULES.md) | AI開発の基本ルール | ⭐⭐⭐ |
| [AI_SPECIFIC_GUIDE.md](ai-development/AI_SPECIFIC_GUIDE.md) | Claude Code/Codex/Cursor別対応 | ⭐⭐⭐ |
| [SUBAGENT_GUIDE.md](ai-development/SUBAGENT_GUIDE.md) | サブエージェント呼び出しガイド（Claude Code専用） | ⭐⭐⭐ |
| [VERSION_RULES.md](ai-development/VERSION_RULES.md) | バージョン管理ルール（+0.01システム） | ⭐⭐⭐ |
| [GITHUB_PUBLISH_GUIDE.md](ai-development/GITHUB_PUBLISH_GUIDE.md) | GitHub Pages Web公開手順 | ⭐⭐⭐ |

### 💬 ai-conversations/ - AI開発会話ログ
- GPTやClaudeとの開発会話の記録（タイムスタンプ付き）
- **[PARALLEL_WORK_INSTRUCTIONS.md](ai-conversations/PARALLEL_WORK_INSTRUCTIONS.md)** - 並列作業の指示書

### 📦 archive/ - アーカイブ
- 過去のバージョンや参考資料

### 🎯 demo/ - デモ・サンプル
- **[firebase-demo-config.html](demo/firebase-demo-config.html)** - Firebase設定のデモ

---

## 📝 ドキュメント作成ルール

### ⚠️ 重要：新しいドキュメントを作成する前に必読！
**[📋 DOCUMENTATION_RULES.md](DOCUMENTATION_RULES.md)** - ドキュメント作成・管理のルール

### 基本原則
1. **既存ファイルの更新を優先** - 新規作成は最小限に
2. **適切な場所に配置** - プロジェクトルートに散らかさない
3. **命名規則を守る** - issues/fixes/は `YYYYMMDD_<name>.md` 形式

### フォルダごとの役割
- **guides/** → 恒久的な使い方ガイド
- **setup/** → インストール・設定手順
- **issues/** → 問題・バグレポート（日付付き）
- **fixes/** → 修正記録（日付付き）
- **history/** → 重要な履歴
- **archive/** → 古い資料

---

## 🔍 よくある質問（FAQ）

### Q: どこから始めればいい？
**A:** 上記の「初心者向け」セクションの順番通りに読んでください。

### Q: エラーが出た時は？
**A:** まず [`issues/`](issues/) フォルダを確認。既知の問題かもしれません。

### Q: カスタマイズしたい
**A:** [`CUSTOMIZATION_GUIDE.md`](guides/CUSTOMIZATION_GUIDE.md) を参照してください。

### Q: ドキュメントが見つからない
**A:** このファイル（docs/README.md）で Ctrl+F 検索してください。

---

## 🚨 トラブルシューティング

問題が発生した場合の確認順序：

1. **[issues/](issues/)** - 既知の問題を確認
2. **[history/INCIDENT_REPORT.md](history/INCIDENT_REPORT.md)** - 過去の類似問題
3. **[fixes/](fixes/)** - 修正履歴から解決策を探す
4. **[archive/](archive/)** - 古い資料も参考に

---

## 🔄 更新履歴

- **2025-01-10**: ドキュメント総合インデックスに全面改訂
- **2025-01-10**: issues/fixes/ディレクトリ追加
- **2025-01-10**: DOCUMENTATION_RULES.md 追加