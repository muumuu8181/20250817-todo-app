// src/services/crud.js
export class CRUDService {
    constructor(database) {
        this.db = database;
    }
    
    // 汎用作成
    async create(userId, collection, data) {
        const ref = this.db.ref(`users/${userId}/${collection}`);
        return await ref.push({
            ...data,
            timestamp: Date.now(),
            createdAt: new Date().toISOString()
        });
    }
    
    // 汎用読み取り
    async read(userId, collection, id) {
        const ref = this.db.ref(`users/${userId}/${collection}/${id}`);
        const snapshot = await ref.once('value');
        return snapshot.val();
    }
    
    // 汎用更新
    async update(userId, collection, id, data) {
        const ref = this.db.ref(`users/${userId}/${collection}/${id}`);
        return await ref.update({
            ...data,
            updatedAt: new Date().toISOString()
        });
    }
    
    // 汎用削除
    async delete(userId, collection, id) {
        const ref = this.db.ref(`users/${userId}/${collection}/${id}`);
        return await ref.remove();
    }
    
    // 汎用リスト取得
    async list(userId, collection, limit = 100) {
        const ref = this.db.ref(`users/${userId}/${collection}`);
        const snapshot = await ref.limitToLast(limit).once('value');
        const data = snapshot.val() || {};
        return Object.entries(data).map(([id, value]) => ({
            id,
            ...value
        }));
    }
}