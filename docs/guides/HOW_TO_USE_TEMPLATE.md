# 🎯 アプリテンプレート使用方法

## 📋 このテンプレートについて

Universal App Template v0.2.2 - 汎用アプリテンプレートです。
Firebase + Google認証が既に設定済みで、すぐに開発を開始できます。

### ✨ 特徴
- **Firebase Realtime Database** 設定済み
- **Google認証** 実装済み
- **レスポンシブデザイン** 対応済み
- **Core/Custom分離構造** で拡張しやすい

---

## 🚀 新アプリ作成手順

### 1️⃣ テンプレートをコピー
```bash
# 日付-プロジェクト名でコピー
cp -r 0000-00-00-project-template 2025-01-10-my-new-app
cd 2025-01-10-my-new-app
```

### 2️⃣ Git初期化（重要！）
```bash
# 既存のGit履歴を削除
rm -rf .git

# 新規リポジトリとして初期化
git init
git add .
git commit -m "Initial commit from template"
```

### 3️⃣ アプリ名を変更
`index.html`を編集:
```html
<!-- 変更前 -->
<title>アプリテンプレート</title>
<h1 class="app-title">📱 アプリテンプレート</h1>

<!-- 変更後（例：TODOアプリ） -->
<title>TODOアプリ</title>
<h1 class="app-title">✅ TODOアプリ</h1>
```

### 4️⃣ 機能を実装
体重管理の部分を自分のアプリ機能に置き換えます。

---

## 📁 フォルダ構造

```
0000-00-00-project-template/
├── index.html              # メインHTML（編集対象）
├── src/
│   ├── services/          # データサービス（触らない）
│   │   ├── auth.js
│   │   ├── database.js
│   │   ├── crud.js
│   │   └── data-manager.js
│   ├── custom/            # カスタマイズ部分（編集OK）
│   │   ├── app-config.js
│   │   ├── styles.css
│   │   └── templates/
│   └── components/        # UIコンポーネント
└── docs/                   # ドキュメント
```

### ⚠️ 重要な注意
- **src/services/**フォルダは変更禁止
- **src/custom/**フォルダは自由に編集可能
- **Firebase設定**は自動で動作

---

## 🔥 Firebase設定

### 既存の設定を使用（推奨）
デフォルトで動作するFirebase設定が含まれています。
そのまま使用できます。

### 独自のFirebaseプロジェクトを使用する場合
1. [Firebase Console](https://console.firebase.google.com/)でプロジェクト作成
2. `custom/app-config.js`の設定を更新
3. Google認証を有効化

---

## 💡 カスタマイズ例

### 例1: TODOアプリに変更
```javascript
// CRUDServiceを使用してTODOデータを管理
import { CRUDService } from './src/services/crud.js';

const crud = new CRUDService(firebase.database());

// TODO追加
async function addTodo(userId, title) {
    await crud.create(userId, 'todos', {
        title: title,
        completed: false
    });
}
```

### 例2: メモアプリに変更
```javascript
// データ構造を変更
const memoData = {
    title: document.getElementById('memoTitle').value,
    content: document.getElementById('memoContent').value,
    timestamp: Date.now()
};
```

---

## 🎯 開発フロー

1. **テンプレートコピー** → プロジェクト作成
2. **Git初期化** → バージョン管理開始
3. **基本情報変更** → アプリ名、説明文
4. **UI調整** → 必要な入力フォームに変更
5. **ロジック実装** → アプリ固有の機能追加
6. **テスト** → Firebase接続確認
7. **デプロイ** → GitHub Pagesなどで公開

---

## 📝 よくある質問

### Q: Firebase設定は必要？
A: いいえ、デフォルト設定で動作します。

### Q: Google認証は必須？
A: はい、テンプレートの要件です（MANDATORY_REQUIREMENTS.md参照）

### Q: スマホ対応は？
A: レスポンシブデザイン実装済みです。

### Q: 体重管理の機能を完全に削除したい
A: index.htmlの体重関連のHTML要素とJavaScript関数を削除し、独自の機能に置き換えてください。

---

## 🚨 トラブルシューティング

### Firebase接続エラー
- ネットワーク接続を確認
- ブラウザのコンソールでエラーを確認

### Google認証が動作しない
- ポップアップブロッカーを無効化
- HTTPSまたはlocalhostで実行

### データが保存されない
- Google認証が完了しているか確認
- Firebase Databaseのルールを確認

---

## 🎉 さあ、開発を始めましょう！

このテンプレートを使えば、認証とデータベースの設定に時間を取られることなく、
すぐにアプリケーション開発に集中できます。

Happy Coding! 🚀