// UI Log Adapter
// 責務: DOM要素へのログ出力

import { LogAdapter } from './base.js';

export class UIAdapter extends LogAdapter {
    constructor(config = {}) {
        super(config);
        this.elementId = config.elementId || 'logArea';
        this.maxEntries = config.maxEntries || 100;
        this.autoScroll = config.autoScroll !== false;
        this.showTimestamp = config.showTimestamp !== false;
        this.showLevel = config.showLevel !== false;
    }

    write(level, message, context, timestamp) {
        if (!this.isEnabled()) return;

        const element = document.getElementById(this.elementId);
        if (!element) return;

        // ログエントリの作成
        const logEntry = this.formatLogEntry(level, message, timestamp);
        
        // HTMLとして追加
        element.innerHTML += logEntry;
        
        // 最大エントリ数の制限
        this.limitEntries(element);
        
        // 自動スクロール
        if (this.autoScroll) {
            element.scrollTop = element.scrollHeight;
        }
    }

    formatLogEntry(level, message, timestamp) {
        let entry = '';
        
        if (this.showTimestamp) {
            entry += `[${timestamp}] `;
        }
        
        if (this.showLevel && level !== 'info') {
            const levelClass = this.getLevelClass(level);
            entry += `<span class="${levelClass}">[${level.toUpperCase()}]</span> `;
        }
        
        entry += `${this.escapeHtml(message)}<br>`;
        
        return entry;
    }

    getLevelClass(level) {
        switch (level) {
            case 'debug':
                return 'log-debug';
            case 'warn':
                return 'log-warn';
            case 'error':
                return 'log-error';
            default:
                return 'log-info';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    limitEntries(element) {
        const lines = element.innerHTML.split('<br>');
        if (lines.length > this.maxEntries) {
            const toKeep = lines.slice(-this.maxEntries);
            element.innerHTML = toKeep.join('<br>');
        }
    }
}