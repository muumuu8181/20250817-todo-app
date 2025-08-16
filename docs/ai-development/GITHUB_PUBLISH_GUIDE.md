# 🚀 GitHub Pages Web公開ルール

## 📌 基本原則
**AIが修正を完了したら、GitHub Pages Web公開まで責任を持って実行する**

### なぜWeb公開が必須なのか
- **Firebase認証はHTTPS環境でのみ動作**
- **ローカル環境では認証機能をテストできない**
- **実際の動作確認にはWeb公開が必要**

---

## 📋 公開前チェックリスト

### 必須確認事項
```markdown
## Pre-flight Checklist
- [ ] バージョン番号を +0.01 更新済み（v0.2.4 → v0.2.5）
- [ ] README.md 3箇所更新済み（タイトル、バージョン情報、更新履歴）
- [ ] package.json のバージョン更新済み
- [ ] テスト実行して問題なし
- [ ] コンソールエラーなし
- [ ] 機密情報（APIキー等）が含まれていない
- [ ] Firebase設定が正しい
- [ ] .gitignoreが適切に設定されている
```

### セキュリティチェック
```bash
# APIキーや機密情報の検索
grep -r "AIza" .  # Firebase APIキーのパターン
grep -r "sk-" .   # OpenAI APIキーのパターン
grep -r "password" . --exclude-dir=node_modules
```

---

## 📝 コミットメッセージ規則

### 形式
```
[type] v[version]: 簡潔な説明

詳細説明（任意）
使用サブエージェント: [エージェント名]
```

### タイプ一覧
| タイプ | 用途 | 例 |
|--------|------|-----|
| `[feat]` | 新機能追加 | [feat] v0.2.5: TODOアプリに優先度機能を追加 |
| `[fix]` | バグ修正 | [fix] v0.2.6: ログイン後のデータ表示問題を修正 |
| `[docs]` | ドキュメントのみ | [docs] v0.2.7: AI開発ルールを追加 |
| `[style]` | スタイル変更 | [style] v0.2.8: モバイル表示を改善 |
| `[refactor]` | リファクタリング | [refactor] v0.2.9: データサービスを整理 |
| `[test]` | テスト追加・修正 | [test] v0.3.0: 認証テストを追加 |
| `[chore]` | その他の変更 | [chore] v0.3.1: 依存関係を更新 |

### 良いコミットメッセージの例
```bash
git commit -m "[feat] v0.2.5: カレンダー機能を実装

- 月表示と週表示の切り替え機能
- イベントのCRUD操作
- Firebaseとの連携

使用サブエージェント: softengineer-expert"
```

---

## 🔄 Git操作手順

### 1. 変更の確認
```bash
# 状態確認
git status

# 差分確認
git diff

# ステージング前の最終確認
git diff --staged
```

### 2. コミット作成
```bash
# すべての変更をステージング
git add .

# 特定ファイルのみステージング
git add src/custom/templates/todo-app/

# コミット
git commit -m "[feat] v0.2.5: TODOアプリに優先度機能を追加"
```

### 3. リモートへプッシュ
```bash
# メインブランチへプッシュ
git push origin main

# タグも一緒にプッシュ
git tag v0.2.5
git push origin v0.2.5
```

---

## 🌲 ブランチ戦略

### 直接mainブランチで作業する場合（小規模変更）
```bash
git checkout main
git pull origin main
# 作業実施
git add .
git commit -m "[fix] v0.2.5: バグ修正"
git push origin main
```

### フィーチャーブランチを使う場合（大規模変更）
```bash
# ブランチ作成
git checkout -b feature/v0.2.5-calendar

# 作業実施
git add .
git commit -m "[feat] v0.2.5: カレンダー機能実装"

# プッシュ
git push origin feature/v0.2.5-calendar

# PRを作成（後述）
```

---

## 🔀 プルリクエスト（PR）作成

### PR作成時のテンプレート
```markdown
## 📋 変更内容
- バージョン: v0.2.4 → v0.2.5
- 種別: [feat] 新機能追加

## 🎯 実装内容
- カレンダー表示機能
- イベント管理機能
- Firebase連携

## 🤖 使用したサブエージェント
- softengineer-expert: 機能実装
- Code Reviewer: セキュリティレビュー
- doc-writer: ドキュメント作成

## ✅ テスト結果
- [x] ローカルテスト完了
- [x] ブラウザ動作確認（Chrome, Firefox, Safari）
- [x] モバイル表示確認
- [x] エラーなし

## 📸 スクリーンショット
![カレンダー画面](./docs/images/calendar.png)

## 📝 チェックリスト
- [x] バージョン更新済み（+0.01）
- [x] 更新履歴記載済み
- [x] テスト実行済み
- [x] ドキュメント更新済み
- [x] セキュリティチェック済み
```

### PRのマージ条件
1. **CI/CDパス**: 自動テストが成功
2. **レビュー承認**: 1名以上の承認（可能な場合）
3. **コンフリクトなし**: mainブランチとの競合解決済み

---

## 🚀 GitHub Pages自動デプロイ

### 設定確認
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

### デプロイ確認手順
1. **Actions タブ確認**: デプロイワークフローの成功を確認
2. **Pages 設定確認**: Settings → Pages でURLを確認
3. **実際のサイト確認**: 5-10分待ってからアクセス

### デプロイURL
```
https://[username].github.io/[repository-name]/
例: https://muumuu8181.github.io/0000-00-00-project-template/
```

---

## 📊 リリースノート作成

### GitHub Release作成手順
```bash
# 1. タグを作成
git tag -a v0.2.5 -m "Release v0.2.5: カレンダー機能追加"

# 2. タグをプッシュ
git push origin v0.2.5
```

### リリースノートテンプレート
```markdown
# Release v0.2.5 🎉

## ✨ 新機能
- カレンダー表示機能
- イベント管理システム

## 🐛 バグ修正
- ログイン後のデータ表示問題

## 📚 ドキュメント
- カレンダー機能ガイド追加
- API仕様書更新

## 🤖 開発情報
使用サブエージェント:
- softengineer-expert
- Code Reviewer
- doc-writer

## 📦 アップデート方法
```bash
git pull origin main
npm install
```

## 🙏 謝辞
AIエージェントチームの協力に感謝
```

---

## 🚨 トラブルシューティング

### よくある問題と対処

| 問題 | 原因 | 対処法 |
|-----|------|--------|
| プッシュ失敗 | 権限不足 | リポジトリ権限確認 |
| Pages反映されない | キャッシュ | 5-10分待つ、Ctrl+F5 |
| マージコンフリクト | 並列開発 | 最新をpullして解決 |
| CI失敗 | テストエラー | エラーログ確認、修正 |

### 緊急時のロールバック
```bash
# 前のバージョンに戻す
git revert HEAD
git commit -m "[fix] v0.2.6: v0.2.5の問題を修正"
git push origin main

# または特定のタグに戻す
git checkout v0.2.4
git checkout -b hotfix/v0.2.6
```

---

## 📈 公開後の確認

### 必須確認項目
1. **GitHub Pages**: 正しく表示されるか
2. **Googleログイン**: 認証が正常に動作するか ⭐重要
3. **データ保存**: Firebaseへの書き込みが成功するか ⭐重要
4. **データ読み込み**: 保存したデータが表示されるか ⭐重要
5. **レスポンシブ**: モバイル表示問題ないか
6. **エラーログ**: コンソールエラーないか
7. **パフォーマンス**: 読み込み速度問題ないか

### Web公開でのみ確認できる機能
| 機能 | ローカル | GitHub Pages | 理由 |
|-----|---------|--------------|------|
| HTML/CSS表示 | ✅ | ✅ | 基本機能 |
| JavaScript動作 | ✅ | ✅ | 基本機能 |
| Googleログイン | ❌ | ✅ | HTTPS必須 |
| Firebase Database | ❌ | ✅ | 認証が前提 |
| データ永続化 | ❌ | ✅ | 認証が前提 |

### 監視ツール
```javascript
// コンソールで実行
console.log('Version:', document.querySelector('h1').textContent);
console.log('Errors:', window.errors || 'None');
console.log('Load time:', performance.timing.loadEventEnd - performance.timing.navigationStart + 'ms');
```

---

## 📚 関連ドキュメント

- [AI開発ルール](./AI_DEVELOPMENT_RULES.md)
- [バージョン管理ルール](./VERSION_RULES.md)
- [サブエージェントガイド](./SUBAGENT_GUIDE.md)

---

## まとめ

1. **チェックリスト確認**（セキュリティ特に重要）
2. **バージョン更新**（+0.01忘れずに）
3. **適切なコミットメッセージ**（[type] v[version]形式）
4. **GitHub Pagesデプロイ確認**（5-10分待つ）
5. **公開後の動作確認**（エラーチェック）

**Remember**: AIが責任を持って公開まで完了させる。人間の介入を最小限に。