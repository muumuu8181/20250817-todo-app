// Log Level Definitions
// 責務: ログレベルの定義と優先度管理

export const LOG_LEVELS = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
};

export const DEFAULT_LOG_LEVEL = 'info';

export function shouldLog(messageLevel, configuredLevel) {
    const messagePriority = LOG_LEVELS[messageLevel] || 0;
    const configuredPriority = LOG_LEVELS[configuredLevel] || 0;
    return messagePriority >= configuredPriority;
}