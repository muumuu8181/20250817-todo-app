// Authentication Module
// 責務: Firebase認証とGoogleログイン管理

export class AuthService {
    constructor(firebaseAuth, logger) {
        this.auth = firebaseAuth;
        this.log = logger;
        this.currentUser = null;
    }

    // 認証状態の監視
    watchAuthState(onLoggedIn, onLoggedOut) {
        this.auth.onAuthStateChanged((user) => {
            this.currentUser = user;
            if (user) {
                this.log(`✅ 認証状態確認: ${user.displayName} でログイン中`);
                this.log(`📧 メール: ${user.email}`);
                onLoggedIn(user);
            } else {
                this.log('🔒 認証状態: 未ログイン');
                onLoggedOut();
            }
        });
    }

    // Googleログイン
    async loginWithGoogle() {
        try {
            this.log('🔐 Googleログイン開始...');
            const provider = new firebase.auth.GoogleAuthProvider();
            
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (isMobile) {
                this.log('📱 モバイルデバイス検出 - ポップアップ方式でログイン');
            } else {
                this.log('🖥️ デスクトップデバイス - ポップアップ方式でログイン');
            }
            
            this.log('🪟 ポップアップウィンドウでGoogleログインを開始...');
            
            const result = await this.auth.signInWithPopup(provider);
            this.log(`✅ ログイン成功: ${result.user.displayName}`);
            return result.user;
            
        } catch (error) {
            this.log(`❌ ログインエラー: ${error.message}`);
            if (error.code) {
                this.log(`- エラーコード: ${error.code}`);
            }
            throw error;
        }
    }

    // ログアウト
    async logout() {
        try {
            await this.auth.signOut();
            this.log('📤 ログアウト完了');
        } catch (error) {
            this.log(`❌ ログアウトエラー: ${error.message}`);
            throw error;
        }
    }

    // 現在のユーザー取得
    getCurrentUser() {
        return this.currentUser;
    }

    // 認証状態の強制確認
    forceAuthCheck() {
        this.log('🔍 認証状態強制確認');
        const user = this.auth.currentUser;
        this.log(`🔐 Firebase認証状態: ${user ? `ログイン済み (${user.displayName})` : '未ログイン'}`);
        return user;
    }
}