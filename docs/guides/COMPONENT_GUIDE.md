# コンポーネント作成ガイド

## 基本UIコンポーネント（src/components/common/）

### 利用可能なコンポーネント
- **Button.js** - 汎用ボタン
- **Input.js** - 入力フィールド
- **Modal.js** - モーダルダイアログ
- **Card.js** - カードコンテナ
- **List.js** - リスト表示
- **Panel.js** - パネルコンテナ（v0.2.2）
- **Form.js** - フォーム生成（v0.2.2）
- **Select.js** - セレクトボックス（v0.2.2）
- **Loading.js** - ローディング表示（v0.2.2）
- **Alert.js** - アラート表示（v0.2.2）

### 使用例

```javascript
import { Button } from '../../components/common/Button.js';

const myButton = new Button({
    text: 'Click Me',
    type: 'primary',
    onClick: () => console.log('Clicked!')
});

document.body.appendChild(myButton.render());
```

## カスタムコンポーネントの作成

### 1. 継承による拡張

```javascript
// src/custom/components/MyCustomButton.js
import { Button } from '../../components/common/Button.js';

export class MyCustomButton extends Button {
    constructor(config) {
        super(config);
        this.icon = config.icon || '🔔';
    }
    
    render() {
        const button = super.render();
        button.innerHTML = `${this.icon} ${button.innerHTML}`;
        return button;
    }
}
```

### 2. 組み合わせによる複合コンポーネント

```javascript
// src/custom/components/TodoItem.js
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';

export class TodoItem {
    constructor(todo) {
        this.todo = todo;
        this.card = new Card({
            title: todo.title,
            content: todo.description,
            footer: this.createFooter()
        });
    }
    
    createFooter() {
        const completeBtn = new Button({
            text: 'Complete',
            type: 'success',
            onClick: () => this.complete()
        });
        return completeBtn.render().outerHTML;
    }
    
    async complete() {
        this.todo.completed = true;
        // CRUDServiceを使用したデータベース更新
        const crud = new CRUDService(firebase.database());
        await crud.update(userId, 'todos', this.todo.id, { completed: true });
    }
    
    render() {
        return this.card.render();
    }
}
```

## カスタムローダーの使用

```javascript
// src/custom/loader.jsを使用
import { CustomLoader } from './src/custom/loader.js';

const loader = new CustomLoader();

// 共通コンポーネントを読み込み
await loader.loadCommonComponents();

// カスタムコンポーネントを登録
loader.register('TodoItem', TodoItem);

// 使用
const TodoItemClass = loader.get('TodoItem');
const item = new TodoItemClass(todoData);
```

## ベストプラクティス

### ✅ 推奨事項
1. **単一責務の原則** - 各コンポーネントは1つの責務のみ
2. **設定オブジェクトパターン** - コンストラクタには設定オブジェクトを渡す
3. **render()メソッド** - 必ずDOM要素を返す
4. **イベントハンドリング** - コンポーネント内で管理

### ❌ 避けるべきこと
1. グローバル変数の使用
2. 直接的なDOM操作（document.getElementById等）
3. 体重管理等、特定アプリケーション依存のロジック

## トラブルシューティング

### インポートエラー
```javascript
// ❌ 間違い
import { Button } from 'Button.js';

// ✅ 正しい（相対パスを使用）
import { Button } from '../../components/common/Button.js';
```

### イベントリスナーの重複
```javascript
// ❌ 間違い
render() {
    const btn = document.createElement('button');
    btn.addEventListener('click', this.onClick);
    return btn;
}

// ✅ 正しい（一度だけ追加）
constructor(config) {
    this.onClick = config.onClick || (() => {});
    this.element = null;
}

render() {
    if (!this.element) {
        this.element = document.createElement('button');
        this.element.addEventListener('click', this.onClick);
    }
    return this.element;
}
```