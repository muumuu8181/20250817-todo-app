# メモアプリテンプレート

## 概要
このテンプレートは、メモ管理機能を実装するためのサンプルです。

## 機能
- メモの作成・編集・削除
- カテゴリー分類（個人・仕事・アイデア・その他）
- タグ付け機能
- 作成日時・更新日時の自動記録

## 使用方法

### 1. configのインポート
```javascript
import { MEMO_CONFIG } from './config.js';
```

### 2. コンポーネントの使用

#### メモカードの表示
```javascript
import { MemoCard } from './components.js';

const memo = {
    title: "アイデアメモ",
    content: "新しいアプリのアイデア...",
    tags: ["アプリ", "アイデア"],
    category: "idea",
    createdAt: Date.now()
};

const memoCard = new MemoCard(memo);
document.body.appendChild(memoCard.render());
```

#### メモエディターの使用
```javascript
import { MemoEditor } from './components.js';

// 新規メモの作成
const editor = new MemoEditor();
document.body.appendChild(editor.render());

// 既存メモの編集
const existingMemo = { /* メモデータ */ };
const editEditor = new MemoEditor(existingMemo);
document.body.appendChild(editEditor.render());
```

## カスタマイズ方法

### フィールドの追加
config.jsのfieldsオブジェクトに新しいフィールドを追加：
```javascript
fields: {
    // 既存のフィールド...
    importance: { type: "number", min: 1, max: 5, default: 3 }
}
```

### カテゴリーの変更
config.jsでカテゴリーオプションを変更：
```javascript
category: { 
    type: "select", 
    options: ["meeting", "todo", "note", "reference"] 
}
```

### UIレイアウトの調整
config.jsのui.layoutオブジェクトで設定：
```javascript
ui: {
    layout: {
        columns: 3,      // 3列表示
        showSidebar: false  // サイドバー非表示
    }
}
```