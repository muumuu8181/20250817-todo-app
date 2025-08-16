// Logger Service
// 責務: ログ管理の中心的なサービス

import { LOG_LEVELS, DEFAULT_LOG_LEVEL, shouldLog } from './logger/levels.js';
import { ConsoleAdapter } from './logger/adapters/console.js';
import { UIAdapter } from './logger/adapters/ui.js';

export class LoggerService {
    constructor(config = {}) {
        this.logLevel = config.logLevel || DEFAULT_LOG_LEVEL;
        this.adapters = new Map();
        this.context = config.context || {};
        
        // アダプタの初期化
        this.initializeAdapters(config);
    }

    initializeAdapters(config) {
        const outputs = config.outputs || ['console', 'ui'];
        
        if (outputs.includes('console')) {
            this.adapters.set('console', new ConsoleAdapter(config.console || {}));
        }
        
        if (outputs.includes('ui')) {
            this.adapters.set('ui', new UIAdapter(config.ui || {}));
        }
        
        // カスタムアダプタの追加
        if (config.customAdapters) {
            for (const [name, adapter] of Object.entries(config.customAdapters)) {
                this.adapters.set(name, adapter);
            }
        }
    }

    // ログメソッド
    debug(message, context = {}) {
        this.log('debug', message, context);
    }

    info(message, context = {}) {
        this.log('info', message, context);
    }

    warn(message, context = {}) {
        this.log('warn', message, context);
    }

    error(message, context = {}) {
        this.log('error', message, context);
    }

    // 汎用ログメソッド
    log(level, message, context = {}) {
        if (!shouldLog(level, this.logLevel)) {
            return;
        }

        const timestamp = this.getTimestamp();
        const mergedContext = { ...this.context, ...context };

        // 全てのアダプタに出力
        for (const adapter of this.adapters.values()) {
            if (adapter.isEnabled()) {
                adapter.write(level, message, mergedContext, timestamp);
            }
        }
    }

    // 設定変更メソッド
    setLogLevel(level) {
        if (LOG_LEVELS.hasOwnProperty(level)) {
            this.logLevel = level;
            this.info(`Log level changed to: ${level}`);
        } else {
            this.warn(`Invalid log level: ${level}`);
        }
    }

    enableOutput(outputName) {
        const adapter = this.adapters.get(outputName);
        if (adapter) {
            adapter.enable();
            this.debug(`Output enabled: ${outputName}`);
        }
    }

    disableOutput(outputName) {
        const adapter = this.adapters.get(outputName);
        if (adapter) {
            adapter.disable();
            this.debug(`Output disabled: ${outputName}`);
        }
    }

    // ユーティリティ
    getTimestamp() {
        return new Date().toLocaleTimeString('ja-JP', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    // コンテキスト管理
    setContext(context) {
        this.context = { ...this.context, ...context };
    }

    clearContext() {
        this.context = {};
    }

    // アダプタ管理
    addAdapter(name, adapter) {
        this.adapters.set(name, adapter);
    }

    removeAdapter(name) {
        this.adapters.delete(name);
    }

    getAdapter(name) {
        return this.adapters.get(name);
    }
}

// デフォルトインスタンスのエクスポート
export const logger = new LoggerService();

// 互換性のための関数
export function createLogger(config) {
    return new LoggerService(config);
}