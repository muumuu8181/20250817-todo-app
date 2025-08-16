/**
 * JSON Storage - Level 1 Implementation
 * Safe JSON file operations with validation and error recovery
 */

const FileUtils = require('../core/file-utils.js');

class JSONStorage {
  constructor(baseDir = './data') {
    this.fileUtils = new FileUtils(baseDir);
    this.initialized = false;
  }

  /**
   * Initialize storage
   */
  async initialize() {
    if (this.initialized) return { success: true };
    
    const result = await this.fileUtils.initialize();
    if (result.success) {
      this.initialized = true;
    }
    return result;
  }

  /**
   * Save data to JSON file
   */
  async save(collection, data) {
    try {
      await this.initialize();
      
      // Validate data can be JSON stringified
      const jsonData = JSON.stringify(data, null, 2);
      const filename = `${collection}.json`;
      
      const result = await this.fileUtils.writeFile(filename, jsonData);
      
      if (result.success) {
        return { 
          success: true, 
          collection, 
          filename,
          recordCount: Array.isArray(data) ? data.length : 1
        };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { 
        success: false, 
        error: `JSON serialization failed: ${error.message}` 
      };
    }
  }

  /**
   * Load data from JSON file
   */
  async load(collection) {
    try {
      await this.initialize();
      
      const filename = `${collection}.json`;
      const result = await this.fileUtils.readFile(filename);
      
      if (!result.success) {
        return { 
          success: false, 
          error: `Collection '${collection}' not found`,
          data: null 
        };
      }

      try {
        const data = JSON.parse(result.data);
        return { 
          success: true, 
          collection, 
          data,
          recordCount: Array.isArray(data) ? data.length : 1
        };
      } catch (parseError) {
        return { 
          success: false, 
          error: `Invalid JSON in collection '${collection}': ${parseError.message}`,
          data: null 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.message,
        data: null 
      };
    }
  }

  /**
   * Add item to collection (array-based)
   */
  async add(collection, item) {
    try {
      const loadResult = await this.load(collection);
      let data = [];
      
      if (loadResult.success && Array.isArray(loadResult.data)) {
        data = loadResult.data;
      }
      
      // Add timestamp if not present
      if (typeof item === 'object' && item !== null && !item.timestamp) {
        item.timestamp = new Date().toISOString();
      }
      
      data.push(item);
      return await this.save(collection, data);
    } catch (error) {
      return { 
        success: false, 
        error: `Failed to add item: ${error.message}` 
      };
    }
  }

  /**
   * Update item in collection by index
   */
  async update(collection, index, updatedItem) {
    try {
      const loadResult = await this.load(collection);
      
      if (!loadResult.success || !Array.isArray(loadResult.data)) {
        return { 
          success: false, 
          error: `Collection '${collection}' not found or not an array` 
        };
      }
      
      if (index < 0 || index >= loadResult.data.length) {
        return { 
          success: false, 
          error: `Index ${index} out of bounds` 
        };
      }
      
      // Add update timestamp
      if (typeof updatedItem === 'object' && updatedItem !== null) {
        updatedItem.lastModified = new Date().toISOString();
      }
      
      loadResult.data[index] = updatedItem;
      return await this.save(collection, loadResult.data);
    } catch (error) {
      return { 
        success: false, 
        error: `Failed to update item: ${error.message}` 
      };
    }
  }

  /**
   * Delete item from collection by index
   */
  async delete(collection, index) {
    try {
      const loadResult = await this.load(collection);
      
      if (!loadResult.success || !Array.isArray(loadResult.data)) {
        return { 
          success: false, 
          error: `Collection '${collection}' not found or not an array` 
        };
      }
      
      if (index < 0 || index >= loadResult.data.length) {
        return { 
          success: false, 
          error: `Index ${index} out of bounds` 
        };
      }
      
      const deletedItem = loadResult.data[index];
      loadResult.data.splice(index, 1);
      
      const saveResult = await this.save(collection, loadResult.data);
      
      if (saveResult.success) {
        return { 
          success: true, 
          deletedItem,
          remainingCount: loadResult.data.length 
        };
      } else {
        return saveResult;
      }
    } catch (error) {
      return { 
        success: false, 
        error: `Failed to delete item: ${error.message}` 
      };
    }
  }

  /**
   * List all collections
   */
  async listCollections() {
    try {
      await this.initialize();
      
      const storageInfo = await this.fileUtils.getStorageInfo();
      if (!storageInfo.success) {
        return { success: false, error: storageInfo.error };
      }
      
      const collections = storageInfo.info.files
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''));
      
      return { 
        success: true, 
        collections,
        count: collections.length 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  /**
   * Get storage statistics
   */
  async getStats() {
    try {
      const collectionsResult = await this.listCollections();
      if (!collectionsResult.success) {
        return collectionsResult;
      }
      
      const stats = {
        totalCollections: collectionsResult.collections.length,
        collections: {}
      };
      
      // Get stats for each collection
      for (const collection of collectionsResult.collections) {
        const loadResult = await this.load(collection);
        if (loadResult.success) {
          stats.collections[collection] = {
            recordCount: loadResult.recordCount,
            isArray: Array.isArray(loadResult.data)
          };
        }
      }
      
      return { success: true, stats };
    } catch (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  }
}

module.exports = JSONStorage;