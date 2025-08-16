// ============================================================
// 🎨 カスタムアプリ設定 - 自由に変更可能
// ============================================================

export const APP_CONFIG = {
    // アプリの基本情報（自由に変更可能）
    name: "Todo Manager",
    version: "0.1",
    description: "シンプルで使いやすいTODO管理アプリ",
    
    // デフォルト値設定（カスタマイズ可能）
    defaults: {
        priority: "medium",
        status: "pending",
        category: "general"
    },
    
    // UI設定（カスタマイズ可能）
    ui: {
        theme: {
            primaryColor: "#ff0080",
            secondaryColor: "#8000ff",
            successColor: "#00ff80",
            backgroundColor: "#000011"
        },
        
        // ブラシツールボタン（自由に変更・追加可能）
        brushTools: [
            { id: "brush", label: "🖌️ ブラシ", color: "#ff0080" },
            { id: "pencil", label: "✏️ ペンシル", color: "#00ffff" },
            { id: "spray", label: "🎨 スプレー", color: "#ff8000" },
            { id: "glow", label: "✨ グロー", color: "#ffff00" },
            { id: "neon", label: "💫 ネオン", color: "#80ff00" },
            { id: "particle", label: "🌟 パーティクル", color: "#ff0040" }
        ],
        
        // キーボードショートカット設定（カスタマイズ可能）
        keyboard: {
            brushUp: "ArrowUp",        // ブラシサイズ増加
            brushDown: "ArrowDown",    // ブラシサイズ減少
            save: "Enter",             // 作品保存
            clear: "Delete",           // キャンバスクリア
            step: 2                    // 調整単位
        },
        
        // 表示設定
        display: {
            maxHistoryItems: 10,       // 履歴表示件数
            dateFormat: "YYYY-MM-DD",  // 日付形式
            timeFormat: "HH:mm"        // 時刻形式
        }
    },
    
    // データ設定（カスタマイズ可能）
    data: {
        // Firebase Collection名（変更する場合は注意）
        collection: "todos",
        
        // 必須フィールド
        requiredFields: ["task", "priority", "date", "time"],
        
        // オプションフィールド
        optionalFields: ["status", "category", "memo", "userEmail"]
    },
    
    // 音響設定
    audio: {
        enabled: true,
        volume: 0.5,
        sounds: {
            brush: "/audio/brush.mp3",
            save: "/audio/save.mp3",
            clear: "/audio/clear.mp3",
            effect: "/audio/effect.mp3"
        }
    },
    
    // エフェクト設定
    effects: {
        particles: true,
        glow: true,
        trails: true,
        sparkles: true
    }
};

// デバッグ設定（開発時のみ有効にする）
export const DEBUG_CONFIG = {
    enabled: true,  // false にすると全デバッグ機能が無効
    features: {
        console: true,      // コンソール出力
        copyButtons: true,  // コピーボタン
        apiLogs: true,      // API通信ログ
        userActions: true   // ユーザー操作ログ
    }
};