// ============================================================
// 🚨 エラー自動収集システム - Firebase連携
// ============================================================
import { getDatabase, ref, push, set, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';

class ErrorCollector {
    constructor() {
        this.database = null;
        this.auth = null;
        this.appInfo = {
            name: "Universal Template",
            version: "0.2",
            url: window.location.href
        };
        this.errorCache = new Map(); // 重複防止用
        this.initialized = false;
    }

    // 初期化
    init(database, auth, appConfig = {}) {
        this.database = database;
        this.auth = auth;
        this.appInfo = { ...this.appInfo, ...appConfig };
        this.setupGlobalErrorHandlers();
        this.initialized = true;
        console.log('🚨 エラー収集システム初期化完了');
    }

    // グローバルエラーハンドラーの設定
    setupGlobalErrorHandlers() {
        // JavaScript エラー
        window.addEventListener('error', (event) => {
            this.collectError({
                type: 'javascript-error',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
        });

        // Promise rejection エラー
        window.addEventListener('unhandledrejection', (event) => {
            this.collectError({
                type: 'promise-rejection',
                message: event.reason?.message || String(event.reason),
                error: event.reason
            });
        });

        // Firebase エラーの監視
        this.setupFirebaseErrorMonitoring();
    }

    // Firebase特有のエラー監視
    setupFirebaseErrorMonitoring() {
        // 認証エラー
        if (this.auth) {
            this.auth.onAuthStateChanged((user) => {}, (error) => {
                this.collectError({
                    type: 'firebase-auth-error',
                    message: error.message,
                    code: error.code,
                    error: error
                });
            });
        }

        // データベース接続エラー（オーバーライド）
        const originalConsoleError = console.error;
        console.error = (...args) => {
            const message = args.join(' ');
            if (message.includes('Firebase') || message.includes('permission_denied')) {
                this.collectError({
                    type: 'firebase-database-error',
                    message: message,
                    args: args
                });
            }
            originalConsoleError.apply(console, args);
        };
    }

    // エラー収集メイン関数
    async collectError(errorInfo) {
        if (!this.initialized || !this.database) {
            console.warn('エラー収集システム未初期化');
            return;
        }

        try {
            const errorData = this.formatErrorData(errorInfo);
            
            // 重複チェック
            if (this.isDuplicateError(errorData)) {
                console.log('重複エラーのためスキップ:', errorData.signature);
                return;
            }

            // Firebaseに保存
            await this.saveErrorToFirebase(errorData);
            
            // キャッシュに追加
            this.addToErrorCache(errorData);
            
            console.log('🚨 エラー収集完了:', errorData.id);
        } catch (error) {
            console.error('エラー収集中にエラー発生:', error);
        }
    }

    // エラーデータのフォーマット
    formatErrorData(errorInfo) {
        const timestamp = Date.now();
        const errorId = `error_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
        
        return {
            id: errorId,
            appName: this.appInfo.name,
            appVersion: this.appInfo.version,
            url: this.appInfo.url,
            timestamp: timestamp,
            dateString: new Date(timestamp).toISOString(),
            type: errorInfo.type,
            message: errorInfo.message,
            stack: errorInfo.error?.stack || 'No stack trace',
            filename: errorInfo.filename || 'unknown',
            lineno: errorInfo.lineno || 0,
            colno: errorInfo.colno || 0,
            userAgent: navigator.userAgent,
            userId: this.auth?.currentUser?.uid || 'anonymous',
            userEmail: this.auth?.currentUser?.email || null,
            signature: this.createErrorSignature(errorInfo) // 重複検出用
        };
    }

    // エラー署名作成（重複検出用）
    createErrorSignature(errorInfo) {
        return `${errorInfo.type}-${errorInfo.message}-${errorInfo.filename}`.substring(0, 100);
    }

    // 重複エラーチェック
    isDuplicateError(errorData) {
        const cachedTime = this.errorCache.get(errorData.signature);
        if (!cachedTime) return false;
        
        // 1時間以内の重複は無視
        const oneHour = 60 * 60 * 1000;
        return (Date.now() - cachedTime) < oneHour;
    }

    // エラーキャッシュに追加
    addToErrorCache(errorData) {
        this.errorCache.set(errorData.signature, errorData.timestamp);
        
        // キャッシュサイズ制限（最大100件）
        if (this.errorCache.size > 100) {
            const firstKey = this.errorCache.keys().next().value;
            this.errorCache.delete(firstKey);
        }
    }

    // Firebaseにエラー保存
    async saveErrorToFirebase(errorData) {
        try {
            const errorsRef = ref(this.database, 'system/errors');
            await push(errorsRef, errorData);
            
            // 統計情報も更新
            await this.updateErrorStats(errorData);
        } catch (error) {
            console.error('Firebase保存エラー:', error);
            throw error;
        }
    }

    // エラー統計の更新
    async updateErrorStats(errorData) {
        try {
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            const statsRef = ref(this.database, `system/error-stats/${today}/${errorData.appName}`);
            
            // 今日のエラー数をカウント
            const snapshot = await get(statsRef);
            const currentCount = snapshot.val()?.count || 0;
            
            await set(statsRef, {
                count: currentCount + 1,
                lastError: errorData.timestamp,
                lastErrorType: errorData.type
            });
        } catch (error) {
            console.warn('エラー統計更新失敗:', error);
        }
    }

    // 手動エラー報告
    reportError(message, details = {}) {
        this.collectError({
            type: 'manual-report',
            message: message,
            details: details,
            error: new Error(message)
        });
    }

    // エラー収集状況の確認
    getStatus() {
        return {
            initialized: this.initialized,
            cacheSize: this.errorCache.size,
            appInfo: this.appInfo
        };
    }
}

// シングルトンインスタンス
export const errorCollector = new ErrorCollector();

// デバッグ用：グローバルに公開
window.errorCollector = errorCollector;

export default ErrorCollector;