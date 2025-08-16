# カスタムコンポーネント開発ガイド

## 概要
このディレクトリには、アプリケーション固有のカスタムコンポーネントを配置します。
共通コンポーネント（`src/components/common/`）を継承・拡張して独自の機能を実装できます。

## カスタムコンポーネントの作り方

### 1. 基本的な構造

```javascript
// MyCustomComponent.js
import { BaseComponent } from '../../components/common/BaseComponent.js';

export class MyCustomComponent extends BaseComponent {
    constructor(config) {
        super(config);
        // カスタムプロパティの初期化
        this.customProp = config.customProp || 'default';
    }
    
    render() {
        // カスタムレンダリングロジック
        const element = document.createElement('div');
        element.className = 'my-custom-component';
        element.innerHTML = `
            <h3>${this.title}</h3>
            <p>${this.customProp}</p>
        `;
        return element;
    }
}
```

### 2. 共通コンポーネントの継承

#### Cardコンポーネントを拡張する例
```javascript
import { Card } from '../../components/common/Card.js';

export class InfoCard extends Card {
    constructor(info) {
        super({
            title: info.title,
            content: `
                <div class="info-details">
                    <span class="info-type">${info.type}</span>
                    <p class="info-description">${info.description}</p>
                </div>
            `,
            footer: `Last updated: ${info.lastUpdated}`
        });
        this.info = info;
    }
    
    // カスタムメソッドの追加
    updateInfo(newInfo) {
        this.info = { ...this.info, ...newInfo };
        // DOM更新ロジック
    }
}
```

#### Buttonコンポーネントを拡張する例
```javascript
import { Button } from '../../components/common/Button.js';

export class IconButton extends Button {
    constructor(config) {
        super(config);
        this.icon = config.icon || '📝';
    }
    
    render() {
        const button = super.render();
        button.innerHTML = `${this.icon} ${button.innerHTML}`;
        return button;
    }
}
```

### 3. 複数コンポーネントの組み合わせ

```javascript
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Input } from '../../components/common/Input.js';

export class FormCard extends Card {
    constructor(config) {
        const formContent = document.createElement('div');
        
        // 入力フィールドを追加
        const nameInput = new Input({
            placeholder: 'Enter name',
            onChange: config.onNameChange
        });
        
        // 送信ボタンを追加
        const submitButton = new Button({
            text: 'Submit',
            onClick: config.onSubmit
        });
        
        formContent.appendChild(nameInput.render());
        formContent.appendChild(submitButton.render());
        
        super({
            title: config.title || 'Form',
            content: formContent.innerHTML
        });
    }
}
```

## CustomLoaderとの連携

### コンポーネントの登録
```javascript
import { CustomLoader } from '../loader.js';
import { MyCustomComponent } from './MyCustomComponent.js';

const loader = new CustomLoader();

// カスタムコンポーネントを登録
loader.register('MyCustom', MyCustomComponent);

// 後で取得して使用
const ComponentClass = loader.get('MyCustom');
const instance = new ComponentClass({ customProp: 'value' });
document.body.appendChild(instance.render());
```

### 自動ロード設定
loader.jsに追加して自動ロードすることも可能：
```javascript
// loader.jsに追加
async loadCustomComponents() {
    const customModules = [
        './components/MyCustomComponent.js',
        './components/InfoCard.js',
        // 他のカスタムコンポーネント
    ];
    
    for (const module of customModules) {
        try {
            const component = await import(module);
            const name = module.split('/').pop().replace('.js', '');
            this.register(name, component);
        } catch (error) {
            console.error(`Failed to load custom component ${module}:`, error);
        }
    }
}
```

## ベストプラクティス

### 1. 命名規則
- コンポーネント名は大文字で始める（PascalCase）
- ファイル名もコンポーネント名と同じにする
- 明確で説明的な名前を使用

### 2. プロパティ管理
- デフォルト値を必ず設定
- configオブジェクトでプロパティを受け取る
- 必須プロパティはコンストラクタでチェック

### 3. イベント処理
- イベントハンドラーはconfigで受け取る
- デフォルトの空関数を設定
- イベントの伝播を適切に管理

### 4. スタイリング
- BEMまたは類似の命名規則を使用
- コンポーネント固有のクラス名を付ける
- CSSはコンポーネントファイルの近くに配置

## テンプレートとの連携

テンプレート（todo-app、memo-appなど）でカスタムコンポーネントを使用する場合：

```javascript
// templates/my-app/components.js
import { MyCustomComponent } from '../../components/MyCustomComponent.js';

export class AppSpecificComponent extends MyCustomComponent {
    constructor(data) {
        super({
            customProp: data.specificValue,
            // アプリ固有の設定
        });
    }
}
```

## トラブルシューティング

### インポートエラー
- パスが正しいか確認
- ファイル拡張子（.js）を含めているか確認
- export/importの構文が正しいか確認

### レンダリングの問題
- render()メソッドがDOM要素を返しているか確認
- super.render()を適切に呼び出しているか確認
- イベントリスナーが正しく設定されているか確認

### パフォーマンス
- 不要な再レンダリングを避ける
- イベントリスナーを適切にクリーンアップ
- 大量のデータは仮想スクロールを検討