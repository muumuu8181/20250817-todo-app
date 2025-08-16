// Console Log Adapter
// 責務: コンソールへのログ出力

import { LogAdapter } from './base.js';

export class ConsoleAdapter extends LogAdapter {
    constructor(config = {}) {
        super(config);
        this.useColors = config.useColors !== false;
    }

    write(level, message, context, timestamp) {
        if (!this.isEnabled()) return;

        const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
        const fullMessage = `${prefix} ${message}`;

        // コンソールメソッドの選択
        const consoleMethod = this.getConsoleMethod(level);
        
        // コンテキストがある場合は一緒に出力
        if (context && Object.keys(context).length > 0) {
            consoleMethod(fullMessage, context);
        } else {
            consoleMethod(fullMessage);
        }
    }

    getConsoleMethod(level) {
        switch (level) {
            case 'debug':
                return console.debug;
            case 'info':
                return console.info;
            case 'warn':
                return console.warn;
            case 'error':
                return console.error;
            default:
                return console.log;
        }
    }
}