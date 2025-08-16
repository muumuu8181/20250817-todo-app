/**
 * PanelSystem Component v1.0
 * パネル表示システム
 * 
 * 機能:
 * - L/M/Sサイズ階層
 * - パネル番号表示
 * - モード切り替え
 */

export class PanelSystem {
    constructor() {
        this.isActive = true; // デフォルトでパネルモードON
        this.panelStyles = {
            L: {
                border: '3px solid #007bff',
                padding: '20px',
                margin: '15px 0'
            },
            M: {
                border: '2px solid #007bff',
                padding: '15px',
                margin: '10px 0'
            },
            S: {
                border: '1px solid #007bff',
                padding: '10px',
                margin: '5px 0'
            }
        };
    }

    // パネルモード切り替え
    toggle() {
        this.isActive = !this.isActive;
        document.body.classList.toggle('panel-mode');
        return this.isActive;
    }

    // パネル作成
    createPanel(config = {}) {
        const {
            number = '[1]',
            size = 'M', // L, M, S
            content = '',
            className = '',
            dataGrid = ''
        } = config;

        const panel = document.createElement('div');
        panel.className = `section-panel panel-${size} ${className}`.trim();
        
        if (dataGrid) {
            panel.setAttribute('data-grid', dataGrid);
        }

        // パネル番号
        const numberSpan = document.createElement('span');
        numberSpan.className = 'panel-number';
        numberSpan.textContent = number;
        panel.appendChild(numberSpan);

        // コンテンツ追加
        if (content) {
            if (typeof content === 'string') {
                const contentDiv = document.createElement('div');
                contentDiv.innerHTML = content;
                panel.appendChild(contentDiv);
            } else if (content instanceof HTMLElement) {
                panel.appendChild(content);
            }
        }

        return panel;
    }

    // パネルスタイル適用
    applyStyles() {
        let styleSheet = document.getElementById('panel-system-styles');
        if (!styleSheet) {
            styleSheet = document.createElement('style');
            styleSheet.id = 'panel-system-styles';
            document.head.appendChild(styleSheet);
        }

        styleSheet.textContent = `
            /* パネル表示モード */
            body.panel-mode .section-panel {
                position: relative;
                border-radius: 8px;
                background: white;
                box-shadow: 0 2px 5px rgba(0,123,255,0.2);
            }
            
            body.panel-mode .panel-L {
                border: ${this.panelStyles.L.border};
                padding: ${this.panelStyles.L.padding};
                margin: ${this.panelStyles.L.margin};
            }
            
            body.panel-mode .panel-M {
                border: ${this.panelStyles.M.border};
                padding: ${this.panelStyles.M.padding};
                margin: ${this.panelStyles.M.margin};
            }
            
            body.panel-mode .panel-S {
                border: ${this.panelStyles.S.border};
                padding: ${this.panelStyles.S.padding};
                margin: ${this.panelStyles.S.margin};
            }
            
            body.panel-mode .panel-number {
                display: block;
                position: absolute;
                top: -15px;
                left: 15px;
                background: #007bff;
                color: white;
                padding: 2px 10px;
                font-weight: bold;
                font-size: 16px;
                border-radius: 4px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                z-index: 10;
            }
            
            /* 通常モード */
            body:not(.panel-mode) .section-panel {
                position: relative;
                padding: 10px;
                margin: 10px 0;
            }
            
            body:not(.panel-mode) .panel-number {
                display: none;
            }
        `;
    }

    // 初期化
    init() {
        this.applyStyles();
        if (this.isActive) {
            document.body.classList.add('panel-mode');
        }
    }
}

// シングルトンインスタンスとして提供
export const panelSystem = new PanelSystem();