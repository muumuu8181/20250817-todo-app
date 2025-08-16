# 🤖 サブエージェント呼び出しガイド

## 📌 基本原則
**すべての作業において、まず適切なサブエージェントの呼び出しを検討してください。**

---

## 🎯 サブエージェント一覧と詳細

### 1. softengineer-expert
**ソフトウェア作成のプロフェッショナル**

#### 得意分野
- 新機能の設計と実装
- アーキテクチャ設計
- パフォーマンス最適化
- 大規模リファクタリング

#### 呼び出し例
```
Task tool: softengineer-expert
Description: 新機能実装
Prompt: "カレンダー機能を実装してください。
        要件：
        1. src/custom/templates/calendar-app/を作成
        2. 月表示・週表示の切り替え
        3. イベントのCRUD操作
        4. Firebaseとの連携"
```

---

### 2. problem-sleuth-engineer
**問題を1ステップずつ確実に解決**

#### 得意分野
- バグの原因調査
- エラーメッセージの解析
- 段階的なデバッグ
- 最小実行での問題再現

#### 呼び出し例
```
Task tool: problem-sleuth-engineer
Description: バグ修正
Prompt: "ユーザーがログアウトできない問題を解決してください。
        症状：
        - ログアウトボタンクリック後も認証状態が維持される
        - コンソールエラー: 'signOut is not a function'
        - 発生環境: Chrome最新版
        最小実行で問題を特定し、修正してください。"
```

---

### 3. Code Reviewer
**セキュリティとベストプラクティスの番人**

#### 得意分野
- セキュリティ脆弱性の検出
- コード品質チェック
- ベストプラクティスの適用確認
- パフォーマンス問題の指摘

#### 呼び出し例
```
Task tool: Code Reviewer
Description: セキュリティレビュー
Prompt: "src/services/auth.jsのセキュリティレビューを実施してください。
        チェック項目：
        1. 認証トークンの取り扱い
        2. XSS脆弱性
        3. SQLインジェクション対策
        4. 機密情報の露出"
```

---

### 4. doc-writer
**ドキュメント生成のスペシャリスト**

#### 得意分野
- README作成
- APIドキュメント
- ユーザーガイド
- 技術仕様書

#### 呼び出し例
```
Task tool: doc-writer
Description: ドキュメント作成
Prompt: "新しく実装したカレンダー機能のドキュメントを作成してください。
        作成場所: docs/guides/CALENDAR_FEATURE.md
        含める内容：
        1. 機能概要
        2. 使用方法（スクリーンショット付き）
        3. カスタマイズ方法
        4. APIリファレンス"
```

---

### 5. doc-reader
**ドキュメントを忠実に読み込む**

#### 得意分野
- 仕様書の正確な理解
- 要件の抽出
- ドキュメント間の整合性確認
- 既存資料の分析

#### 呼び出し例
```
Task tool: doc-reader
Description: 仕様確認
Prompt: "docs/requirements/にある全ての要件ドキュメントを読み込み、
        実装済み/未実装の機能リストを作成してください。
        出力形式：
        - チェックリスト形式
        - 優先度付き
        - 実装難易度の見積もり付き"
```

---

### 6. task-splitter
**大きなタスクを管理可能な単位に分割**

#### 得意分野
- 複雑なプロジェクトの分解
- 依存関係の整理
- 作業順序の最適化
- マイルストーン設定

#### 呼び出し例
```
Task tool: task-splitter
Description: タスク分割
Prompt: "ECサイト機能の実装を分割してください。
        全体要件：
        - 商品カタログ
        - ショッピングカート
        - 決済システム
        - 在庫管理
        各タスクを実装可能な単位に分割し、
        依存関係と推定工数を明記してください。"
```

---

### 7. agents-manager
**複数のサブエージェントを統括**

#### 得意分野
- 並列作業の調整
- エージェント間の連携
- 結果の統合
- 進捗管理

#### 呼び出し例
```
Task tool: agents-manager
Description: 複数エージェント管理
Prompt: "以下の作業を並列で実行してください：
        1. softengineer-expert: 新機能実装
        2. doc-writer: ドキュメント作成
        3. Code Reviewer: 既存コードのレビュー
        各エージェントの結果を統合し、
        最終レポートを作成してください。"
```

---

### 8. general-purpose
**汎用的なタスク処理**

#### 得意分野
- 調査・リサーチ
- データ分析
- 一般的なコーディング
- その他の雑務

#### 呼び出し例
```
Task tool: general-purpose
Description: 調査タスク
Prompt: "競合サービスの機能調査を実施してください。
        調査対象：
        - Notion
        - Todoist
        - Evernote
        比較項目：
        - 主要機能
        - 料金体系
        - 技術スタック"
```

---

## 🔄 サブエージェントの連携パターン

### パターン1: 順次実行
```
1. doc-reader（仕様確認）
   ↓
2. task-splitter（タスク分割）
   ↓
3. softengineer-expert（実装）
   ↓
4. Code Reviewer（レビュー）
   ↓
5. doc-writer（ドキュメント作成）
```

### パターン2: 並列実行
```
agents-manager
├── softengineer-expert（機能A実装）
├── softengineer-expert（機能B実装）
└── doc-writer（ドキュメント作成）
```

### パターン3: 問題解決フロー
```
1. problem-sleuth-engineer（問題調査）
   ↓
2. softengineer-expert（修正実装）
   ↓
3. Code Reviewer（修正確認）
```

---

## 📝 呼び出し時のベストプラクティス

### 1. 明確な指示を与える
```
良い例：
"src/custom/templates/todo-app/のconfig.jsに
優先度フィールドを追加し、
high/medium/lowの3段階で設定可能にしてください。"

悪い例：
"TODOアプリを改善してください。"
```

### 2. 必要な情報を提供
```
- エラーメッセージの全文
- 発生条件
- 期待される動作
- 現在の動作
- 関連ファイルのパス
```

### 3. 成果物を明確に指定
```
"以下を成果物として作成してください：
1. 実装コード（src/features/calendar.js）
2. テストコード（tests/calendar.test.js）
3. ドキュメント（docs/guides/CALENDAR.md）"
```

---

## 🚨 エラー時の対処

### サブエージェントが応答しない場合
1. **再試行**: 1回だけ再度呼び出しを試みる
2. **代替エージェント**: 別の適切なエージェントを試す
3. **直接実行**: 自身で作業を実行
4. **記録**: `docs/ai-conversations/`に状況を記録

### エラーメッセージ例と対処
```
"Task tool is not available"
→ デバイス設定を確認、直接実行に切り替え

"Agent timeout"
→ タスクを小さく分割して再試行

"Invalid prompt format"
→ プロンプトの形式を確認して修正
```

---

## 📊 効果測定

### サブエージェント利用の記録
```markdown
<!-- docs/ai-conversations/YYYYMMDD_task.md -->
## タスク概要
カレンダー機能の実装

## 使用サブエージェント
- task-splitter: タスク分割（成功）
- softengineer-expert: 実装（成功）
- doc-writer: ドキュメント作成（成功）

## 結果
- 実装時間: 2時間
- 品質: レビュー指摘事項なし
- 効果: 単独作業比3倍の速度
```

---

## 🎯 選択クイックリファレンス

| やりたいこと | 使うべきエージェント |
|------------|-------------------|
| 新機能を作る | softengineer-expert |
| バグを直す | problem-sleuth-engineer |
| コードを確認 | Code Reviewer |
| 文書を書く | doc-writer |
| 仕様を理解 | doc-reader |
| 複雑なタスク | task-splitter |
| 複数人必要 | agents-manager |
| その他 | general-purpose |

---

## 📚 関連ドキュメント

- [AI開発ルール](./AI_DEVELOPMENT_RULES.md)
- [並列AI作業指示書](../ai-conversations/PARALLEL_WORK_INSTRUCTIONS.md)
- [バージョン管理ルール](./VERSION_RULES.md)