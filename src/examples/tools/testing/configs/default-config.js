#!/usr/bin/env node

// 洗濯アプリ専用設定ファイル
// コア部分を変更せず、カスタマイズ領域のみ調整

const JSDOMButtonTestRunner = require('./test-runner-jsdom.js');

// 洗濯アプリ専用設定
const laundryAppConfig = {
  target: process.argv[2] || 'laundry-app.html',
  verbose: true,
  count: 3,
  report: true,
  autoDetect: false, // 手動セレクタ指定
  outputSelector: '#timerDisplay', // 洗濯アプリの出力エリア
  maxButtons: 8,
  
  // 洗濯アプリの実際のボタンセレクタを手動指定
  customButtons: {
    'button1': 'button.primary-button', // ログインボタン
    'button2': 'button[onclick="startOfflineMode()"]', // オフラインモード
    'button3': 'button[onclick="logout()"]', // ログアウト
    'button4': '#startLaundryBtn', // 洗濯開始
    'button5': '#startTimerBtn', // タイマー開始
    'button6': '#stopTimerBtn', // タイマー停止
    'button7': '#completedBtn', // 洗濯完了
    'button8': 'button.sound-test' // サウンドテスト
  }
};

console.log('🧺 洗濯アプリ専用テストツール - 拡張機能対応版');
console.log('✅ localStorage対応 ✅ alert対応 ✅ Firebase対応 ✅ AudioContext対応');
console.log('カスタマイズ設定:', {
  ターゲット: laundryAppConfig.target,
  出力エリア: laundryAppConfig.outputSelector,
  ボタン数: Object.keys(laundryAppConfig.customButtons).length,
  拡張機能: '自動有効化'
});

// カスタマイズされたテストランナークラス
class LaundryAppTestRunner extends JSDOMButtonTestRunner {
  constructor(options) {
    super(options);
    this.customButtons = options.customButtons || {};
  }

  // カスタムボタン初期化（コア部分を変更せずオーバーライド）
  async initializeButtonsByPattern() {
    console.log('🔧 洗濯アプリ専用ボタン初期化...');
    
    Object.entries(this.customButtons).forEach(([buttonKey, selector]) => {
      const button = this.document.querySelector(selector);
      
      if (button) {
        this.results.buttons[buttonKey] = {
          clicks: 0,
          successes: 0,
          failures: 0,
          avgResponseTime: 0,
          responses: [],
          selector: selector,
          element: button
        };
        
        this.log(`✅ ボタン検出: ${selector}`, 'success');
      } else {
        this.log(`⚠️ ボタンが見つかりません: ${selector}`, 'warning');
      }
    });
  }
}

// メイン実行
async function runLaundryAppTest() {
  const runner = new LaundryAppTestRunner(laundryAppConfig);
  const success = await runner.run();
  
  console.log(success ? '\n✅ 洗濯アプリテスト完了' : '\n❌ 洗濯アプリテスト失敗');
  process.exit(success ? 0 : 1);
}

// 実行
if (require.main === module) {
  runLaundryAppTest();
}

module.exports = LaundryAppTestRunner;