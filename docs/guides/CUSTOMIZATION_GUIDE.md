# カスタマイズガイド

## クイックスタート

### 1. テンプレートを選択

```bash
# TODOアプリとして起動
http://localhost:8000/?template=todo-app

# メモアプリとして起動
http://localhost:8000/?template=memo-app
```

### 2. 基本的なカスタマイズ（src/custom/app-config.js）

```javascript
export const APP_CONFIG = {
    name: "My Custom App",
    version: "1.0",
    collection: "my-data",  // Firebaseコレクション名
    
    ui: {
        theme: {
            primaryColor: "#007bff",
            secondaryColor: "#6c757d"
        }
    }
};
```

## TODOアプリへの変換

### Step 1: テンプレートをコピー

```bash
cp -r src/custom/templates/todo-app/* src/custom/
```

### Step 2: index.htmlを更新

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <title>TODOアプリ</title>
    <link rel="stylesheet" href="src/custom/styles.css">
</head>
<body>
    <div id="app"></div>
    
    <script type="module">
        import { CustomLoader } from './src/custom/loader.js';
        import { TODO_CONFIG } from './src/custom/templates/todo-app/config.js';
        import { TodoItem } from './src/custom/templates/todo-app/components.js';
        
        // アプリ初期化
        const loader = new CustomLoader();
        await loader.loadCommonComponents();
        
        // TODOアプリ起動
        const app = document.getElementById('app');
        app.innerHTML = `<h1>${TODO_CONFIG.name}</h1>`;
        
        // TODO追加フォーム
        const Input = loader.get('Input');
        const Button = loader.get('Button');
        
        const input = new Input({
            placeholder: 'New todo...',
            onEnter: () => addTodo()
        });
        
        const addBtn = new Button({
            text: 'Add Todo',
            onClick: () => addTodo()
        });
        
        app.appendChild(input.render());
        app.appendChild(addBtn.render());
    </script>
</body>
</html>
```

### Step 3: データ連携

```javascript
// src/custom/templates/todo-app/data-handler.js
import { CRUDService } from '../../../services/crud.js';

export class TodoDataHandler {
    constructor(userId, database) {
        this.crud = new CRUDService(database);
        this.userId = userId;
        this.collection = 'todos';
    }
    
    async addTodo(todoData) {
        return await this.crud.create(this.userId, this.collection, {
            title: todoData.title,
            completed: false,
            priority: todoData.priority || 'medium',
            createdAt: new Date().toISOString()
        });
    }
    
    async getTodos() {
        return await this.crud.list(this.userId, this.collection);
    }
    
    async toggleComplete(todoId) {
        const todo = await this.crud.read(this.userId, this.collection, todoId);
        return await this.crud.update(this.userId, this.collection, todoId, {
            completed: !todo.completed
        });
    }
    
    async deleteTodo(todoId) {
        return await this.crud.delete(this.userId, this.collection, todoId);
    }
}
```

## メモアプリへの変換

### Step 1: 設定ファイル

```javascript
// src/custom/config.js
export const MEMO_CONFIG = {
    name: "メモアプリ",
    version: "1.0",
    collection: "memos",
    
    features: {
        search: true,
        tags: true,
        favorites: true
    }
};
```

### Step 2: メモコンポーネント

```javascript
// src/custom/components/MemoCard.js
import { Card } from '../../components/common/Card.js';

export class MemoCard extends Card {
    constructor(memo) {
        super({
            title: memo.title,
            content: memo.content,
            footer: `Updated: ${new Date(memo.updatedAt).toLocaleString()}`
        });
        this.memo = memo;
    }
    
    addTag(tag) {
        if (!this.memo.tags) this.memo.tags = [];
        this.memo.tags.push(tag);
    }
}
```

### Step 3: index.htmlの統合

```html
<script type="module">
    // メモアプリとして初期化
    import './src/custom/templates/memo-app/app.js';
</script>
```

## 高度なカスタマイズ

### カスタムテーマの作成

```css
/* src/custom/themes/dark-theme.css */
:root {
    --primary-color: #1a1a1a;
    --secondary-color: #2d2d2d;
    --text-color: #ffffff;
    --background-color: #000000;
}

.dark-theme {
    background-color: var(--background-color);
    color: var(--text-color);
}

.dark-theme .card {
    background-color: var(--secondary-color);
    border-color: var(--primary-color);
}
```

### プラグインシステム

```javascript
// src/custom/plugins/spell-checker.js
export class SpellCheckerPlugin {
    constructor(config) {
        this.enabled = config.enabled || true;
        this.language = config.language || 'en-US';
    }
    
    check(text) {
        // スペルチェック処理
        return {
            hasErrors: false,
            suggestions: []
        };
    }
}

// 使用
import { SpellCheckerPlugin } from './plugins/spell-checker.js';

const spellChecker = new SpellCheckerPlugin({
    language: 'ja-JP'
});
```

## フォルダ構成

```
src/custom/
├── app-config.js        # アプリ設定
├── styles.css           # カスタムスタイル
├── loader.js            # コンポーネントローダー
├── components/          # カスタムコンポーネント
│   ├── TodoItem.js
│   └── MemoCard.js
├── templates/           # アプリテンプレート
│   ├── todo-app/
│   └── memo-app/
├── themes/              # テーマファイル
│   ├── dark.css
│   └── light.css
└── plugins/             # プラグイン
    └── spell-checker.js
```

## デバッグとテスト

### コンソールでのデバッグ

```javascript
// デバッグモード有効化
window.DEBUG = true;

// コンポーネントの状態確認
console.log('Loaded components:', loader.components);

// データ確認
const todos = await todoHandler.getTodos();
console.table(todos);
```

### よくある問題と解決策

**Q: コンポーネントが表示されない**
A: render()メソッドがDOM要素を返しているか確認

**Q: Firebaseエラーが発生する**
A: Firebase設定とルールを確認

**Q: インポートエラー**
A: 相対パスが正しいか、ファイル拡張子(.js)を含めているか確認