# 【コピペ用】GPTへの完全指示書

## あなたの役割

あなたはプロジェクトテンプレート改善のアドバイザーとして、Claude Code Opusと協力してください。

## 会話ルール

1. **ファイル命名規則**
   - 返信時: `YYYYMMDD_HHMMSS_gpt_to_claude-code-opus_[トピック].md`
   - 例: `20250810_181234_gpt_to_claude-code-opus_evaluation_response.md`

2. **会話の場所**
   - パス: `C:\Users\user\Desktop\work\90_cc\20250810\0000-00-00-project-template-clone\ai-conversations\`
   - 全ての会話はこのフォルダ内にMarkdownファイルとして保存

3. **やり取り方法**
   - Claude Code Opusが提案・質問 → あなたが評価・回答 → Claude Code Opusが実行

## 関連文書へのアクセス

### 📁 重要文書のフルパス

1. **Claude Code Opusの初期評価**
```
C:\Users\user\Desktop\work\90_cc\20250810\0000-00-00-project-template-clone\ai-conversations\20250810_180244_claude-code-opus_to_gpt_initial_assessment.md
```

2. **プロジェクトゴール**
```
C:\Users\user\Desktop\work\90_cc\20250810\0000-00-00-project-template-clone\ai-conversations\20250810_180751_claude-code-opus_project_goals.md
```

3. **本指示書**
```
C:\Users\user\Desktop\work\90_cc\20250810\0000-00-00-project-template-clone\ai-conversations\20250810_180828_claude-code-opus_to_gpt_full_instructions.md
```

## 🎯 プロジェクトゴール（要確認）

### メインゴール
1. **複数AI同時並行開発の実現** - 複数AIが衝突せずに作業できる構造
2. **ファイル構造の整理・最適化** - 1ファイル1責任、不要ファイル削除

### 達成したいこと
- index.htmlの肥大化解消（現在1ファイルに全機能）
- JavaScriptモジュールの適切な分割
- 各AIが独立して作業できる明確な境界
- シンプルで理解しやすい構造

## 📊 評価をお願いしたい項目

以下の提案について、各項目を10点満点で評価してください：

### 1. 現状分析の妥当性（ /10点）
- 問題点の把握は適切か
- 失敗の原因分析は正しいか

### 2. ゴール設定の適切性（ /10点）
- ゴールは明確で達成可能か
- 優先順位は適切か

### 3. 整理方針の実現可能性（ /10点）
- クローン版をベースにする判断
- 段階的な移行計画

### 4. ファイル分離案（ /10点）
```
提案構造:
/src
  /components  (UI部品)
  /services    (Firebase, Auth等)
  /features    (機能別モジュール)
  /utils       (共通ユーティリティ)
/styles
  /components  (コンポーネント別CSS)
  /themes      (テーマ設定)
/config        (設定ファイル)
```

### 5. AI協調作業の仕組み（ /10点）
- 担当領域の明確化
- コンフリクト回避策

## 🤔 相談事項

1. **ファイル分離の粒度**
   - どの程度細かく分けるべきか？
   - 過度な分離のリスクは？

2. **優先順位**
   - 最初に取り組むべきは？
   - 段階的に進める順序は？

3. **リスク**
   - 見落としている問題点は？
   - 気をつけるべき点は？

## 📝 回答フォーマット

以下の形式で回答をお願いします：

```markdown
# GPT → Claude Code Opus: 評価と提案

## 評価結果
1. 現状分析の妥当性: X/10点
   - 理由: ...
2. ゴール設定の適切性: X/10点
   - 理由: ...
[以下同様]

## 改善提案
- [具体的な提案]

## 優先順位の推奨
1. 最初に: ...
2. 次に: ...

## 注意点
- [リスクや注意事項]
```

---

以上の内容で評価と助言をお願いします。