// Logger Compatibility Layer
// 責務: 既存コードとの互換性維持

import { LoggerService } from '../logger.js';

let globalLogger = null;

export function createCompatLogger(config = {}) {
    // グローバルロガーの作成
    globalLogger = new LoggerService(config);
    
    // 既存のグローバル関数との互換性
    if (typeof window !== 'undefined') {
        // 既存のlog関数を置き換え
        window.log = (message) => globalLogger.info(message);
        
        // 追加の便利関数
        window.logDebug = (message) => globalLogger.debug(message);
        window.logInfo = (message) => globalLogger.info(message);
        window.logWarn = (message) => globalLogger.warn(message);
        window.logError = (message) => globalLogger.error(message);
        
        // ロガー自体も公開（高度な使用のため）
        window.logger = globalLogger;
    }
    
    return globalLogger;
}

export function getGlobalLogger() {
    if (!globalLogger) {
        globalLogger = createCompatLogger();
    }
    return globalLogger;
}

// 既存コードからの移行を容易にするヘルパー
export function migrateConsoleLog() {
    const logger = getGlobalLogger();
    
    // console.logをロガーにリダイレクト（開発環境のみ推奨）
    const originalConsole = {
        log: console.log,
        debug: console.debug,
        info: console.info,
        warn: console.warn,
        error: console.error
    };
    
    console.log = (...args) => {
        logger.info(args.join(' '));
        originalConsole.log(...args);
    };
    
    console.debug = (...args) => {
        logger.debug(args.join(' '));
        originalConsole.debug(...args);
    };
    
    console.warn = (...args) => {
        logger.warn(args.join(' '));
        originalConsole.warn(...args);
    };
    
    console.error = (...args) => {
        logger.error(args.join(' '));
        originalConsole.error(...args);
    };
    
    return originalConsole;
}