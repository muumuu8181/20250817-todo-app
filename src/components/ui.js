// UI Module
// 責務: DOM操作、イベントハンドリング、UI更新

export class UIController {
    constructor(logger) {
        this.log = logger;
        this.selectedTiming = '';
    }

    // UI要素の初期化
    init() {
        // 今日の日付をセット
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('dateInput').value = today;
        document.getElementById('weightValue').value = '50.0';
        
        // タイミングボタンの初期化
        this.resetTimingButtons();
    }

    // ログイン画面表示
    showLoginInterface() {
        document.getElementById('authSection').classList.remove('hidden');
        document.getElementById('userInfo').classList.add('hidden');
        document.getElementById('weightInput').classList.add('hidden');
    }

    // ユーザー画面表示
    showUserInterface(user) {
        document.getElementById('authSection').classList.add('hidden');
        document.getElementById('userInfo').classList.remove('hidden');
        document.getElementById('weightInput').classList.remove('hidden');
        document.getElementById('userName').textContent = user.displayName;
        
        this.init();
    }

    // タイミング選択
    selectTiming(timing) {
        this.selectedTiming = timing;
        document.getElementById('selectedTiming').value = timing;
        
        // ボタンのスタイル更新
        document.querySelectorAll('.timing-btn').forEach(btn => {
            btn.classList.remove('selected');
            btn.style.opacity = '0.7';
        });
        
        const selectedBtn = document.querySelector(`[data-timing="${timing}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
            selectedBtn.style.opacity = '1';
        }
        
        this.log(`⏰ 測定タイミング選択: ${timing}`);
    }

    // タイミングボタンリセット
    resetTimingButtons() {
        document.querySelectorAll('.timing-btn').forEach(btn => {
            btn.style.opacity = '0.7';
            btn.classList.remove('selected');
        });
        document.getElementById('selectedTiming').value = '';
        this.selectedTiming = '';
    }

    // 入力データ取得
    getInputData() {
        return {
            date: document.getElementById('dateInput').value,
            value: parseFloat(document.getElementById('weightValue').value),
            timing: this.selectedTiming,
            memo: document.getElementById('memoInput').value
        };
    }

    // 入力フィールドクリア
    clearInputFields() {
        document.getElementById('weightValue').value = '50.0';
        document.getElementById('memoInput').value = '';
        this.resetTimingButtons();
    }

    // データ検証
    validateInput() {
        const data = this.getInputData();
        if (!data.date || !data.value) {
            this.log('❌ 日付と値を入力してください');
            return false;
        }
        return true;
    }

    // 履歴表示更新
    updateHistory(entries) {
        const historyDiv = document.getElementById('weightHistory');
        
        if (entries.length > 0) {
            historyDiv.innerHTML = entries.map(entry => {
                let displayText = `${entry.date}`;
                if (entry.time) displayText += ` ${entry.time}`;
                displayText += `: ${entry.value || entry.weight}`;
                if (entry.timing) displayText += ` (${entry.timing})`;
                if (entry.memo) displayText += ` - ${entry.memo}`;
                
                return `<div style="display: flex; justify-content: space-between; align-items: center; padding: 2px 0; border-bottom: 1px solid #eee;">
                    <span>${displayText}</span>
                    <button onclick="window.deleteEntry('${entry.id}')" style="background: #dc3545; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 10px;">🗑️</button>
                </div>`;
            }).join('');
        } else {
            historyDiv.innerHTML = 'まだデータがありません';
        }
    }

    // キーボード操作ハンドラ
    handleWeightKeypress(event) {
        const weightInput = document.getElementById('weightValue');
        const currentValue = parseFloat(weightInput.value) || 50.0;
        
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            weightInput.value = (currentValue + 0.1).toFixed(1);
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            weightInput.value = Math.max(0, currentValue - 0.1).toFixed(1);
        }
    }

    // ログコピー
    copyLogs() {
        const logArea = document.getElementById('logArea');
        const logText = logArea.innerText || logArea.textContent;
        
        navigator.clipboard.writeText(logText).then(() => {
            alert('✅ ログをコピーしました');
        }).catch(() => {
            // fallback
            const textArea = document.createElement('textarea');
            textArea.value = logText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('✅ ログをコピーしました');
        });
    }

    // デバッグ情報生成
    generateDebugInfo(firebaseConfig, currentUser) {
        return `アプリテンプレート v0.2 デバッグ情報
=================================
タイムスタンプ: ${new Date().toLocaleString()}
URL: ${window.location.href}
プロトコル: ${window.location.protocol}
ドメイン: ${window.location.hostname}
ユーザーエージェント: ${navigator.userAgent}

Firebase設定:
- プロジェクトID: ${firebaseConfig.projectId}
- データベースURL: ${firebaseConfig.databaseURL}
- 認証ドメイン: ${firebaseConfig.authDomain}

認証状態: ${currentUser ? 'ログイン済み' : '未ログイン'}
${currentUser ? `- UID: ${currentUser.uid.substring(0,8)}...\n- Email: ${currentUser.email}\n- 表示名: ${currentUser.displayName}` : ''}

ログ内容:
${document.getElementById('logArea').innerText}`;
    }
}