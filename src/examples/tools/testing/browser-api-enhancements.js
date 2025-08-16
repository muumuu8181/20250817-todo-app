/**
 * Browser API Enhancements for JSDOM Environment
 * 
 * このモジュールは、JSDOMでサポートされていないブラウザAPIを
 * Android環境との互換性を保ちながら拡張します。
 */

const fs = require('fs');
const path = require('path');

class BrowserAPIEnhancements {
  constructor(window, options = {}) {
    this.window = window;
    this.options = {
      enableLocalStorage: true,
      enableAlert: true,
      enableFirebaseMock: false,
      enableAudioContext: false,
      storageDir: './jsdom-storage',
      verbose: false,
      ...options
    };
    
    this.log('🔧 Browser API Enhancements 初期化開始');
  }

  log(message, type = 'info') {
    if (!this.options.verbose) return;
    
    const prefix = {
      info: '📋',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    }[type] || '📋';
    
    console.log(`${prefix} [API-Enhancement] ${message}`);
  }

  // 環境検出
  isJSDOMEnvironment() {
    return this.window.navigator && 
           this.window.navigator.userAgent && 
           this.window.navigator.userAgent.includes('jsdom');
  }

  isAndroidEnvironment() {
    return typeof this.window !== 'undefined' && 
           'ontouchstart' in this.window;
  }

  // 1. localStorage対応
  setupLocalStorage() {
    if (!this.options.enableLocalStorage) {
      this.log('localStorage拡張はスキップされました');
      return;
    }

    // 既存のlocalStorageがある場合は保護
    if (this.window.localStorage) {
      this.log('既存のlocalStorageを検出 - そのまま使用');
      return;
    }

    if (this.isJSDOMEnvironment()) {
      try {
        const { LocalStorage } = require('node-localstorage');
        
        // ストレージディレクトリを作成
        if (!fs.existsSync(this.options.storageDir)) {
          fs.mkdirSync(this.options.storageDir, { recursive: true });
        }
        
        this.window.localStorage = new LocalStorage(this.options.storageDir);
        this.log('localStorage拡張を有効化しました', 'success');
      } catch (error) {
        this.log(`localStorage拡張に失敗: ${error.message}`, 'error');
      }
    }
  }

  // 2. window.alert/confirm/prompt対応
  setupDialogAPIs() {
    if (!this.options.enableAlert) {
      this.log('Dialog API拡張はスキップされました');
      return;
    }

    if (this.isJSDOMEnvironment()) {
      // 強制的にモック化（JSDOMでは常に未実装エラーが出るため）
      this.window.alert = (message) => {
        this.log(`🚨 ALERT: ${message}`);
        console.log(`🚨 ALERT: ${message}`);
        return undefined;
      };

      this.window.confirm = (message) => {
        this.log(`❓ CONFIRM: ${message} → true (自動承認)`);
        console.log(`❓ CONFIRM: ${message} → true (自動承認)`);
        return true; // テスト環境では自動承認
      };

      this.window.prompt = (message, defaultValue = '') => {
        this.log(`📝 PROMPT: ${message} → "${defaultValue}" (デフォルト値使用)`);
        console.log(`📝 PROMPT: ${message} → "${defaultValue}" (デフォルト値使用)`);
        return defaultValue;
      };

      this.log('Dialog API拡張を有効化しました (強制モック)', 'success');
    } else {
      this.log('非JSDOM環境 - Dialog APIはそのまま使用');
    }
  }

  // 3. Firebase API モック
  setupFirebaseMock() {
    if (!this.options.enableFirebaseMock) {
      this.log('Firebase Mock拡張はスキップされました');
      return;
    }

    // 既存のFirebaseがある場合は保護
    if (this.window.firebase) {
      this.log('既存のFirebaseを検出 - そのまま使用');
      return;
    }

    if (this.isJSDOMEnvironment()) {
      this.window.firebase = {
        initializeApp: (config) => {
          this.log('Firebase.initializeApp() - モック実行');
          return { name: 'mock-app' };
        },
        
        auth: () => ({
          signInWithPopup: (provider) => {
            this.log('Firebase.auth().signInWithPopup() - モックログイン成功');
            return Promise.resolve({
              user: {
                uid: 'mock-user-id',
                displayName: 'Mock User',
                email: 'mock@example.com'
              }
            });
          },
          
          signOut: () => {
            this.log('Firebase.auth().signOut() - モックログアウト');
            return Promise.resolve();
          },
          
          onAuthStateChanged: (callback) => {
            this.log('Firebase.auth().onAuthStateChanged() - モック実行');
            // 初期状態として未ログインを通知
            setTimeout(() => callback(null), 100);
            return () => {}; // unsubscribe function
          }
        }),
        
        database: () => ({
          ref: (path) => ({
            set: (data) => {
              this.log(`Firebase.database().ref("${path}").set() - モック保存`);
              return Promise.resolve();
            },
            
            get: () => {
              this.log(`Firebase.database().ref("${path}").get() - モック取得`);
              return Promise.resolve({
                exists: () => false,
                val: () => null
              });
            },
            
            on: (eventType, callback) => {
              this.log(`Firebase.database().ref("${path}").on("${eventType}") - モック監視`);
              return () => {}; // unsubscribe function
            },
            
            off: () => {
              this.log(`Firebase.database().ref("${path}").off() - モック監視停止`);
            }
          })
        })
      };

      this.log('Firebase Mock拡張を有効化しました', 'success');
    }
  }

  // 4. AudioContext対応
  setupAudioContext() {
    if (!this.options.enableAudioContext) {
      this.log('AudioContext拡張はスキップされました');
      return;
    }

    // 既存のAudioContextがある場合は保護
    if (this.window.AudioContext || this.window.webkitAudioContext) {
      this.log('既存のAudioContextを検出 - そのまま使用');
      return;
    }

    if (this.isJSDOMEnvironment()) {
      // MockAudioContextクラス
      class MockAudioContext {
        constructor() {
          this.destination = { channelCount: 2 };
          this.sampleRate = 44100;
          this.currentTime = 0;
          this.state = 'running';
        }

        createOscillator() {
          return {
            frequency: { value: 440 },
            type: 'sine',
            connect: () => {},
            start: () => { this.log('🔊 Oscillator.start() - モック再生'); },
            stop: () => { this.log('🔊 Oscillator.stop() - モック停止'); }
          };
        }

        createGain() {
          return {
            gain: { value: 1 },
            connect: () => {}
          };
        }

        close() {
          this.log('🔊 AudioContext.close() - モック終了');
          return Promise.resolve();
        }
      }

      this.window.AudioContext = MockAudioContext;
      this.window.webkitAudioContext = MockAudioContext;
      
      this.log('AudioContext拡張を有効化しました', 'success');
    }
  }

  // 全ての拡張を初期化
  initializeAll() {
    this.log('='.repeat(60));
    this.log('Browser API Enhancements 開始');
    this.log(`環境: ${this.isJSDOMEnvironment() ? 'JSDOM' : this.isAndroidEnvironment() ? 'Android' : 'その他'}`);
    this.log('='.repeat(60));

    this.setupLocalStorage();
    this.setupDialogAPIs();
    this.setupFirebaseMock();
    this.setupAudioContext();

    this.log('='.repeat(60));
    this.log('Browser API Enhancements 完了', 'success');
    this.log('='.repeat(60));

    return this;
  }

  // 拡張状況のレポート
  getEnhancementReport() {
    const report = {
      environment: this.isJSDOMEnvironment() ? 'JSDOM' : this.isAndroidEnvironment() ? 'Android' : 'Other',
      enhancements: {
        localStorage: !!this.window.localStorage,
        alert: typeof this.window.alert === 'function',
        confirm: typeof this.window.confirm === 'function',
        prompt: typeof this.window.prompt === 'function',
        firebase: !!this.window.firebase,
        audioContext: !!(this.window.AudioContext || this.window.webkitAudioContext)
      }
    };

    return report;
  }
}

module.exports = BrowserAPIEnhancements;