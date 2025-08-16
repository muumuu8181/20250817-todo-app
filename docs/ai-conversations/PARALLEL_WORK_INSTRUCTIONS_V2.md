# 🤖 並列AI作業指示書 v2（UI改善編）

このドキュメントは4体のAIが並列で作業するための指示書です。
各AIは自分の番号の指示のみを読んで作業してください。

**作業ディレクトリ:** `/mnt/c/Users/user/Desktop/work/90_cc/20250810/0000-00-00-project-template-clone/`

---

## 📌 重要事項
- **他のAIの作業フォルダには絶対に触らないこと**
- **作業完了後、完了報告を残すこと**
- **不明点があれば作業を止めて確認すること**

---

## 🎯 AI-1: 追加コンポーネント担当

### あなたの作業フォルダ
`src/components/common/`

### あなたの作業内容

#### 1. Form.jsを作成
```javascript
// src/components/common/Form.js
export class Form {
    constructor(config = {}) {
        this.fields = config.fields || [];
        this.onSubmit = config.onSubmit || (() => {});
        this.submitText = config.submitText || 'Submit';
        this.id = `form-${Date.now()}`;
    }
    
    render() {
        const form = document.createElement('form');
        form.id = this.id;
        form.className = 'form';
        
        this.fields.forEach(field => {
            const fieldWrapper = document.createElement('div');
            fieldWrapper.className = 'form-field';
            
            const label = document.createElement('label');
            label.textContent = field.label;
            label.htmlFor = field.name;
            
            let input;
            switch(field.type) {
                case 'textarea':
                    input = document.createElement('textarea');
                    break;
                case 'select':
                    input = document.createElement('select');
                    if (field.options) {
                        field.options.forEach(opt => {
                            const option = document.createElement('option');
                            option.value = opt.value || opt;
                            option.textContent = opt.label || opt;
                            input.appendChild(option);
                        });
                    }
                    break;
                default:
                    input = document.createElement('input');
                    input.type = field.type || 'text';
            }
            
            input.name = field.name;
            input.id = field.name;
            input.className = 'form-control';
            if (field.required) input.required = true;
            if (field.value) input.value = field.value;
            
            fieldWrapper.appendChild(label);
            fieldWrapper.appendChild(input);
            form.appendChild(fieldWrapper);
        });
        
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.className = 'btn btn-primary';
        submitBtn.textContent = this.submitText;
        
        form.appendChild(submitBtn);
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            this.onSubmit(data);
        });
        
        return form;
    }
    
    getData() {
        const form = document.getElementById(this.id);
        if (form) {
            const formData = new FormData(form);
            return Object.fromEntries(formData);
        }
        return {};
    }
}
```

#### 2. Select.jsを作成
```javascript
// src/components/common/Select.js
export class Select {
    constructor(config = {}) {
        this.options = config.options || [];
        this.value = config.value || '';
        this.onChange = config.onChange || (() => {});
        this.placeholder = config.placeholder || 'Select...';
        this.multiple = config.multiple || false;
    }
    
    render() {
        const select = document.createElement('select');
        select.className = 'select';
        if (this.multiple) select.multiple = true;
        
        if (this.placeholder && !this.multiple) {
            const placeholder = document.createElement('option');
            placeholder.value = '';
            placeholder.textContent = this.placeholder;
            placeholder.disabled = true;
            placeholder.selected = !this.value;
            select.appendChild(placeholder);
        }
        
        this.options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value || option;
            opt.textContent = option.label || option;
            if (opt.value === this.value) opt.selected = true;
            select.appendChild(opt);
        });
        
        select.addEventListener('change', (e) => {
            this.value = e.target.value;
            this.onChange(this.value);
        });
        
        return select;
    }
}
```

#### 3. Loading.jsを作成
```javascript
// src/components/common/Loading.js
export class Loading {
    constructor(config = {}) {
        this.text = config.text || 'Loading...';
        this.type = config.type || 'spinner';
        this.size = config.size || 'medium';
    }
    
    render() {
        const loading = document.createElement('div');
        loading.className = `loading loading-${this.size}`;
        
        if (this.type === 'spinner') {
            loading.innerHTML = `
                <div class="spinner"></div>
                <span class="loading-text">${this.text}</span>
            `;
        } else if (this.type === 'bar') {
            loading.innerHTML = `
                <div class="loading-bar">
                    <div class="loading-bar-progress"></div>
                </div>
                <span class="loading-text">${this.text}</span>
            `;
        } else if (this.type === 'dots') {
            loading.innerHTML = `
                <div class="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <span class="loading-text">${this.text}</span>
            `;
        }
        
        return loading;
    }
    
    show() {
        const loading = this.render();
        loading.id = 'global-loading';
        document.body.appendChild(loading);
    }
    
    hide() {
        const loading = document.getElementById('global-loading');
        if (loading) loading.remove();
    }
}
```

#### 4. Alert.jsを作成
```javascript
// src/components/common/Alert.js
export class Alert {
    constructor(config = {}) {
        this.message = config.message || '';
        this.type = config.type || 'info'; // info, success, warning, error
        this.dismissible = config.dismissible !== false;
        this.autoHide = config.autoHide || 0;
    }
    
    render() {
        const alert = document.createElement('div');
        alert.className = `alert alert-${this.type}`;
        
        const icon = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        }[this.type];
        
        alert.innerHTML = `
            <span class="alert-icon">${icon}</span>
            <span class="alert-message">${this.message}</span>
            ${this.dismissible ? '<button class="alert-close">&times;</button>' : ''}
        `;
        
        if (this.dismissible) {
            alert.querySelector('.alert-close').addEventListener('click', () => {
                alert.remove();
            });
        }
        
        if (this.autoHide > 0) {
            setTimeout(() => alert.remove(), this.autoHide);
        }
        
        return alert;
    }
    
    show() {
        const alertContainer = document.getElementById('alert-container') || 
                              (() => {
                                  const container = document.createElement('div');
                                  container.id = 'alert-container';
                                  container.className = 'alert-container';
                                  document.body.appendChild(container);
                                  return container;
                              })();
        
        alertContainer.appendChild(this.render());
    }
    
    static success(message, autoHide = 3000) {
        new Alert({ message, type: 'success', autoHide }).show();
    }
    
    static error(message) {
        new Alert({ message, type: 'error' }).show();
    }
    
    static warning(message) {
        new Alert({ message, type: 'warning' }).show();
    }
    
    static info(message) {
        new Alert({ message, type: 'info' }).show();
    }
}
```

### 禁止事項
- `src/components/common/`以外のフォルダを触らない
- 既存のコンポーネント（Button.js等）を変更しない

---

## 🎯 AI-2: レスポンシブCSS担当

### あなたの作業フォルダ
`src/custom/`

### あなたの作業内容

#### 1. styles-responsive.cssを更新（モバイル縦長強制）
```css
/* src/custom/styles-responsive.css に追加 */

/* パネルシステムのスタイル */
.panel {
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-bottom: 15px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.panel-header {
    background: #f8f9fa;
    padding: 10px 15px;
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
}

.panel-number {
    font-weight: bold;
    color: #007bff;
    margin-right: 10px;
    font-size: 16px;
}

.panel-title {
    flex: 1;
    font-weight: 500;
}

.panel-toggle {
    background: none;
    border: none;
    font-size: 12px;
    cursor: pointer;
    padding: 5px;
}

.panel-body {
    padding: 15px;
    transition: all 0.3s ease;
}

.panel-body.hidden {
    display: none;
}

.panel.collapsed .panel-body {
    display: none;
}

.panels-header {
    background: #007bff;
    color: white;
    padding: 10px;
    font-weight: bold;
    position: sticky;
    top: 0;
    z-index: 100;
}

/* モバイル専用（縦長強制） */
@media (max-width: 767px) {
    /* 横スクロール完全禁止 */
    html, body {
        overflow-x: hidden;
        max-width: 100vw;
    }
    
    /* パネルを縦積み */
    .panels-container {
        padding: 5px;
    }
    
    .panel {
        width: 100%;
        margin-bottom: 10px;
    }
    
    /* パネル番号を大きく */
    .panel-number {
        font-size: 20px;
        background: #007bff;
        color: white;
        padding: 2px 8px;
        border-radius: 4px;
    }
    
    /* ボタンを整理 */
    .btn-group {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    
    .btn {
        width: 100%;
        padding: 12px;
        font-size: 16px;
    }
    
    /* フォームを縦長に */
    .form-field {
        margin-bottom: 15px;
    }
    
    .form-control {
        width: 100%;
        padding: 10px;
        font-size: 16px;
    }
    
    /* アラートを全幅に */
    .alert-container {
        position: fixed;
        top: 50px;
        left: 0;
        right: 0;
        padding: 10px;
        z-index: 1000;
    }
    
    /* 横向き禁止メッセージ */
    @media (orientation: landscape) {
        body::before {
            content: "📱 縦向きでご利用ください";
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 9999;
            font-size: 18px;
        }
    }
}

/* タブレット・PC（横長OK） */
@media (min-width: 768px) {
    .panels-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 20px;
        padding: 20px;
    }
    
    .panel {
        height: fit-content;
    }
    
    /* デバッグパネルは下部に固定 */
    .panel-debug {
        grid-column: 1 / -1;
    }
    
    /* ボタングループを横並び */
    .btn-group {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    }
}

/* コンポーネントスタイル */
.form {
    width: 100%;
}

.form-field {
    margin-bottom: 15px;
}

.form-field label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
}

.form-control,
.select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

/* ローディング */
.loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.spinner {
    width: 24px;
    height: 24px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading-text {
    margin-left: 10px;
}

/* アラート */
.alert {
    padding: 12px 20px;
    border-radius: 4px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
}

.alert-info { background: #d1ecf1; border: 1px solid #bee5eb; }
.alert-success { background: #d4edda; border: 1px solid #c3e6cb; }
.alert-warning { background: #fff3cd; border: 1px solid #ffeaa7; }
.alert-error { background: #f8d7da; border: 1px solid #f5c6cb; }

.alert-icon {
    margin-right: 10px;
}

.alert-close {
    margin-left: auto;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    opacity: 0.5;
}

.alert-close:hover {
    opacity: 1;
}
```

### 禁止事項
- `src/custom/`以外のフォルダを触らない
- JavaScriptファイルを変更しない

---

## 🎯 AI-3: index.html簡素化担当

### あなたの作業ファイル
`index.html`

### あなたの作業内容

#### 1. 不要なボタンを削除
以下のボタンを削除：
- Firebase接続確認ボタン
- データ構造確認ボタン  
- ログイン問題診断ボタン
- エラー収集テストボタン（重複分）
- その他デバッグ系の重複ボタン

目標：21個 → 5個以下

#### 2. パネル構成に変更
```html
<!-- 基本構造に変更 -->
<body>
    <div id="app">
        <div class="panels-container">
            <!-- パネル1: メイン -->
            <div class="panel" data-panel-id="main">
                <div class="panel-header">
                    <span class="panel-number">[1]</span>
                    <span class="panel-title">メイン</span>
                </div>
                <div class="panel-body">
                    <div id="main-content"></div>
                </div>
            </div>
            
            <!-- パネル2: データ -->
            <div class="panel" data-panel-id="data">
                <div class="panel-header">
                    <span class="panel-number">[2]</span>
                    <span class="panel-title">データ</span>
                </div>
                <div class="panel-body">
                    <div id="data-content"></div>
                </div>
            </div>
            
            <!-- パネル3: 設定 -->
            <div class="panel" data-panel-id="settings">
                <div class="panel-header">
                    <span class="panel-number">[3]</span>
                    <span class="panel-title">設定</span>
                </div>
                <div class="panel-body">
                    <div id="settings-content"></div>
                </div>
            </div>
            
            <!-- パネル4: ツール（折りたたみ） -->
            <div class="panel collapsed" data-panel-id="tools">
                <div class="panel-header">
                    <span class="panel-number">[4]</span>
                    <span class="panel-title">ツール</span>
                    <button class="panel-toggle">▶</button>
                </div>
                <div class="panel-body hidden">
                    <div id="tools-content"></div>
                </div>
            </div>
            
            <!-- パネル5: デバッグ（折りたたみ） -->
            <div class="panel collapsed panel-debug" data-panel-id="debug">
                <div class="panel-header">
                    <span class="panel-number">[5]</span>
                    <span class="panel-title">デバッグ</span>
                    <button class="panel-toggle">▶</button>
                </div>
                <div class="panel-body hidden">
                    <div id="debug-content"></div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- レスポンシブCSS追加 -->
    <link rel="stylesheet" href="src/custom/styles-responsive.css">
</body>
```

#### 3. スクリプトを整理
- 重複する関数を削除
- デバッグ関数を1つに統合
- 未使用の関数を削除

### 禁止事項
- src/フォルダ内のファイルを変更しない
- 基本機能（Firebase接続等）を壊さない

---

## 🎯 AI-4: 統合・テスト担当

### あなたの作業
全体の統合とテスト

### あなたの作業内容

#### 1. loader.jsを更新
```javascript
// src/custom/loader.js に追加
const newModules = [
    '../components/common/Form.js',
    '../components/common/Select.js',
    '../components/common/Loading.js',
    '../components/common/Alert.js',
    '../components/common/Panel.js'
];
```

#### 2. テストページ作成
`test-new-components.html`を作成して、新しいコンポーネントの動作確認

#### 3. ドキュメント更新
- `docs/guides/COMPONENT_GUIDE.md`に新コンポーネントを追加
- `README.md`のバージョンをv0.25に更新

#### 4. 最終確認
- すべてのパネルが表示されるか
- レスポンシブが機能するか
- 新コンポーネントが動作するか

### 禁止事項
- 他のAIの作業が完了する前に始めない

---

## 📊 作業完了チェックリスト

| AI番号 | 担当 | 完了状況 | 完了時刻 | メモ |
|--------|------|----------|----------|------|
| AI-1 | 追加コンポーネント | [ ] 未完了 | - | Form, Select, Loading, Alert |
| AI-2 | レスポンシブCSS | [ ] 未完了 | - | モバイル縦長強制 |
| AI-3 | index.html簡素化 | [ ] 未完了 | - | パネル化、ボタン削減 |
| AI-4 | 統合・テスト | [ ] 未完了 | - | 最後に実行 |

---

## 🚀 作業開始

**AI-1、AI-2、AI-3は同時に作業を開始してください。**
**AI-4はAI-1〜3の完了後に作業を開始してください。**

各AIは自分の番号のセクションのみを参照し、指定されたフォルダ/ファイル内でのみ作業してください。