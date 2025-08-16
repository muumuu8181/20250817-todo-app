#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { JSDOM } = require('jsdom');
const BrowserAPIEnhancements = require('./browser-api-enhancements.js');

// コマンドライン引数の設定
const argv = yargs(hideBin(process.argv))
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    default: false,
    description: '詳細ログを出力'
  })
  .option('report', {
    alias: 'r',
    type: 'boolean',
    default: true,
    description: 'HTMLレポートを生成'
  })
  .option('target', {
    alias: 't',
    type: 'string',
    default: 'simple-button-page.html',
    description: 'テスト対象のHTMLファイル'
  })
  .option('count', {
    alias: 'c',
    type: 'number',
    default: 10,
    description: 'テスト実行回数'
  })
  .option('selector-pattern', {
    alias: 's',
    type: 'string',
    default: '.button-',
    description: 'ボタンCSSセレクタのパターン (例: .btn-, .action-button-)'
  })
  .option('max-buttons', {
    alias: 'm',
    type: 'number',
    default: 8,
    description: '最大ボタン数'
  })
  .option('output-selector', {
    alias: 'o',
    type: 'string',
    default: '#output-area',
    description: '出力エリアのCSSセレクタ'
  })
  .option('auto-detect', {
    alias: 'a',
    type: 'boolean',
    default: false,
    description: 'ページ内のボタンを自動検出する'
  })
  .help()
  .argv;

class JSDOMButtonTestRunner {
  constructor(options = {}) {
    this.options = {
      verbose: false,
      report: true,
      target: 'simple-button-page.html',
      count: 10,
      selectorPattern: '.button-',
      maxButtons: 8,
      outputSelector: '#output-area',
      autoDetect: false,
      ...options
    };
    this.results = {
      summary: {
        startTime: new Date(),
        endTime: null,
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        duration: 0
      },
      buttons: {}, // 動的に生成
      detectedButtons: [], // 検出されたボタン情報
      errors: [],
      testDetails: []
    };
    this.dom = null;
    this.window = null;
    this.document = null;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString('ja-JP');
    const prefix = {
      info: chalk.blue('[INFO]'),
      success: chalk.green('[SUCCESS]'),
      error: chalk.red('[ERROR]'),
      warning: chalk.yellow('[WARNING]')
    }[type] || chalk.gray('[LOG]');
    
    if (this.options.verbose || type !== 'info') {
      console.log(`${chalk.gray(timestamp)} ${prefix} ${message}`);
    }
  }

  async loadHTMLFile() {
    try {
      const targetPath = path.resolve(this.options.target);
      
      if (!await fs.pathExists(targetPath)) {
        throw new Error(`ファイルが見つかりません: ${targetPath}`);
      }
      
      this.log(`HTMLファイルを読み込み中: ${this.options.target}`);
      const htmlContent = await fs.readFile(targetPath, 'utf8');
      
      // JSDOMでHTMLを解析
      this.dom = new JSDOM(htmlContent, {
        runScripts: 'dangerously',
        resources: 'usable',
        beforeParse(window) {
          // カスタムコンソール設定
          window.console = console;
        }
      });
      
      this.window = this.dom.window;
      this.document = this.window.document;
      
      // 🚀 Browser API拡張機能を初期化
      this.apiEnhancements = new BrowserAPIEnhancements(this.window, {
        enableLocalStorage: true,
        enableAlert: true,
        enableFirebaseMock: true,
        enableAudioContext: true,
        verbose: this.options.verbose
      });
      this.apiEnhancements.initializeAll();
      
      // スクリプトの実行完了を待つ
      await new Promise(resolve => {
        this.window.onload = resolve;
        if (this.document.readyState === 'complete') {
          resolve();
        }
      });
      
      this.log('HTMLファイルの読み込みが完了しました', 'success');
      
      // ボタン検出と初期化
      await this.initializeButtons();
      
      return true;
    } catch (error) {
      this.log(`HTMLファイルの読み込みに失敗: ${error.message}`, 'error');
      this.results.errors.push(`HTML load error: ${error.message}`);
      return false;
    }
  }

  // 新機能: ボタン初期化と検出
  async initializeButtons() {
    this.log('ボタン検出と初期化を実行中...');
    
    if (this.options.autoDetect) {
      // 自動検出モード
      await this.detectButtonsAutomatically();
    } else {
      // 伝統的なセレクタパターンモード
      await this.initializeButtonsByPattern();
    }
    
    this.log(`ボタン初期化完了: ${Object.keys(this.results.buttons).length}個のボタンを検出`, 'success');
  }

  // 自動ボタン検出
  async detectButtonsAutomatically() {
    const buttonSelectors = [
      'button',
      'input[type="button"]',
      'input[type="submit"]', 
      '[role="button"]',
      '.btn',
      '.button',
      '[onclick]'
    ];
    
    const foundButtons = [];
    
    for (const selector of buttonSelectors) {
      const elements = this.document.querySelectorAll(selector);
      elements.forEach((element, index) => {
        const buttonInfo = {
          element,
          selector: this.generateUniqueSelector(element),
          text: element.textContent?.trim() || element.value || `Button${foundButtons.length + 1}`,
          id: element.id || `auto-detected-${foundButtons.length + 1}`,
          index: foundButtons.length + 1
        };
        foundButtons.push(buttonInfo);
      });
    }
    
    // 重複除去
    const uniqueButtons = this.removeDuplicateButtons(foundButtons);
    
    // 結果に設定
    this.results.detectedButtons = uniqueButtons.slice(0, this.options.maxButtons);
    
    // buttonsオブジェクトを初期化
    this.results.detectedButtons.forEach((buttonInfo, index) => {
      const buttonKey = `button${index + 1}`;
      this.results.buttons[buttonKey] = {
        clicks: 0,
        successes: 0,
        failures: 0,
        avgResponseTime: 0,
        responses: [],
        info: buttonInfo
      };
    });
    
    this.log(`自動検出で${this.results.detectedButtons.length}個のボタンを発見`, 'success');
  }

  // パターンベースのボタン初期化
  async initializeButtonsByPattern() {
    for (let i = 1; i <= this.options.maxButtons; i++) {
      const buttonSelector = `${this.options.selectorPattern}${i}`;
      const button = this.document.querySelector(buttonSelector);
      
      if (button) {
        const buttonKey = `button${i}`;
        this.results.buttons[buttonKey] = {
          clicks: 0,
          successes: 0,
          failures: 0,
          avgResponseTime: 0,
          responses: [],
          selector: buttonSelector,
          element: button
        };
        
        this.log(`ボタン検出: ${buttonSelector}`, 'success');
      } else {
        this.log(`ボタンが見つかりません: ${buttonSelector}`, 'warning');
      }
    }
  }

  // 一意セレクタ生成
  generateUniqueSelector(element) {
    if (element.id) {
      return `#${element.id}`;
    }
    
    if (element.className) {
      const classes = element.className.split(' ').filter(c => c.trim());
      if (classes.length > 0) {
        return `.${classes[0]}`;
      }
    }
    
    const tagName = element.tagName.toLowerCase();
    const parent = element.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(el => el.tagName === element.tagName);
      const index = siblings.indexOf(element);
      return `${tagName}:nth-of-type(${index + 1})`;
    }
    
    return tagName;
  }

  // 重複ボタン除去
  removeDuplicateButtons(buttons) {
    const seen = new Set();
    return buttons.filter(buttonInfo => {
      const key = buttonInfo.element;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  async testButton(buttonNumber) {
    const buttonId = `button${buttonNumber}`;
    const startTime = Date.now();
    const testDetail = {
      buttonNumber,
      timestamp: new Date(),
      success: false,
      responseTime: 0,
      error: null,
      outputBefore: '',
      outputAfter: ''
    };
    
    try {
      this.log(`ボタン${buttonNumber}をテスト中...`);
      
      // ボタンの存在確認
      const buttonKey = `button${buttonNumber}`;
      const buttonData = this.results.buttons[buttonKey];
      
      if (!buttonData) {
        throw new Error(`ボタンデータが見つかりません: ${buttonKey}`);
      }
      
      const button = buttonData.element || this.document.querySelector(buttonData.selector);
      const buttonSelector = buttonData.selector || buttonData.info?.selector;
      
      if (!button) {
        throw new Error(`ボタンが見つかりません: ${buttonSelector}`);
      }
      
      // 出力エリアの初期状態を記録
      const outputArea = this.document.querySelector(this.options.outputSelector);
      if (!outputArea) {
        throw new Error('出力エリアが見つかりません: #output-area');
      }
      
      testDetail.outputBefore = outputArea.value || '';
      
      // ボタンクリックイベントをシミュレート
      const clickEvent = new this.window.MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: this.window
      });
      
      button.dispatchEvent(clickEvent);
      
      // 非同期処理の完了を待つ（最大3秒）
      let outputChanged = false;
      for (let i = 0; i < 30; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        const currentOutput = outputArea.value || '';
        if (currentOutput !== testDetail.outputBefore && currentOutput.length > testDetail.outputBefore.length) {
          outputChanged = true;
          testDetail.outputAfter = currentOutput;
          break;
        }
      }
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      testDetail.responseTime = responseTime;
      
      if (outputChanged) {
        this.results.buttons[buttonId].successes++;
        this.results.buttons[buttonId].responses.push(responseTime);
        this.results.summary.passedTests++;
        testDetail.success = true;
        this.log(`ボタン${buttonNumber}テスト成功 (${responseTime}ms)`, 'success');
      } else {
        this.results.buttons[buttonId].failures++;
        this.results.summary.failedTests++;
        testDetail.error = '出力に変化なし';
        this.log(`ボタン${buttonNumber}テスト失敗: 出力に変化なし`, 'error');
      }
      
      this.results.buttons[buttonId].clicks++;
      this.results.summary.totalTests++;
      
    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      testDetail.responseTime = responseTime;
      testDetail.error = error.message;
      
      if (this.results.buttons[buttonId]) {
        this.results.buttons[buttonId].failures++;
        this.results.buttons[buttonId].clicks++;
      }
      this.results.summary.failedTests++;
      this.results.summary.totalTests++;
      this.results.errors.push(`Button${buttonNumber} error: ${error.message}`);
      
      this.log(`ボタン${buttonNumber}テスト失敗: ${error.message}`, 'error');
    }
    
    this.results.testDetails.push(testDetail);
  }

  async runTests() {
    this.log(`テスト開始: ${this.options.count}回のテストを実行`);
    
    for (let i = 1; i <= this.options.count; i++) {
      this.log(`テスト ${i}/${this.options.count} 実行中...`);
      
      // 検出されたボタンを順番にテスト
      const buttonCount = Object.keys(this.results.buttons).length;
      for (let buttonNum = 1; buttonNum <= buttonCount; buttonNum++) {
        if (this.results.buttons[`button${buttonNum}`]) {
          await this.testButton(buttonNum);
          await new Promise(resolve => setTimeout(resolve, 500)); // ボタン間の待機時間
        }
      }
      
      // テスト間の待機時間
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  calculateStatistics() {
    Object.keys(this.results.buttons).forEach(buttonId => {
      const button = this.results.buttons[buttonId];
      if (button.responses.length > 0) {
        button.avgResponseTime = Math.round(
          button.responses.reduce((a, b) => a + b, 0) / button.responses.length
        );
      }
    });
    
    this.results.summary.endTime = new Date();
    this.results.summary.duration = this.results.summary.endTime - this.results.summary.startTime;
  }

  async saveDetailedLogs() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // JSONログファイル生成
    const jsonLogData = {
      testSession: {
        startTime: this.results.summary.startTime.toISOString(),
        endTime: this.results.summary.endTime.toISOString(),
        duration: this.results.summary.duration,
        totalTests: this.results.summary.totalTests,
        passedTests: this.results.summary.passedTests,
        failedTests: this.results.summary.failedTests,
        successRate: this.results.summary.totalTests > 0 ? Math.round((this.results.summary.passedTests / this.results.summary.totalTests) * 100) : 0
      },
      buttonSummary: this.results.buttons,
      detailedLogs: this.results.testDetails.map(detail => ({
        testIndex: this.results.testDetails.indexOf(detail) + 1,
        buttonNumber: detail.buttonNumber,
        timestamp: detail.timestamp.toISOString(),
        localTime: detail.timestamp.toLocaleString('ja-JP'),
        success: detail.success,
        responseTimeMs: detail.responseTime,
        outputBefore: detail.outputBefore,
        outputAfter: detail.outputAfter,
        error: detail.error,
        outputChanged: detail.outputAfter !== detail.outputBefore,
        outputLengthBefore: detail.outputBefore.length,
        outputLengthAfter: detail.outputAfter.length
      })),
      errors: this.results.errors
    };
    
    const jsonLogPath = `test-evidence-${timestamp}.json`;
    await fs.writeFile(jsonLogPath, JSON.stringify(jsonLogData, null, 2));
    this.log(`JSONエビデンス保存完了: ${jsonLogPath}`, 'success');
    
    // CSVログファイル生成
    const csvHeader = 'テストNo,ボタン番号,実行時刻,成功/失敗,応答時間(ms),出力変化,エラー,出力前文字数,出力後文字数\n';
    const csvRows = this.results.testDetails.map((detail, index) => {
      return [
        index + 1,
        detail.buttonNumber,
        detail.timestamp.toLocaleString('ja-JP'),
        detail.success ? '成功' : '失敗',
        detail.responseTime,
        detail.outputAfter !== detail.outputBefore ? 'あり' : 'なし',
        detail.error || '',
        detail.outputBefore.length,
        detail.outputAfter.length
      ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
    }).join('\n');
    
    const csvLogPath = `test-evidence-${timestamp}.csv`;
    await fs.writeFile(csvLogPath, csvHeader + csvRows);
    this.log(`CSVエビデンス保存完了: ${csvLogPath}`, 'success');
    
    // テキストログファイル生成
    const textLog = [
      '='.repeat(80),
      `テスト実行エビデンスログ`,
      `生成日時: ${new Date().toLocaleString('ja-JP')}`,
      '='.repeat(80),
      '',
      '【テストサマリー】',
      `開始時刻: ${this.results.summary.startTime.toLocaleString('ja-JP')}`,
      `終了時刻: ${this.results.summary.endTime.toLocaleString('ja-JP')}`,
      `実行時間: ${Math.round(this.results.summary.duration / 1000)}秒`,
      `総テスト数: ${this.results.summary.totalTests}`,
      `成功数: ${this.results.summary.passedTests}`,
      `失敗数: ${this.results.summary.failedTests}`,
      `成功率: ${this.results.summary.totalTests > 0 ? Math.round((this.results.summary.passedTests / this.results.summary.totalTests) * 100) : 0}%`,
      '',
      '【ボタン別統計】',
      ...Object.entries(this.results.buttons).map(([buttonId, data], index) => {
        const successRate = data.clicks > 0 ? Math.round((data.successes / data.clicks) * 100) : 0;
        return `ボタン${index + 1}: ${data.successes}/${data.clicks} (${successRate}%) - 平均${data.avgResponseTime}ms`;
      }),
      '',
      '【詳細実行ログ】',
      ...this.results.testDetails.map((detail, index) => {
        return [
          `--- テスト ${index + 1} ---`,
          `ボタン番号: ${detail.buttonNumber}`,
          `実行時刻: ${detail.timestamp.toLocaleString('ja-JP')}`,
          `結果: ${detail.success ? '✅ 成功' : '❌ 失敗'}`,
          `応答時間: ${detail.responseTime}ms`,
          `出力変化: ${detail.outputAfter !== detail.outputBefore ? 'あり' : 'なし'}`,
          `出力前文字数: ${detail.outputBefore.length}`,
          `出力後文字数: ${detail.outputAfter.length}`,
          detail.error ? `エラー: ${detail.error}` : '',
          ''
        ].filter(line => line !== '').join('\n');
      }),
      this.results.errors.length > 0 ? [
        '【エラー一覧】',
        ...this.results.errors.map((error, index) => `${index + 1}. ${error}`)
      ].join('\n') : '',
      '',
      '='.repeat(80),
      'テストエビデンス終了'
    ].filter(line => line !== undefined).join('\n');
    
    const textLogPath = `test-evidence-${timestamp}.txt`;
    await fs.writeFile(textLogPath, textLog);
    this.log(`テキストエビデンス保存完了: ${textLogPath}`, 'success');
    
    return {
      jsonPath: jsonLogPath,
      csvPath: csvLogPath,
      textPath: textLogPath
    };
  }

  async generateReport() {
    if (!this.options.report) return;
    
    this.log('HTMLレポートを生成中...');
    
    const reportHtml = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JSDOM テスト結果レポート</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .summary-card { padding: 20px; border-radius: 8px; text-align: center; }
        .summary-total { background-color: #e3f2fd; border: 2px solid #2196f3; }
        .summary-passed { background-color: #e8f5e8; border: 2px solid #4caf50; }
        .summary-failed { background-color: #ffebee; border: 2px solid #f44336; }
        .summary-duration { background-color: #f3e5f5; border: 2px solid #9c27b0; }
        .button-results { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0; }
        .button-card { padding: 20px; border-radius: 8px; border-left: 4px solid #ddd; }
        .button-1 { border-left-color: #007bff; background-color: #f8f9ff; }
        .button-2 { border-left-color: #28a745; background-color: #f8fff9; }
        .button-3 { border-left-color: #dc3545; background-color: #fff8f8; }
        .metric { display: flex; justify-content: space-between; margin: 10px 0; }
        .metric strong { color: #333; }
        .test-details { margin: 20px 0; }
        .test-detail { padding: 10px; margin: 5px 0; border-radius: 5px; }
        .test-success { background-color: #e8f5e8; border-left: 4px solid #4caf50; }
        .test-failure { background-color: #ffebee; border-left: 4px solid #f44336; }
        .errors { background-color: #ffebee; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .timestamp { color: #666; font-size: 14px; }
        .badge { display: inline-block; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; color: white; }
        .badge-success { background-color: #4caf50; }
        .badge-failure { background-color: #f44336; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 JSDOM テスト結果レポート</h1>
            <div class="timestamp">
                実行時間: ${this.results.summary.startTime.toLocaleString('ja-JP')} - ${this.results.summary.endTime.toLocaleString('ja-JP')}
            </div>
            <div class="timestamp">
                所要時間: ${Math.round(this.results.summary.duration / 1000)}秒
            </div>
            <div class="timestamp">
                テストエンジン: Node.js + JSDOM (ブラウザレス)
            </div>
        </div>
        
        <div class="summary">
            <div class="summary-card summary-total">
                <h3>総テスト数</h3>
                <div style="font-size: 2em; font-weight: bold;">${this.results.summary.totalTests}</div>
            </div>
            <div class="summary-card summary-passed">
                <h3>成功</h3>
                <div style="font-size: 2em; font-weight: bold; color: #4caf50;">${this.results.summary.passedTests}</div>
            </div>
            <div class="summary-card summary-failed">
                <h3>失敗</h3>
                <div style="font-size: 2em; font-weight: bold; color: #f44336;">${this.results.summary.failedTests}</div>
            </div>
            <div class="summary-card summary-duration">
                <h3>成功率</h3>
                <div style="font-size: 2em; font-weight: bold; color: #9c27b0;">
                    ${this.results.summary.totalTests > 0 ? Math.round((this.results.summary.passedTests / this.results.summary.totalTests) * 100) : 0}%
                </div>
            </div>
        </div>
        
        <div class="button-results">
            ${Object.entries(this.results.buttons).map(([buttonId, data], index) => `
                <div class="button-card button-${index + 1}">
                    <h3>ボタン${index + 1} (${buttonId})</h3>
                    <div class="metric">
                        <span>クリック回数:</span>
                        <strong>${data.clicks}</strong>
                    </div>
                    <div class="metric">
                        <span>成功回数:</span>
                        <strong style="color: #4caf50;">${data.successes}</strong>
                    </div>
                    <div class="metric">
                        <span>失敗回数:</span>
                        <strong style="color: #f44336;">${data.failures}</strong>
                    </div>
                    <div class="metric">
                        <span>成功率:</span>
                        <strong>${data.clicks > 0 ? Math.round((data.successes / data.clicks) * 100) : 0}%</strong>
                    </div>
                    <div class="metric">
                        <span>平均応答時間:</span>
                        <strong>${data.avgResponseTime}ms</strong>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="test-details">
            <h3>📋 テスト詳細ログ</h3>
            ${this.results.testDetails.map(detail => `
                <div class="test-detail ${detail.success ? 'test-success' : 'test-failure'}">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span><strong>ボタン${detail.buttonNumber}</strong> - ${detail.timestamp.toLocaleTimeString('ja-JP')}</span>
                        <div>
                            <span class="badge ${detail.success ? 'badge-success' : 'badge-failure'}">
                                ${detail.success ? '成功' : '失敗'}
                            </span>
                            <span style="margin-left: 10px; font-size: 12px; color: #666;">${detail.responseTime}ms</span>
                        </div>
                    </div>
                    ${detail.error ? `<div style="color: #f44336; font-size: 12px; margin-top: 5px;">エラー: ${detail.error}</div>` : ''}
                </div>
            `).join('')}
        </div>
        
        ${this.results.errors.length > 0 ? `
            <div class="errors">
                <h3>❌ エラー詳細</h3>
                <ul>
                    ${this.results.errors.map(error => `<li>${error}</li>`).join('')}
                </ul>
            </div>
        ` : ''}
    </div>
</body>
</html>`;

    const reportPath = `jsdom-test-report-${Date.now()}.html`;
    await fs.writeFile(reportPath, reportHtml);
    this.log(`HTMLレポート生成完了: ${reportPath}`, 'success');
    
    return reportPath;
  }

  printSummary() {
    console.log('\n' + chalk.blue('='.repeat(60)));
    console.log(chalk.blue.bold('              🧪 JSDOM テスト結果サマリー'));
    console.log(chalk.blue('='.repeat(60)));
    
    console.log(`📊 総テスト数: ${chalk.bold(this.results.summary.totalTests)}`);
    console.log(`✅ 成功: ${chalk.green.bold(this.results.summary.passedTests)}`);
    console.log(`❌ 失敗: ${chalk.red.bold(this.results.summary.failedTests)}`);
    console.log(`📈 成功率: ${chalk.bold(this.results.summary.totalTests > 0 ? Math.round((this.results.summary.passedTests / this.results.summary.totalTests) * 100) : 0)}%`);
    console.log(`⏱️  実行時間: ${chalk.bold(Math.round(this.results.summary.duration / 1000))}秒`);
    console.log(`🔧 テストエンジン: ${chalk.cyan('Node.js + JSDOM (ブラウザレス)')}`);
    
    console.log('\n' + chalk.yellow('ボタン別詳細:'));
    Object.entries(this.results.buttons).forEach(([buttonId, data], index) => {
      const successRate = data.clicks > 0 ? Math.round((data.successes / data.clicks) * 100) : 0;
      console.log(`  ボタン${index + 1}: ${data.successes}/${data.clicks} (${successRate}%) - ${data.avgResponseTime}ms平均`);
    });
    
    if (this.results.errors.length > 0) {
      console.log('\n' + chalk.red('エラー:'));
      this.results.errors.forEach(error => {
        console.log(`  ${chalk.red('•')} ${error}`);
      });
    }
    
    console.log(chalk.blue('='.repeat(60)) + '\n');
  }

  async run() {
    try {
      // HTMLファイル読み込み
      if (!(await this.loadHTMLFile())) {
        throw new Error('HTMLファイルの読み込みに失敗しました');
      }

      // テスト実行
      await this.runTests();

      // 統計計算
      this.calculateStatistics();

      // エビデンスログ保存
      const evidencePaths = await this.saveDetailedLogs();

      // レポート生成
      const reportPath = await this.generateReport();

      // サマリー表示
      this.printSummary();

      if (reportPath) {
        this.log(`\n📋 詳細レポート: ${reportPath}`, 'success');
        this.log(`\n📖 レポートを開く: termux-open ${reportPath}`, 'info');
      }
      
      if (evidencePaths) {
        this.log(`\n📁 エビデンスファイル生成完了:`, 'success');
        this.log(`   JSON: ${evidencePaths.jsonPath}`, 'info');
        this.log(`   CSV:  ${evidencePaths.csvPath}`, 'info');
        this.log(`   TXT:  ${evidencePaths.textPath}`, 'info');
      }
      
      return true;

    } catch (error) {
      this.log(`テスト実行エラー: ${error.message}`, 'error');
      return false;
    }
  }
}

// メイン実行部分
async function main() {
  console.log(chalk.blue.bold('🧪 JSDOM Button Test Runner'));
  console.log(chalk.gray(`設定: ファイル=${argv.target}, 回数=${argv.count}, レポート=${argv.report}`));
  
  const runner = new JSDOMButtonTestRunner(argv);
  const success = await runner.run();
  
  process.exit(success ? 0 : 1);
}

// エラーハンドリング
process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('未処理のPromise拒否:'), reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error(chalk.red('未処理の例外:'), error);
  process.exit(1);
});

// 実行
if (require.main === module) {
  main();
}

module.exports = JSDOMButtonTestRunner;