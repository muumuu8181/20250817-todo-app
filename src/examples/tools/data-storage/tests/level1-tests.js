#!/usr/bin/env node

/**
 * Level 1 Data Storage Tests
 * Basic test suite for JSON storage and CSV export functionality
 */

const StorageManager = require('../core/storage-manager.js');
const path = require('path');
const fs = require('fs').promises;

class TestRunner {
  constructor() {
    this.testDir = path.join(__dirname, '..', '..', '..', 'test-data');
    this.storage = new StorageManager({ baseDir: this.testDir });
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      errors: []
    };
  }

  async setup() {
    try {
      // Clean up test directory
      await fs.rmdir(this.testDir, { recursive: true }).catch(() => {});
      await fs.mkdir(this.testDir, { recursive: true });
      console.log('✅ Test environment setup complete');
      return true;
    } catch (error) {
      console.error('❌ Test setup failed:', error.message);
      return false;
    }
  }

  async cleanup() {
    try {
      await fs.rmdir(this.testDir, { recursive: true }).catch(() => {});
      console.log('✅ Test cleanup complete');
    } catch (error) {
      console.warn('⚠️  Test cleanup warning:', error.message);
    }
  }

  async runTest(name, testFn) {
    this.results.total++;
    try {
      console.log(`\n🧪 Testing: ${name}`);
      await testFn();
      this.results.passed++;
      console.log(`✅ PASS: ${name}`);
    } catch (error) {
      this.results.failed++;
      this.results.errors.push({ test: name, error: error.message });
      console.log(`❌ FAIL: ${name} - ${error.message}`);
    }
  }

  assertEqual(actual, expected, message = '') {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(`${message} - Expected: ${JSON.stringify(expected)}, Got: ${JSON.stringify(actual)}`);
    }
  }

  assertTrue(condition, message = '') {
    if (!condition) {
      throw new Error(`${message} - Expected true, got false`);
    }
  }

  assertSuccess(result, message = '') {
    if (!result.success) {
      throw new Error(`${message} - Operation failed: ${result.error}`);
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Level 1 Data Storage Tests\n');
    
    if (!(await this.setup())) {
      return;
    }

    // Initialize storage
    await this.runTest('Storage Initialization', async () => {
      const result = await this.storage.initialize();
      this.assertSuccess(result, 'Storage initialization failed');
    });

    // Health check
    await this.runTest('Health Check', async () => {
      const result = await this.storage.healthCheck();
      this.assertSuccess(result, 'Health check failed');
      this.assertEqual(result.level, 1, 'Wrong storage level');
      this.assertTrue(result.initialized, 'Storage not initialized');
    });

    // Basic save and load
    await this.runTest('Basic Save and Load', async () => {
      const testData = [
        { id: 1, name: 'Test Item 1' },
        { id: 2, name: 'Test Item 2' }
      ];
      
      const saveResult = await this.storage.save('test_collection', testData);
      this.assertSuccess(saveResult, 'Save failed');
      this.assertEqual(saveResult.recordCount, 2, 'Wrong record count');
      
      const loadResult = await this.storage.load('test_collection');
      this.assertSuccess(loadResult, 'Load failed');
      this.assertEqual(loadResult.data, testData, 'Loaded data does not match saved data');
    });

    // Add items
    await this.runTest('Add Items', async () => {
      const newItem = { id: 3, name: 'Added Item' };
      
      const addResult = await this.storage.add('test_collection', newItem);
      this.assertSuccess(addResult, 'Add failed');
      
      const loadResult = await this.storage.load('test_collection');
      this.assertSuccess(loadResult, 'Load after add failed');
      this.assertEqual(loadResult.recordCount, 3, 'Wrong record count after add');
      
      const lastItem = loadResult.data[loadResult.data.length - 1];
      this.assertEqual(lastItem.id, 3, 'Added item not found');
      this.assertTrue(lastItem.timestamp, 'Timestamp not added');
    });

    // Update items
    await this.runTest('Update Items', async () => {
      const updatedItem = { id: 1, name: 'Updated Item 1', status: 'modified' };
      
      const updateResult = await this.storage.update('test_collection', 0, updatedItem);
      this.assertSuccess(updateResult, 'Update failed');
      
      const loadResult = await this.storage.load('test_collection');
      this.assertSuccess(loadResult, 'Load after update failed');
      
      const firstItem = loadResult.data[0];
      this.assertEqual(firstItem.name, 'Updated Item 1', 'Item not updated');
      this.assertEqual(firstItem.status, 'modified', 'New field not added');
      this.assertTrue(firstItem.lastModified, 'LastModified timestamp not added');
    });

    // Delete items
    await this.runTest('Delete Items', async () => {
      const deleteResult = await this.storage.delete('test_collection', 1);
      this.assertSuccess(deleteResult, 'Delete failed');
      this.assertEqual(deleteResult.remainingCount, 2, 'Wrong remaining count');
      
      const loadResult = await this.storage.load('test_collection');
      this.assertSuccess(loadResult, 'Load after delete failed');
      this.assertEqual(loadResult.recordCount, 2, 'Wrong record count after delete');
    });

    // List collections
    await this.runTest('List Collections', async () => {
      // Add another collection
      await this.storage.save('second_collection', { test: true });
      
      const listResult = await this.storage.listCollections();
      this.assertSuccess(listResult, 'List collections failed');
      this.assertTrue(listResult.collections.includes('test_collection'), 'First collection not found');
      this.assertTrue(listResult.collections.includes('second_collection'), 'Second collection not found');
      this.assertEqual(listResult.count, 2, 'Wrong collection count');
    });

    // Get statistics
    await this.runTest('Get Statistics', async () => {
      const statsResult = await this.storage.getStats();
      this.assertSuccess(statsResult, 'Get stats failed');
      this.assertEqual(statsResult.stats.totalCollections, 2, 'Wrong total collections in stats');
    });

    // CSV Export
    await this.runTest('CSV Export', async () => {
      const exportResult = await this.storage.exportCSV('test_collection', 'test_export');
      this.assertSuccess(exportResult, 'CSV export failed');
      this.assertTrue(exportResult.filename.includes('test_export'), 'Wrong export filename');
      this.assertTrue(exportResult.rowCount > 0, 'No rows exported');
    });

    // Batch operations
    await this.runTest('Batch Add', async () => {
      const batchItems = [
        { name: 'Batch Item 1' },
        { name: 'Batch Item 2' },
        { name: 'Batch Item 3' }
      ];
      
      const batchResult = await this.storage.batchAdd('batch_collection', batchItems);
      this.assertSuccess(batchResult, 'Batch add failed');
      this.assertEqual(batchResult.total, 3, 'Wrong total items');
      this.assertEqual(batchResult.successful, 3, 'Not all items added successfully');
      
      const loadResult = await this.storage.load('batch_collection');
      this.assertSuccess(loadResult, 'Load after batch add failed');
      this.assertEqual(loadResult.recordCount, 3, 'Wrong record count after batch add');
    });

    // Error handling
    await this.runTest('Error Handling', async () => {
      // Try to load non-existent collection
      const loadResult = await this.storage.load('non_existent');
      this.assertTrue(!loadResult.success, 'Should fail for non-existent collection');
      
      // Try to update with invalid index
      const updateResult = await this.storage.update('test_collection', 999, { test: true });
      this.assertTrue(!updateResult.success, 'Should fail for invalid index');
      
      // Try to delete with invalid index
      const deleteResult = await this.storage.delete('test_collection', 999);
      this.assertTrue(!deleteResult.success, 'Should fail for invalid index');
    });

    // Quick methods
    await this.runTest('Quick Methods', async () => {
      const data = await this.storage.quickLoad('test_collection', []);
      this.assertTrue(Array.isArray(data), 'Quick load should return array');
      
      const saveResult = await this.storage.quickSave('quick_test', [{ test: true }]);
      this.assertTrue(saveResult !== null, 'Quick save should succeed');
      
      const addResult = await this.storage.quickAdd('quick_test', { test2: true });
      this.assertTrue(addResult !== null, 'Quick add should succeed');
    });

    await this.cleanup();
    this.printResults();
  }

  printResults() {
    console.log('\n📊 Test Results Summary');
    console.log('========================');
    console.log(`Total Tests: ${this.results.total}`);
    console.log(`Passed: ${this.results.passed}`);
    console.log(`Failed: ${this.results.failed}`);
    console.log(`Success Rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);
    
    if (this.results.errors.length > 0) {
      console.log('\n❌ Failures:');
      this.results.errors.forEach(error => {
        console.log(`  • ${error.test}: ${error.error}`);
      });
    }
    
    if (this.results.failed === 0) {
      console.log('\n🎉 All tests passed!');
    } else {
      console.log(`\n⚠️  ${this.results.failed} test(s) failed`);
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const runner = new TestRunner();
  runner.runAllTests().catch(error => {
    console.error('💥 Test runner crashed:', error);
    process.exit(1);
  });
}

module.exports = TestRunner;