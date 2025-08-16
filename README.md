# 🚀 Universal App Template v0.37

## 📌 5分で新しいアプリを作ってWeb公開する

### 1️⃣ コピー（日付必須）
```powershell
# 必ず今日の日付を含める（例: 20250811-calculator-app）
Copy-Item -Recurse "0000-00-00-project-template" "20250811\20250811-[アプリ名]"
cd "20250811\20250811-[アプリ名]"
```

### 2️⃣ 設定変更（2ファイルのみ）

#### `project-settings.json`
```json
{
  "app": {
    "name": "[アプリ名]",     // ← ここを変更
    "description": "[説明]"   // ← ここを変更
  },
  "database": {
    "collection": "[データ名]" // ← ここを変更（例: todos, memos, calculations）
  }
}
```

#### `src/custom/app-config.js`
```javascript
export const APP_CONFIG = {
    appName: "[アプリ名]",        // ← 上と同じ名前
    dataCollection: "[データ名]"  // ← 上と同じデータ名
};
```

### 3️⃣ Git初期化とGitHub公開
```powershell
# Git初期化
Remove-Item -Recurse -Force .git
git init
git add .
git commit -m "Initial commit"

# GitHubリポジトリ作成（gh CLIを使用）
gh repo create 20250811-[アプリ名] --public --source=. --remote=origin --push

# または手動でGitHubにリポジトリ作成後
git remote add origin https://github.com/[ユーザー名]/20250811-[アプリ名].git
git push -u origin main
```

### 4️⃣ GitHub Pages有効化（Web公開）
1. GitHubのリポジトリページを開く
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: main, /(root)
5. Save
6. 5-10分後に `https://[ユーザー名].github.io/20250811-[アプリ名]/` でアクセス可能

---

## 🔢 バージョン管理ルール

### 初回公開
- **v0.1** でスタート

### 修正時
- **+0.01** ずつ上げる
- 例：v0.1 → v0.11 → v0.12 → v0.13...

### 更新箇所（3つ）
1. `index.html` の `<title>` と `<h1>`
2. `README.md` のバージョン表記
3. `package.json` の version

---

## 📱 スマホアプリ化（ホーム画面追加）

### アイコン設定
1. **icon-180.png** を用意（180×180ピクセル）
2. プロジェクトルートに配置
3. iPhoneでサイトを開く → 共有 → ホーム画面に追加

### 自動で設定される内容
- アプリアイコン（icon-180.png）
- アプリ名（manifest.jsonのshort_name）
- フルスクリーン表示（アドレスバーなし）

---

## 🎨 カスタマイズガイド（重要！）

### 🔒 固定領域（触るな）
```
パネル1 [1-L]: ログイン機能
パネル3 [3-L]: デバッグログ  
パネル4 [4-L]: デバッグボタン
グリッド/パネル表示ボタン
```

### ✨ 自由領域（好きにデザインしてOK！）
```
パネル2 [2-L]: データ入力エリア
└── この中は完全自由！
    - レイアウト変更OK
    - 独自のデザインOK
    - 新機能追加OK
    - 色・フォント・アニメーション何でもOK
```

### 💡 カスタマイズ例
```html
<!-- パネル2の中身を完全に入れ替え -->
<div class="section-panel panel-L hidden" id="userPanel">
    <!-- ここから下を自由に書き換え！ -->
    <div class="my-awesome-design">
        <div class="fancy-cards">...</div>
        <div class="cool-animations">...</div>
    </div>
    <!-- ここまで -->
</div>
```

### 📝 編集ファイル
- `project-settings.json` - アプリ設定
- `src/custom/app-config.js` - 動作設定  
- `src/custom/styles.css` - **ここでデザインを大胆に変更！**
- `index.html` - パネル2の中身のみ

---

## 🌟 主要機能

### 📊 基本機能
- **データ記録**: 日付・時刻・値・タイミング・メモを記録
- **🔐 Google認証**: 安全なGoogle OAuth認証システム
- **🔄 リアルタイム同期**: Firebase Realtime Databaseによるデバイス間同期
- **⌨️ キーボード操作**: ↑↓キーで0.1単位の調整
- **📈 履歴表示**: 時系列でのデータ履歴確認

### 🎨 Core/Custom分離構造
- **🚫 Services フォルダ**: 触ってはいけない安全領域（認証・データベース・ログ機能）
- **✅ Custom フォルダ**: 自由にカスタマイズ可能（app-config.js・styles.css・templates/）
- **🔧 簡単変更**: TODOアプリ、メモアプリ等への転用が容易
- **🛡️ 安全性**: 誤った変更による動作不良を防止

### 🎯 汎用テンプレート機能
- 📝 任意のデータコレクション対応
- 🔄 リアルタイム同期
- 🔐 ユーザー別データ分離
- 📊 CRUD操作の標準化

## 🚀 使用方法

### ライブデモ
**https://muumuu8181.github.io/0000-00-00-project-template/**

### ローカル実行
1. HTTPサーバーを起動：
   ```bash
   python -m http.server 8000
   ```
   または
   ```bash
   npx http-server -p 8000
   ```

2. ブラウザで `http://localhost:8000` にアクセス

3. Googleアカウントでログイン

4. データを入力して保存

## 🔧 技術仕様

- **フロントエンド**: Vanilla HTML/CSS/JavaScript
- **認証**: Firebase Authentication (Google OAuth)
- **データベース**: Firebase Realtime Database
- **デプロイ**: GitHub Pages
- **対応ブラウザ**: Chrome, Firefox, Safari, Edge

## 📱 データ構造

### 汎用データ構造（v0.2.2新機能）
```json
{
  "users": {
    "userId": {
      "[collection]": {
        "recordId": {
          "timestamp": 1722944530000,
          "createdAt": "2025-01-10T10:30:00.000Z",
          "updatedAt": "2025-01-10T11:00:00.000Z",
          "...customData": "アプリ固有のデータ"
        }
      }
    }
  }
}
```

### 新しいデータサービス（v0.2.2）
- **CRUDService** (`src/services/crud.js`) - 汎用CRUD操作
  - `create(userId, collection, data)` - データ作成
  - `read(userId, collection, id)` - データ読み取り
  - `update(userId, collection, id, data)` - データ更新
  - `delete(userId, collection, id)` - データ削除
  - `list(userId, collection, limit)` - リスト取得

- **DataManager** (`src/services/data-manager.js`) - アプリ非依存のデータ管理
  - `saveAppData(userId, appType, data)` - アプリデータ保存
  - `getAppData(userId, appType)` - アプリデータ取得

- **DatabaseService** (`src/services/database.js`) - 汎用化済み
  - `saveData(userId, collection, data)` - 汎用保存
  - `deleteData(userId, collection, entryId)` - 汎用削除
  - `watchUserData(userId, collection, callback)` - リアルタイム監視

## 🛡️ プライバシー

- データはユーザー別に完全分離
- Firebase認証による安全なアクセス制御
- 個人情報はFirebaseサーバー側で保護
- アプリコードに個人データは含まれません

## 📁 プロジェクト構造（v0.2.5）

### 🔧 最小限のフォルダ構成

```
プロジェクト/
├── index.html         # メインアプリファイル
├── README.md          # このファイル
├── package.json       # npm設定（必須）
├── .gitignore         # Git設定（必須）
├── _archive/          # 古いバックアップ（無視してOK）
├── docs/              # すべてのドキュメント
├── src/               # すべてのソースコード
└── tests/             # テストファイル
```

### 📂 src/ フォルダ内の構成と編集可否

| フォルダ | 役割 | 編集可否 | 説明 |
|---------|------|---------|------|
| **components/** | UIコンポーネント | ❌ **触るな** | 共通UIパーツ（common/にButton, Card, Modal等） |
| **services/** | データサービス | ❌ **触るな** | auth.js, database.js, crud.js, data-manager.js, logger.js |
| **features/** | 機能モジュール | ⚠️ **要相談** | アプリ固有の機能（main.js） |
| **custom/** | カスタム設定 | ✅ **自由編集OK** | app-config.js, styles.css, loader.js, templates/ |
| **scripts/** | 起動スクリプト | ⚠️ **要相談** | setup.sh, start-server.bat等 |
| **examples/** | サンプルコード | ✅ **参考用** | simple-button-app.html, data-storage-usage.js |
| **core-legacy/** | 旧コア | ❌ **触るな** | 旧バージョンの参照用（編集不要） |

### 🚫 絶対に触ってはいけないファイル

```
src/
├── components/        # ❌ UIコンポーネント群
│   ├── common/       # 汎用UIコンポーネント
│   └── ui.js         # UI基本機能
├── services/         # ❌ コアサービス群
│   ├── auth.js       # 認証サービス
│   ├── database.js   # DBサービス（汎用化済み）
│   ├── crud.js       # 汎用CRUD操作
│   ├── data-manager.js # データ管理
│   └── logger.js     # ログサービス
```

### ✅ 自由に編集できるファイル

```
src/
├── custom/           # ✅ カスタマイズ領域
│   ├── app-config.js # アプリ設定
│   └── styles.css    # デザイン
├── examples/         # ✅ サンプル（参考用）
```

## 🔄 他のアプリに変更する方法

### ✅ 変更してOKなファイル
- `custom/app-config.js` → アプリの動作・設定
- `custom/styles.css` → 見た目・デザイン
- `index.html` の表示部分のみ → UI構造

### 🚫 変更NGなファイル
- `core/` 内のすべて
- `index.html` のFirebase設定部分

### 🎯 カスタマイズ例

#### TODOアプリに変更
1. `custom/app-config.js` で：アプリ名・ボタンをTODO関連に変更
2. `custom/styles.css` で：カラーテーマをタスク管理系に変更
3. `index.html` で：入力フィールドをタスク入力に変更

#### メモアプリに変更
1. `custom/app-config.js` で：アプリ名・ボタンをメモ関連に変更
2. `custom/styles.css` で：シンプルなカラーテーマに変更

## ⚡ 開発ワークフロー

1. **カスタマイズ** → `custom/` フォルダのみ編集
2. **テスト** → ローカルでHTTPサーバー起動
3. **デプロイ** → `git push` で自動デプロイ
4. **確認** → https://muumuu8181.github.io/0000-00-00-project-template/

## 🛡️ 保護メカニズム

- **Core分離** - 誤った変更を物理的に防止
- **明確な境界** - 触ってOK/NGが一目瞭然
- **独立カスタマイズ** - 他への影響なし
- **バックアップ保護** - Core部分は常に安全

## 🎯 開発情報

- **バージョン**: v0.37
- **作成日**: 2025-08-07
- **更新日**: 2025-01-10
- **言語**: JavaScript (ES6)
- **ライセンス**: MIT

## 📋 更新履歴

### v0.37 (2025-01-10)
- iPhoneホーム画面アイコン対応
- PWA設定追加（manifest.json）
- 180x180pxアイコンテンプレート

### v0.36 (2025-01-10)
- 音声入力対応（ひらがな命名規則）
- バージョン管理ルール明記（v0.1スタート、+0.01ずつ）
- カスタマイズ領域をより明確に

### v0.35 (2025-01-10)
- README充実化（GitHub公開手順を詳細に記載）
- デバッグ機能・グリッド機能の保護（削除禁止コメント追加）
- プロジェクト名に日付を必須化
- index.htmlに削除禁止エリアを明示

### v0.34 (2025-01-10)
- グリッドトグルボタンのz-indexを高く設定
- グリッドオーバーレイのpointer-eventsを強制無効化
- グリッドモードOFFできない問題を修正

### v0.2.5 (2025-01-10)
- グリッドラベルをすべて表示に復元（省略しない）
- 勝手な判断での機能削減を反省

### v0.2.4 (2025-01-10)
- グリッド表示をシンプル化（最外側のみ）
- Excel風の列ラベル（A-Z, AA-AZ...）実装
- 行番号を100まで拡張
- 不要なCSSスタイルを削除

### v0.2.3 (2025-01-10)
- グリッドの二重問題を修正
- 内側の細かいdata-grid属性を削除
- パネルレベルのみグリッドを保持

### v0.2.2 (2025-01-10)
- 汎用データサービス実装（crud.js, data-manager.js）
- DatabaseServiceの汎用化完了
- コレクションベースのデータ管理対応
- ドキュメント整備と構造改善

### v0.2.0 (2025-08-07)
- 汎用アプリテンプレートとしてリリース
- Firebase + Google認証実装済み
- データ記録・履歴表示機能
- キーボード操作対応
- Core/Custom分離構造
- GitHub Pages デプロイ対応

## 🤝 貢献

Issue・Pull Request歓迎です。改善提案やバグ報告をお待ちしています。

---

**🚀 GitHub Pages**: https://muumuu8181.github.io/0000-00-00-project-template/