// Database Module  
// 責務: Firebase Realtime Databaseとの汎用データ操作

export class DatabaseService {
    constructor(firebaseDatabase, logger) {
        this.database = firebaseDatabase;
        this.log = logger;
    }

    // 汎用データ保存
    async saveData(userId, collection, data) {
        try {
            this.log('💾 データを保存中...');
            
            const now = new Date();
            const timeString = now.toLocaleTimeString('ja-JP', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            const saveData = {
                ...data,
                time: timeString,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                createdAt: now.toISOString()
            };

            const userRef = this.database.ref(`users/${userId}/${collection}`);
            await userRef.push(saveData);
            
            this.log(`✅ 保存完了: ${collection} - ${JSON.stringify(data).substring(0, 50)}...`);
            return true;
        } catch (error) {
            this.log(`❌ 保存エラー: ${error.message}`);
            throw error;
        }
    }

    // 汎用データ削除
    async deleteData(userId, collection, entryId) {
        try {
            this.log(`🗑️ データ削除中: ${collection}/${entryId}`);
            const entryRef = this.database.ref(`users/${userId}/${collection}/${entryId}`);
            await entryRef.remove();
            this.log(`✅ 削除完了: ${entryId}`);
        } catch (error) {
            this.log(`❌ 削除エラー: ${error.message}`);
            throw error;
        }
    }

    // 汎用データ読み込み（リアルタイム監視）
    watchUserData(userId, collection, onDataUpdate) {
        const userRef = this.database.ref(`users/${userId}/${collection}`);
        
        userRef.on('value', (snapshot) => {
            const data = snapshot.val();
            
            if (data) {
                const entries = Object.entries(data)
                    .map(([key, value]) => ({ id: key, ...value }))
                    .sort((a, b) => new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp));
                
                this.log(`📈 データ読み込み完了: ${entries.length}件`);
                onDataUpdate(entries);
            } else {
                this.log('📈 データなし');
                onDataUpdate([]);
            }
        });
    }

    // 監視を停止
    stopWatching(userId, collection) {
        const userRef = this.database.ref(`users/${userId}/${collection}`);
        userRef.off();
    }

    // 接続状態確認
    async checkConnection() {
        const connectedRef = this.database.ref('.info/connected');
        const snapshot = await connectedRef.once('value');
        const connected = snapshot.val();
        this.log(`🌐 Firebase接続状態: ${connected ? '接続中' : '未接続'}`);
        return connected;
    }

    // 汎用データベース構造確認
    async checkDatabaseStructure(userId, collection, userEmail) {
        this.log('🏗️ データベース構造確認中...');
        
        try {
            const userRef = this.database.ref(`users/${userId}/${collection}`);
            const snapshot = await userRef.once('value');
            const data = snapshot.val();
            
            if (data) {
                const entries = Object.keys(data);
                this.log(`📊 ユーザー(${userEmail})の${collection}データ:`);
                this.log(`- 記録数: ${entries.length}件`);
                return { count: entries.length, hasData: true };
            } else {
                this.log('📊 データがありません');
                return { count: 0, hasData: false };
            }
        } catch (error) {
            this.log(`❌ 構造確認エラー: ${error.message}`);
            throw error;
        }
    }
}