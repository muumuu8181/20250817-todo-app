/**
 * Storage Manager - Main orchestrator for data storage operations
 * Phase 1: JSON storage with CSV export capability
 */

const JSONStorage = require('../level1/json-storage.js');
const CSVExporter = require('../level1/csv-exporter.js');

class StorageManager {
  constructor(options = {}) {
    this.options = {
      level: 1,
      baseDir: './data',
      autoInit: true,
      ...options
    };
    
    this.jsonStorage = new JSONStorage(this.options.baseDir);
    this.csvExporter = new CSVExporter(this.options.baseDir);
    this.initialized = false;
  }

  /**
   * Initialize storage system
   */
  async initialize() {
    if (this.initialized) return { success: true };
    
    try {
      const result = await this.jsonStorage.initialize();
      if (result.success) {
        this.initialized = true;
        return { 
          success: true, 
          level: this.options.level,
          baseDir: this.options.baseDir 
        };
      } else {
        return result;
      }
    } catch (error) {
      return { 
        success: false, 
        error: `Initialization failed: ${error.message}` 
      };
    }
  }

  /**
   * Auto-initialize if needed
   */
  async ensureInitialized() {
    if (this.options.autoInit && !this.initialized) {
      return await this.initialize();
    }
    return { success: this.initialized };
  }

  // === JSON Storage Operations ===

  /**
   * Save data to collection
   */
  async save(collection, data) {
    await this.ensureInitialized();
    return await this.jsonStorage.save(collection, data);
  }

  /**
   * Load data from collection
   */
  async load(collection) {
    await this.ensureInitialized();
    return await this.jsonStorage.load(collection);
  }

  /**
   * Add item to collection
   */
  async add(collection, item) {
    await this.ensureInitialized();
    return await this.jsonStorage.add(collection, item);
  }

  /**
   * Update item in collection
   */
  async update(collection, index, updatedItem) {
    await this.ensureInitialized();
    return await this.jsonStorage.update(collection, index, updatedItem);
  }

  /**
   * Delete item from collection
   */
  async delete(collection, index) {
    await this.ensureInitialized();
    return await this.jsonStorage.delete(collection, index);
  }

  /**
   * List all collections
   */
  async listCollections() {
    await this.ensureInitialized();
    return await this.jsonStorage.listCollections();
  }

  // === CSV Export Operations ===

  /**
   * Export collection to CSV
   */
  async exportCSV(collection, filename = null, options = {}) {
    await this.ensureInitialized();
    return await this.csvExporter.exportCollection(this.jsonStorage, collection, filename, options);
  }

  /**
   * Export data directly to CSV
   */
  async exportDataToCSV(data, filename, options = {}) {
    await this.ensureInitialized();
    return await this.csvExporter.exportToFile(data, filename, options);
  }

  // === Utility Operations ===

  /**
   * Get storage statistics
   */
  async getStats() {
    await this.ensureInitialized();
    return await this.jsonStorage.getStats();
  }

  /**
   * Get system health check
   */
  async healthCheck() {
    try {
      const initResult = await this.ensureInitialized();
      if (!initResult.success) {
        return { 
          success: false, 
          status: 'initialization_failed',
          error: initResult.error 
        };
      }

      const stats = await this.getStats();
      const collections = await this.listCollections();
      
      return {
        success: true,
        status: 'healthy',
        level: this.options.level,
        initialized: this.initialized,
        baseDir: this.options.baseDir,
        collections: collections.success ? collections.collections : [],
        totalCollections: collections.success ? collections.count : 0,
        stats: stats.success ? stats.stats : null
      };
    } catch (error) {
      return {
        success: false,
        status: 'error',
        error: error.message
      };
    }
  }

  /**
   * Reset storage (WARNING: Deletes all data)
   */
  async reset() {
    try {
      const collections = await this.listCollections();
      if (!collections.success) {
        return { success: true, message: 'No collections to reset' };
      }

      // This is a simple reset - just save empty arrays
      let resetCount = 0;
      for (const collection of collections.collections) {
        const result = await this.save(collection, []);
        if (result.success) resetCount++;
      }

      return {
        success: true,
        message: `Reset ${resetCount} collections`,
        resetCollections: resetCount
      };
    } catch (error) {
      return {
        success: false,
        error: `Reset failed: ${error.message}`
      };
    }
  }

  // === Convenience Methods ===

  /**
   * Quick data operations with automatic error handling
   */
  async quickSave(collection, data) {
    const result = await this.save(collection, data);
    if (!result.success) {
      console.error(`Storage Error: ${result.error}`);
      return null;
    }
    return result;
  }

  async quickLoad(collection, defaultValue = []) {
    const result = await this.load(collection);
    if (!result.success) {
      console.warn(`Storage Warning: ${result.error}`);
      return defaultValue;
    }
    return result.data;
  }

  async quickAdd(collection, item) {
    const result = await this.add(collection, item);
    if (!result.success) {
      console.error(`Storage Error: ${result.error}`);
      return null;
    }
    return result;
  }

  /**
   * Batch operations
   */
  async batchAdd(collection, items) {
    const results = [];
    for (const item of items) {
      const result = await this.add(collection, item);
      results.push(result);
    }
    
    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;
    
    return {
      success: failed === 0,
      total: results.length,
      successful,
      failed,
      results
    };
  }
}

module.exports = StorageManager;