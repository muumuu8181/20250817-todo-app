// src/services/data-manager.js
import { CRUDService } from './crud.js';

export class DataManager {
    constructor(database, logger) {
        this.crud = new CRUDService(database);
        this.log = logger;
    }
    
    // アプリケーション非依存のデータ管理
    async saveAppData(userId, appType, data) {
        return await this.crud.create(userId, appType, data);
    }
    
    async getAppData(userId, appType) {
        return await this.crud.list(userId, appType);
    }
}