# TODOアプリテンプレート

## 概要
このテンプレートは、タスク管理機能を実装するためのサンプルです。

## 機能
- タスクの作成・編集・削除
- 優先度設定（低・中・高）
- 完了状態の管理
- 期限日設定

## 使用方法

### 1. configのインポート
```javascript
import { TODO_CONFIG } from './config.js';
```

### 2. コンポーネントの使用
```javascript
import { TodoItem } from './components.js';

const todo = {
    title: "サンプルタスク",
    priority: "high",
    completed: false
};

const todoItem = new TodoItem(todo);
document.body.appendChild(todoItem.render());
```

## カスタマイズ方法

### フィールドの追加
config.jsのfieldsオブジェクトに新しいフィールドを追加：
```javascript
fields: {
    // 既存のフィールド...
    category: { type: "select", options: ["work", "personal", "shopping"] }
}
```

### UIテーマの変更
config.jsのui.themeオブジェクトで色を変更：
```javascript
ui: {
    theme: {
        primaryColor: "#FF5722",  // 新しいプライマリカラー
        secondaryColor: "#FFC107"  // 新しいセカンダリカラー
    }
}
```