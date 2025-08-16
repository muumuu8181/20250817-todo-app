// Main Application Module
// 責務: アプリケーション全体の統合と調整

import { AuthService } from '../services/auth.js';
import { DatabaseService } from '../services/database.js';
import { UIController } from '../components/ui.js';

export class AppController {
    constructor(firebaseConfig) {
        // Firebase初期化
        firebase.initializeApp(firebaseConfig);
        
        // ロガー設定
        this.logger = this.createLogger();
        
        // サービス初期化
        this.auth = new AuthService(firebase.auth(), this.logger);
        this.db = new DatabaseService(firebase.database(), this.logger);
        this.ui = new UIController(this.logger);
        
        // グローバル関数の設定（既存HTMLとの互換性のため）
        this.setupGlobalFunctions();
        
        // 初期化
        this.init();
    }

    // ロガー作成
    createLogger() {
        return (message) => {
            const logArea = document.getElementById('logArea');
            const timestamp = new Date().toLocaleTimeString();
            logArea.innerHTML += `[${timestamp}] ${message}<br>`;
            logArea.scrollTop = logArea.scrollHeight;
            console.log(message);
        };
    }

    // 初期化
    init() {
        this.logger('🚀 アプリテンプレート v0.2 起動完了');
        this.logger('🔐 認証システム準備完了');
        
        // プロトコルチェック
        if (window.location.protocol === 'file:') {
            this.logger('⚠️ file://プロトコル検出 - Googleログインには HTTPサーバーが必要です');
            this.logger('💡 解決方法: python -m http.server 8000 または chrome://flags設定');
        }
        
        // 認証状態監視
        this.auth.watchAuthState(
            (user) => this.onUserLoggedIn(user),
            () => this.onUserLoggedOut()
        );
        
        this.logger('🔄 Firebase認証システム初期化完了 - 認証状態を確認中...');
    }

    // ログイン時の処理
    onUserLoggedIn(user) {
        this.ui.showUserInterface(user);
        this.db.watchUserData(user.uid, (entries) => {
            this.ui.updateHistory(entries);
        });
    }

    // ログアウト時の処理
    onUserLoggedOut() {
        this.ui.showLoginInterface();
    }

    // グローバル関数の設定（既存HTMLとの互換性）
    setupGlobalFunctions() {
        // Googleログイン
        window.handleGoogleLogin = async () => {
            try {
                await this.auth.loginWithGoogle();
            } catch (error) {
                // エラーは AuthService 内でログ済み
            }
        };

        // ログアウト
        window.handleLogout = async () => {
            await this.auth.logout();
        };

        // データ保存
        window.saveWeightData = async () => {
            const user = this.auth.getCurrentUser();
            if (!user) {
                this.logger('❌ ログインが必要です');
                return;
            }

            if (!this.ui.validateInput()) {
                return;
            }

            const data = this.ui.getInputData();
            data.userEmail = user.email;

            try {
                await this.db.saveWeightData(user.uid, data);
                this.ui.clearInputFields();
            } catch (error) {
                // エラーは DatabaseService 内でログ済み
            }
        };

        // データ削除
        window.deleteEntry = async (entryId) => {
            const user = this.auth.getCurrentUser();
            if (!user) {
                this.logger('❌ ログインが必要です');
                return;
            }
            
            if (!confirm('この記録を削除しますか？')) {
                return;
            }
            
            await this.db.deleteWeightEntry(user.uid, entryId);
        };

        // タイミング選択
        window.selectTiming = (timing) => {
            this.ui.selectTiming(timing);
        };

        // キーボード操作
        window.handleWeightKeypress = (event) => {
            this.ui.handleWeightKeypress(event);
        };

        // ログコピー
        window.copyLogs = () => {
            this.ui.copyLogs();
        };

        // デバッグ関数群
        window.debugFirebaseConnection = async () => {
            this.logger('🔍 === Firebase Debug 開始 ===');
            const connected = await this.db.checkConnection();
            const user = this.auth.getCurrentUser();
            if (user) {
                await this.db.checkDatabaseStructure(user.uid, user.email);
            }
            this.logger('🔍 === Firebase Debug 完了 ===');
        };

        window.forceAuthCheck = () => {
            return this.auth.forceAuthCheck();
        };

        window.checkDatabaseStructure = async () => {
            const user = this.auth.getCurrentUser();
            if (!user) {
                this.logger('❌ ログインが必要です');
                return;
            }
            this.logger('🏗️ === データベース構造確認 開始 ===');
            await this.db.checkDatabaseStructure(user.uid, user.email);
            this.logger('🏗️ === データベース構造確認 完了 ===');
        };

        window.copyDebugInfo = () => {
            const firebaseConfig = {
                projectId: "shares-b1b97",
                databaseURL: "https://shares-b1b97-default-rtdb.firebaseio.com",
                authDomain: "shares-b1b97.firebaseapp.com"
            };
            const debugInfo = this.ui.generateDebugInfo(firebaseConfig, this.auth.getCurrentUser());
            
            navigator.clipboard.writeText(debugInfo).then(() => {
                alert('✅ デバッグ情報をコピーしました');
            }).catch(() => {
                const textArea = document.createElement('textarea');
                textArea.value = debugInfo;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('✅ デバッグ情報をコピーしました');
            });
        };

        // その他のデバッグ関数（簡略化）
        window.checkLoginIssues = () => {
            this.logger('⚠️ === ログイン問題診断 開始 ===');
            const protocol = window.location.protocol;
            this.logger(`🌐 現在のプロトコル: ${protocol}`);
            
            if (protocol === 'file:') {
                this.logger('❌ 問題発見: file://プロトコルではGoogle認証が動作しません');
                this.logger('✅ 解決方法: HTTPサーバー経由でアクセス');
            }
            this.logger('⚠️ === ログイン問題診断 完了 ===');
        };

        window.checkMobileSupport = () => {
            this.logger('📱 === モバイル環境診断 開始 ===');
            const userAgent = navigator.userAgent;
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
            this.logger(`📱 モバイルデバイス判定: ${isMobile ? 'モバイル' : 'デスクトップ'}`);
            this.logger('📱 === モバイル環境診断 完了 ===');
        };

        window.checkFirebaseConfig = () => {
            this.logger('🔧 === Firebase設定診断 開始 ===');
            const currentDomain = window.location.hostname;
            this.logger(`🌐 現在のドメイン: ${currentDomain}`);
            this.logger('🔧 === Firebase設定診断 完了 ===');
        };

        window.testPopup = () => {
            this.logger('🧪 ポップアップテスト開始...');
            try {
                const testWindow = window.open('', '_blank', 'width=400,height=500');
                if (testWindow) {
                    this.logger('✅ ポップアップ許可済み');
                    testWindow.close();
                } else {
                    this.logger('❌ ポップアップがブロックされています');
                }
            } catch (error) {
                this.logger(`❌ ポップアップテストエラー: ${error.message}`);
            }
        };
    }
}