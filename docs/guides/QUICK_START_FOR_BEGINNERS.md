# 🚀 初心者向けクイックスタートガイド

## 📌 あなたの理解は正しいです！

提示いただいた手順は**ほぼ完璧**です。以下に正式版を記載します：

## 1. プロジェクトの準備

### Windows（PowerShell）の場合
```powershell
# テンプレートをコピー
Copy-Item -Recurse 0000-00-00-project-template 20250810-my-app
cd 20250810-my-app

# Git初期化（重要！）
Remove-Item -Recurse -Force .git
git init
```

### Mac/Linuxの場合
```bash
# テンプレートをコピー
cp -r 0000-00-00-project-template 20250810-my-app
cd 20250810-my-app

# Git初期化（重要！）
rm -rf .git
git init
```

## 2. アプリの基本設定を変更

`src/custom/app-config.js`を編集：

```javascript
export const APP_CONFIG = {
    // アプリ名を変更
    appName: "私のTODOアプリ",  // ← ここを変更
    appDescription: "タスク管理アプリ",  // ← ここを変更
    
    // デフォルト値
    defaultValue: 50.0,  // ← 必要に応じて変更
    
    // データコレクション名（Firebase内での保存場所）
    dataCollection: "todos",  // ← "weights"から"todos"に変更
    
    // ボタン設定
    buttons: {
        save: "タスクを保存",  // ← ボタンのテキスト変更
        delete: "タスクを削除"
    }
};
```

## 3. 見た目をカスタマイズ

`src/custom/styles.css`を編集：

```css
/* カラーテーマを変更 */
:root {
    --primary-color: #4CAF50;  /* メインカラー */
    --secondary-color: #FFC107;  /* サブカラー */
}
```

## 4. GitHubにアップロード

```bash
# すべてのファイルを追加
git add .

# 最初のコミット
git commit -m "Initial commit: My TODO App"

# GitHubで新規リポジトリ作成後
git remote add origin https://github.com/[あなたのユーザー名]/[リポジトリ名].git
git push -u origin main
```

## 5. Web公開（オプション）

GitHub Settings → Pages → Source を `main` ブランチに設定

## ✅ チェックポイント

- [ ] `.git`フォルダを削除した？（重要！）
- [ ] `app-config.js`でアプリ名を変更した？
- [ ] データコレクション名を変更した？
- [ ] GitHubにプッシュできた？

## 🚨 よくある間違い

### ❌ 間違い
```javascript
// src/services/database.js を編集してしまう
```

### ✅ 正しい
```javascript
// src/custom/app-config.js のみ編集
```

## 📁 編集してOKなファイル

```
✅ 編集OK
├── src/custom/app-config.js    # アプリ設定
├── src/custom/styles.css       # デザイン
├── src/custom/templates/       # テンプレート
└── index.html                  # UI部分のみ

❌ 編集NG（触らない）
├── src/services/              # コアサービス
├── src/components/            # コンポーネント
└── Firebase設定部分            # 認証関連
```

## 🎯 次のステップ

1. **簡単な変更から始める**
   - アプリ名の変更
   - ボタンテキストの変更
   - カラーの変更

2. **徐々に拡張**
   - 入力フィールドの追加
   - 新しいボタンの追加
   - レイアウトの調整

## 💡 困ったら

- `docs/README.md` を確認
- `docs/issues/` で既知の問題を確認
- `examples/` でサンプルコードを参照

---

**このガイドで不明な点があれば、遠慮なく質問してください！**