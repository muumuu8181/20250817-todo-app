// Base Log Adapter
// 責務: ログアダプタの基底クラス定義

export class LogAdapter {
    constructor(config = {}) {
        this.enabled = config.enabled !== false;
    }

    write(level, message, context, timestamp) {
        throw new Error('Subclass must implement write method');
    }

    enable() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
    }

    isEnabled() {
        return this.enabled;
    }
}