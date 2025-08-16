# 🤖 並列AI作業指示書

このドキュメントは4体のAIが並列で作業するための指示書です。
各AIは自分の番号の指示のみを読んで作業してください。

---

## 📌 重要事項
- **他のAIの作業フォルダには絶対に触らないこと**
- **作業完了後、完了報告を残すこと**
- **不明点があれば作業を止めて確認すること**

---

## 🎯 AI-1: 汎用データサービス担当

### あなたの作業フォルダ
`src/services/`

### あなたの作業内容

#### 1. crud.jsを新規作成
```javascript
// src/services/crud.js
export class CRUDService {
    constructor(database) {
        this.db = database;
    }
    
    // 汎用作成
    async create(userId, collection, data) {
        const ref = this.db.ref(`users/${userId}/${collection}`);
        return await ref.push({
            ...data,
            timestamp: Date.now(),
            createdAt: new Date().toISOString()
        });
    }
    
    // 汎用読み取り
    async read(userId, collection, id) {
        const ref = this.db.ref(`users/${userId}/${collection}/${id}`);
        const snapshot = await ref.once('value');
        return snapshot.val();
    }
    
    // 汎用更新
    async update(userId, collection, id, data) {
        const ref = this.db.ref(`users/${userId}/${collection}/${id}`);
        return await ref.update({
            ...data,
            updatedAt: new Date().toISOString()
        });
    }
    
    // 汎用削除
    async delete(userId, collection, id) {
        const ref = this.db.ref(`users/${userId}/${collection}/${id}`);
        return await ref.remove();
    }
    
    // 汎用リスト取得
    async list(userId, collection, limit = 100) {
        const ref = this.db.ref(`users/${userId}/${collection}`);
        const snapshot = await ref.limitToLast(limit).once('value');
        const data = snapshot.val() || {};
        return Object.entries(data).map(([id, value]) => ({
            id,
            ...value
        }));
    }
}
```

#### 2. database.jsを汎用化
- `saveWeightData` → `saveData(userId, collection, data)`に変更
- `deleteWeightEntry` → `deleteData(userId, collection, id)`に変更
- `watchUserData`のパスを可変に: `users/${userId}/${collection}`
- 体重管理特有の処理を削除

#### 3. data-manager.jsを新規作成
```javascript
// src/services/data-manager.js
import { CRUDService } from './crud.js';

export class DataManager {
    constructor(database, logger) {
        this.crud = new CRUDService(database);
        this.log = logger;
    }
    
    // アプリケーション非依存のデータ管理
    async saveAppData(userId, appType, data) {
        return await this.crud.create(userId, appType, data);
    }
    
    async getAppData(userId, appType) {
        return await this.crud.list(userId, appType);
    }
}
```

### 禁止事項
- `src/services/`以外のフォルダを触らない
- 体重管理専用の機能を残さない

---

## 🎯 AI-2: 基本UIコンポーネント担当

### あなたの作業フォルダ
`src/components/common/`（新規作成してください）

### あなたの作業内容

#### 1. Button.jsを作成
```javascript
// src/components/common/Button.js
export class Button {
    constructor(config = {}) {
        this.text = config.text || 'Button';
        this.onClick = config.onClick || (() => {});
        this.className = config.className || 'btn';
        this.type = config.type || 'primary';
    }
    
    render() {
        const button = document.createElement('button');
        button.textContent = this.text;
        button.className = `${this.className} btn-${this.type}`;
        button.addEventListener('click', this.onClick);
        return button;
    }
}
```

#### 2. Input.jsを作成
```javascript
// src/components/common/Input.js
export class Input {
    constructor(config = {}) {
        this.type = config.type || 'text';
        this.placeholder = config.placeholder || '';
        this.value = config.value || '';
        this.onChange = config.onChange || (() => {});
        this.className = config.className || 'form-input';
    }
    
    render() {
        const input = document.createElement('input');
        input.type = this.type;
        input.placeholder = this.placeholder;
        input.value = this.value;
        input.className = this.className;
        input.addEventListener('change', this.onChange);
        return input;
    }
}
```

#### 3. Modal.jsを作成
```javascript
// src/components/common/Modal.js
export class Modal {
    constructor(config = {}) {
        this.title = config.title || 'Modal';
        this.content = config.content || '';
        this.onClose = config.onClose || (() => {});
    }
    
    render() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${this.title}</h2>
                    <span class="modal-close">&times;</span>
                </div>
                <div class="modal-body">${this.content}</div>
            </div>
        `;
        
        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.close();
        });
        
        return modal;
    }
    
    show() {
        document.body.appendChild(this.render());
    }
    
    close() {
        const modal = document.querySelector('.modal');
        if (modal) {
            modal.remove();
            this.onClose();
        }
    }
}
```

#### 4. Card.jsを作成
```javascript
// src/components/common/Card.js
export class Card {
    constructor(config = {}) {
        this.title = config.title || '';
        this.content = config.content || '';
        this.footer = config.footer || '';
    }
    
    render() {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            ${this.title ? `<div class="card-header">${this.title}</div>` : ''}
            <div class="card-body">${this.content}</div>
            ${this.footer ? `<div class="card-footer">${this.footer}</div>` : ''}
        `;
        return card;
    }
}
```

#### 5. List.jsを作成
```javascript
// src/components/common/List.js
export class List {
    constructor(config = {}) {
        this.items = config.items || [];
        this.renderItem = config.renderItem || (item => item.toString());
        this.className = config.className || 'list';
    }
    
    render() {
        const list = document.createElement('ul');
        list.className = this.className;
        
        this.items.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = this.renderItem(item);
            list.appendChild(li);
        });
        
        return list;
    }
}
```

### 禁止事項
- `src/components/common/`以外のフォルダを触らない
- 体重管理特有の実装を含めない

---

## 🎯 AI-3: カスタム連携システム担当

### あなたの作業フォルダ
`src/custom/`

### あなたの作業内容

#### 1. components/フォルダ構造を作成
```
src/custom/
├── components/
│   └── README.md（カスタムコンポーネントの作り方）
├── loader.js
└── templates/
    ├── todo-app/
    │   ├── config.js
    │   ├── components.js
    │   └── README.md
    └── memo-app/
        ├── config.js
        ├── components.js
        └── README.md
```

#### 2. loader.jsを作成
```javascript
// src/custom/loader.js
export class CustomLoader {
    constructor() {
        this.components = new Map();
    }
    
    // カスタムコンポーネントを登録
    register(name, component) {
        this.components.set(name, component);
    }
    
    // コンポーネントを取得
    get(name) {
        return this.components.get(name);
    }
    
    // 共通コンポーネントをインポート
    async loadCommonComponents() {
        const modules = [
            '../components/common/Button.js',
            '../components/common/Input.js',
            '../components/common/Modal.js',
            '../components/common/Card.js',
            '../components/common/List.js'
        ];
        
        for (const module of modules) {
            try {
                const component = await import(module);
                const name = module.split('/').pop().replace('.js', '');
                this.register(name, component);
            } catch (error) {
                console.error(`Failed to load ${module}:`, error);
            }
        }
    }
}
```

#### 3. templates/todo-app/config.jsを作成
```javascript
// src/custom/templates/todo-app/config.js
export const TODO_CONFIG = {
    name: "TODOアプリ",
    version: "1.0",
    collection: "todos",
    
    fields: {
        title: { type: "text", required: true },
        completed: { type: "boolean", default: false },
        priority: { type: "select", options: ["low", "medium", "high"] },
        dueDate: { type: "date" }
    },
    
    ui: {
        theme: {
            primaryColor: "#4CAF50",
            secondaryColor: "#2196F3"
        }
    }
};
```

#### 4. templates/todo-app/components.jsを作成
```javascript
// src/custom/templates/todo-app/components.js
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';

export class TodoItem extends Card {
    constructor(todo) {
        super({
            title: todo.title,
            content: `Priority: ${todo.priority}`,
            footer: new Button({
                text: todo.completed ? 'Completed' : 'Complete',
                onClick: () => this.toggleComplete(todo)
            }).render().outerHTML
        });
        this.todo = todo;
    }
    
    toggleComplete(todo) {
        todo.completed = !todo.completed;
        // データベース更新処理
    }
}
```

#### 5. templates/memo-app/を同様に作成

### 禁止事項
- `src/custom/`以外のフォルダを触らない
- 体重管理特有の実装を含めない

---

## 🎯 AI-4: ドキュメント・統合担当

### あなたの作業フォルダ
- `docs/`
- `index.html`
- `README.md`

### あなたの作業内容

#### 1. docs/guides/COMPONENT_GUIDE.mdを作成
- 新しいコンポーネントの作り方
- common/からの継承方法
- custom/での拡張方法

#### 2. docs/guides/CUSTOMIZATION_GUIDE.mdを作成
- テンプレートからアプリを作る手順
- TODOアプリへの変換例
- メモアプリへの変換例

#### 3. index.htmlを更新
- 新しいコンポーネントシステムの読み込み
- custom/loader.jsの統合
- 体重管理依存の削除

#### 4. README.mdを更新
- 「真の汎用テンプレート」として書き直し
- 新しいフォルダ構造の説明
- 体重管理は「サンプルの一つ」として記載

### 禁止事項
- src/内のコードを直接変更しない（index.htmlからの参照のみ）
- 他のAIの作業完了を待つ

---

## 📊 作業完了チェックリスト

各AIは作業完了後、以下を更新してください：

| AI番号 | 担当 | 完了状況 | 完了時刻 | メモ |
|--------|------|----------|----------|------|
| AI-1 | 汎用データサービス | [x] 完了 | 2025-01-10 | crud.js, database.js汎用化, data-manager.js作成完了 |
| AI-2 | 基本UIコンポーネント | [ ] 未完了 | - | - |
| AI-3 | カスタム連携システム | [ ] 未完了 | - | - |
| AI-4 | ドキュメント・統合 | [ ] 未完了 | - | - |

---

## 🚀 作業開始

**AI-1、AI-2、AI-3は同時に作業を開始してください。**
**AI-4はAI-1〜3の完了後に作業を開始してください。**

各AIは自分の番号のセクションのみを参照し、指定されたフォルダ内でのみ作業してください。