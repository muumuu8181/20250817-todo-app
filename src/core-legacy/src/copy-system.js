
// ============================================================  
// 📋 Universal Copy Button System v0.01
// 全てのログ・出力・設定にコピーボタンを自動注入
// ============================================================

class UniversalCopySystem {
    constructor() {
        this.injectStyles();
        this.setupGlobalCopyButtons();
        this.hijackConsoleLog();
        this.addKeyboardShortcuts();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .universal-copy-btn {
                background: #007bff;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 4px 8px;
                font-size: 12px;
                cursor: pointer;
                margin-left: 8px;
                position: relative;
                top: -1px;
            }
            .universal-copy-btn:hover {
                background: #0056b3;
            }
            .universal-copy-success {
                background: #28a745 !important;
            }
            .universal-copy-container {
                position: relative;
                display: inline-block;
            }
        `;
        document.head.appendChild(style);
    }

    setupGlobalCopyButtons() {
        // すべてのテキストエリア、pre、codeタグに自動注入
        const addCopyToElement = (element) => {
            if (element.dataset.copyAdded) return;
            
            const container = document.createElement('div');
            container.className = 'universal-copy-container';
            
            const copyBtn = document.createElement('button');
            copyBtn.className = 'universal-copy-btn';
            copyBtn.textContent = 'コピー';
            copyBtn.onclick = () => this.copyToClipboard(element.textContent || element.value, copyBtn);
            
            element.parentNode.insertBefore(container, element);
            container.appendChild(element);
            container.appendChild(copyBtn);
            element.dataset.copyAdded = 'true';
        };

        // 既存要素に追加
        document.querySelectorAll('textarea, pre, code, .log-output').forEach(addCopyToElement);
        
        // 新しく追加される要素も監視
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        const elements = node.querySelectorAll ? 
                            node.querySelectorAll('textarea, pre, code, .log-output') : [];
                        elements.forEach(addCopyToElement);
                    }
                });
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    }

    hijackConsoleLog() {
        const originalLog = console.log;
        console.log = (...args) => {
            originalLog.apply(console, args);
            
            // コンソールログをページに表示（コピーボタン付き）
            const logDiv = document.createElement('div');
            logDiv.className = 'log-output';
            logDiv.textContent = args.join(' ');
            logDiv.style.cssText = `
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                padding: 8px;
                margin: 4px 0;
                font-family: monospace;
                border-radius: 4px;
            `;
            
            document.body.appendChild(logDiv);
        };
    }

    addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+C: 最後のログをコピー
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                const lastLog = document.querySelector('.log-output:last-of-type');
                if (lastLog) {
                    this.copyToClipboard(lastLog.textContent);
                }
            }
        });
    }

    async copyToClipboard(text, button = null) {
        try {
            await navigator.clipboard.writeText(text);
            if (button) {
                const originalText = button.textContent;
                button.textContent = '✓ コピー済み';
                button.classList.add('universal-copy-success');
                setTimeout(() => {
                    button.textContent = originalText;
                    button.classList.remove('universal-copy-success');
                }, 1000);
            }
            console.log('📋 クリップボードにコピーしました');
        } catch (err) {
            console.error('❌ コピー失敗:', err);
            // フォールバック: テキスト選択
            this.selectText(text);
        }
    }

    selectText(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
}

// ページ読み込み時に自動起動
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        new UniversalCopySystem();
        console.log('📋 Universal Copy System 起動完了');
    });
}

export default UniversalCopySystem;
