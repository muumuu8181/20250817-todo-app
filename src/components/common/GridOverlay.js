/**
 * GridOverlay Component v1.0
 * グリッドオーバーレイ表示システム
 * 
 * 機能:
 * - 33x33グリッド（3%単位）
 * - A-T列ラベル、1-33行番号
 * - 分数グリッド位置調整
 */

export class GridOverlay {
    constructor() {
        this.gridSize = 0.03; // 3%グリッド
        this.gridCount = 33;
        this.columns = 'ABCDEFGHIJKLMNOPQRST'.split('');
        this.overlayId = 'gridOverlay';
        this.isActive = false;
    }

    // グリッドモード切り替え
    toggle() {
        this.isActive = !this.isActive;
        document.body.classList.toggle('grid-mode');
        
        if (this.isActive) {
            this.create();
            return true;
        } else {
            this.remove();
            return false;
        }
    }

    // グリッドオーバーレイ作成
    create() {
        this.remove(); // 既存を削除
        
        const overlay = document.createElement('div');
        overlay.className = 'grid-overlay';
        overlay.id = this.overlayId;
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999999;
        `;
        
        // グリッド線を追加
        this.addGridLines(overlay);
        
        // ラベルを追加
        this.addGridLabels(overlay);
        
        document.body.appendChild(overlay);
    }

    // グリッド線を追加
    addGridLines(overlay) {
        for (let i = 0; i <= this.gridCount; i++) {
            // 垂直線
            const vLine = document.createElement('div');
            vLine.style.cssText = `
                position: absolute;
                left: ${i * 3}%;
                top: 0;
                width: 1px;
                height: 100%;
                background: rgba(40,167,69,0.2);
                z-index: 999998;
            `;
            overlay.appendChild(vLine);
            
            // 水平線
            const hLine = document.createElement('div');
            hLine.style.cssText = `
                position: absolute;
                left: 0;
                top: ${i * 3}%;
                width: 100%;
                height: 1px;
                background: rgba(40,167,69,0.2);
                z-index: 999998;
            `;
            overlay.appendChild(hLine);
        }
    }

    // グリッドラベルを追加
    addGridLabels(overlay) {
        // 5グリッドごとにラベル表示
        for (let row = 0; row <= this.gridCount; row += 5) {
            for (let col = 0; col <= this.gridCount; col += 5) {
                if (row === 0 || col === 0) {
                    const label = document.createElement('div');
                    label.className = 'grid-number';
                    label.style.cssText = `
                        position: absolute;
                        font-size: 11px;
                        color: rgba(40,167,69,0.9);
                        font-weight: bold;
                        background: rgba(255,255,255,0.95);
                        padding: 2px 4px;
                        border-radius: 2px;
                        border: 1px solid rgba(40,167,69,0.3);
                        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                        z-index: 999999;
                    `;
                    
                    if (row === 0 && col === 0) {
                        // 左上コーナーは空
                        label.textContent = '';
                    } else if (row === 0 && col > 0 && col <= 20) {
                        // 上部に列ラベル（A,B,C...）
                        label.textContent = this.columns[col - 1];
                        label.style.left = `${col * 3 - 1.5}%`;
                        label.style.top = '10px';
                    } else if (col === 0 && row > 0) {
                        // 左側に行番号（1,2,3...）
                        label.textContent = row.toString();
                        label.style.left = '10px';
                        label.style.top = `${row * 3 - 1.5}%`;
                    }
                    
                    if (label.textContent) {
                        overlay.appendChild(label);
                    }
                }
            }
        }
    }

    // グリッドオーバーレイ削除
    remove() {
        const overlay = document.getElementById(this.overlayId);
        if (overlay) overlay.remove();
    }

    // グリッド位置調整
    adjustPosition(selector, gridCode, adjustment) {
        const element = document.querySelector(selector);
        if (!element) {
            console.error(`要素が見つかりません: ${selector}`);
            return false;
        }
        
        // グリッドコードの解析 (例: "B4" → 列B(2), 行4)
        const match = gridCode.match(/^([A-T])(\d+)(?:-([A-T])?(\d+)?)?$/);
        if (!match) {
            console.error(`無効なグリッドコード: ${gridCode}`);
            return false;
        }
        
        const gridWidth = window.innerWidth * this.gridSize;
        const gridHeight = window.innerHeight * this.gridSize;
        
        // 現在のスタイルを取得
        const currentStyle = window.getComputedStyle(element);
        const currentWidth = parseFloat(currentStyle.width);
        const currentHeight = parseFloat(currentStyle.height);
        
        // 調整を適用
        element.style.width = `${currentWidth + (adjustment * gridWidth)}px`;
        element.style.height = `${currentHeight + (adjustment * gridHeight)}px`;
        
        console.log(`✅ グリッド調整完了: ${selector} @ ${gridCode} (${adjustment > 0 ? '+' : ''}${adjustment}グリッド)`);
        return true;
    }

    // グリッド位置取得
    getPosition(selector) {
        const element = document.querySelector(selector);
        if (!element) {
            console.error(`要素が見つかりません: ${selector}`);
            return null;
        }
        
        const rect = element.getBoundingClientRect();
        const gridCol = Math.floor(rect.left / (window.innerWidth * this.gridSize));
        const gridRow = Math.floor(rect.top / (window.innerHeight * this.gridSize));
        
        if (gridCol >= 0 && gridCol < this.columns.length) {
            const colLetter = this.columns[gridCol];
            const position = `${colLetter}${gridRow + 1}`;
            console.log(`📍 グリッド位置: ${selector} → ${position}`);
            return position;
        }
        
        return `Col${gridCol + 1}-Row${gridRow + 1}`;
    }
}

// シングルトンインスタンスとして提供
export const gridOverlay = new GridOverlay();