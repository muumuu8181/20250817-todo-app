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
            '../components/common/List.js',
            '../components/common/Panel.js',
            '../components/common/Form.js',
            '../components/common/Select.js',
            '../components/common/Loading.js',
            '../components/common/Alert.js'
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