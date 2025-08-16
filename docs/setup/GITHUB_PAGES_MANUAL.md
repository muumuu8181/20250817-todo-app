# GitHub Pages更新マニュアル

## GitHub Pagesの仕組み
- GitHub Pagesは**GitHub Actions**ワークフローで自動デプロイされる
- `main`ブランチへのpushで自動的にワークフローがトリガーされる
- デプロイ完了まで通常**1-5分**かかる

## 更新手順

### 1. ローカルでファイル修正後
```bash
# 変更をステージング
git add .

# コミット作成
git commit -m "変更内容の説明"

# GitHub にプッシュ（これでワークフローがトリガーされる）
git push origin main
```

### 2. ワークフロー実行確認
```bash
# 最近のワークフロー実行状況を確認
gh run list --limit 5

# 特定のワークフロー実行詳細を確認
gh run view [run-id]
```

### 3. GitHub Pagesの状態確認
```bash
# Pages設定を確認
gh api repos/muumuu8181/weight-management-app/pages

# リポジトリ情報を確認
gh repo view
```

## トラブルシューティング

### 更新が反映されない場合

1. **ワークフロー実行確認**
   ```bash
   gh run list
   ```
   - statusが`completed`で`conclusion`が`success`か確認

2. **ブラウザキャッシュクリア**
   - ハードリロード: `Ctrl + F5`
   - プライベートモードで確認
   - 別のブラウザで確認

3. **強制プッシュ（注意）**
   ```bash
   # 既にプッシュ済みの変更を強制的に反映
   git push --force-with-lease origin main
   ```

### ワークフローが失敗した場合

1. **失敗理由確認**
   ```bash
   gh run view --log
   ```

2. **再実行**
   ```bash
   # 手動でワークフローを再実行
   gh workflow run "Deploy static content to Pages"
   ```

3. **空コミットでトリガー**
   ```bash
   # 変更なしでもワークフローをトリガー
   git commit --allow-empty -m "Trigger GitHub Pages"
   git push origin main
   ```

## 確認方法

### デプロイ完了確認
1. https://muumuu8181.github.io/weight-management-app/ にアクセス
2. ページソースを確認して変更が反映されているか確認
3. ブラウザのデベロッパーツールでキャッシュを無効化

### タイムライン目安
- **コミット・プッシュ**: 即座
- **ワークフロー開始**: 30秒～2分
- **デプロイ完了**: プッシュから3～7分
- **ブラウザ反映**: デプロイ完了から1～2分

## 注意点
- 複数回連続でプッシュするとワークフローがキューに溜まる
- 大きなファイル変更はデプロイ時間が長くなる
- GitHub Actions の使用量制限に注意（通常は十分な無料枠あり）