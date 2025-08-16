#!/usr/bin/env node

/**
 * Data Storage Usage Examples
 * Demonstrates how to use Level 1 data storage in Node.js applications
 */

const StorageManager = require('../tools/data-storage/core/storage-manager.js');

async function demonstrateBasicUsage() {
  console.log('🚀 Data Storage Level 1 - Usage Examples\n');

  // Initialize storage
  const storage = new StorageManager({
    level: 1,
    baseDir: './examples-data',
    autoInit: true
  });

  try {
    // 1. Health Check
    console.log('1️⃣ Health Check');
    const health = await storage.healthCheck();
    console.log('Status:', health.status);
    console.log('Level:', health.level);
    console.log();

    // 2. Save a collection
    console.log('2️⃣ Saving Tasks Collection');
    const tasks = [
      { id: 1, title: 'Learn data storage', completed: false, priority: 'high' },
      { id: 2, title: 'Build awesome app', completed: false, priority: 'medium' },
      { id: 3, title: 'Deploy to production', completed: false, priority: 'low' }
    ];
    
    const saveResult = await storage.save('tasks', tasks);
    console.log('Saved:', saveResult.collection, '-', saveResult.recordCount, 'records');
    console.log();

    // 3. Load and display
    console.log('3️⃣ Loading Tasks Collection');
    const loadResult = await storage.load('tasks');
    console.log('Loaded:', loadResult.recordCount, 'tasks');
    loadResult.data.forEach(task => {
      console.log(`  - ${task.title} [${task.priority}] ${task.completed ? '✅' : '⏳'}`);
    });
    console.log();

    // 4. Add new items
    console.log('4️⃣ Adding New Tasks');
    await storage.add('tasks', { 
      id: 4, 
      title: 'Write documentation', 
      completed: false, 
      priority: 'medium' 
    });
    
    await storage.add('tasks', { 
      id: 5, 
      title: 'Review code', 
      completed: true, 
      priority: 'high' 
    });
    
    console.log('Added 2 new tasks');
    console.log();

    // 5. Update an item
    console.log('5️⃣ Updating Task');
    await storage.update('tasks', 0, {
      id: 1,
      title: 'Learn advanced data storage',
      completed: true,
      priority: 'high',
      notes: 'Completed with examples'
    });
    console.log('Updated first task');
    console.log();

    // 6. Show updated collection
    console.log('6️⃣ Updated Tasks Collection');
    const updatedTasks = await storage.load('tasks');
    updatedTasks.data.forEach((task, index) => {
      const status = task.completed ? '✅' : '⏳';
      const timestamp = task.timestamp ? ` (${new Date(task.timestamp).toLocaleTimeString()})` : '';
      console.log(`  ${index}: ${task.title} [${task.priority}] ${status}${timestamp}`);
    });
    console.log();

    // 7. Create another collection (users)
    console.log('7️⃣ Creating Users Collection');
    const users = [
      { id: 1, name: 'Alice Johnson', role: 'admin', email: 'alice@example.com' },
      { id: 2, name: 'Bob Smith', role: 'user', email: 'bob@example.com' }
    ];
    
    await storage.save('users', users);
    console.log('Created users collection with', users.length, 'users');
    console.log();

    // 8. List all collections
    console.log('8️⃣ All Collections');
    const collections = await storage.listCollections();
    console.log('Available collections:', collections.collections.join(', '));
    console.log();

    // 9. Get statistics
    console.log('9️⃣ Storage Statistics');
    const stats = await storage.getStats();
    console.log('Total collections:', stats.stats.totalCollections);
    Object.entries(stats.stats.collections).forEach(([name, info]) => {
      console.log(`  - ${name}: ${info.recordCount} records (${info.isArray ? 'array' : 'object'})`);
    });
    console.log();

    // 10. Export to CSV
    console.log('🔟 CSV Export');
    const exportResult = await storage.exportCSV('tasks', 'my_tasks_export');
    console.log('Exported to:', exportResult.filename);
    console.log('Rows exported:', exportResult.rowCount);
    console.log();

    // 11. Batch operations
    console.log('1️⃣1️⃣ Batch Operations');
    const newTasks = [
      { title: 'Batch task 1', completed: false, priority: 'low' },
      { title: 'Batch task 2', completed: false, priority: 'medium' },
      { title: 'Batch task 3', completed: true, priority: 'high' }
    ];
    
    const batchResult = await storage.batchAdd('batch_tasks', newTasks);
    console.log(`Batch added: ${batchResult.successful}/${batchResult.total} items`);
    console.log();

    // 12. Quick methods (with error handling)
    console.log('1️⃣2️⃣ Quick Methods Demo');
    
    // Quick load with default value
    const settings = await storage.quickLoad('app_settings', { theme: 'light', version: '1.0' });
    console.log('App settings:', settings);
    
    // Quick save
    const quickSaveResult = await storage.quickSave('app_settings', { 
      theme: 'dark', 
      version: '1.1',
      lastModified: new Date().toISOString()
    });
    console.log('Quick save result:', quickSaveResult ? 'Success' : 'Failed');
    
    // Quick add
    const quickAddResult = await storage.quickAdd('logs', {
      level: 'info',
      message: 'Application demo completed',
      timestamp: new Date().toISOString()
    });
    console.log('Quick add result:', quickAddResult ? 'Success' : 'Failed');
    console.log();

    // 13. Final statistics
    console.log('1️⃣3️⃣ Final Statistics');
    const finalStats = await storage.getStats();
    console.log('Final collection count:', finalStats.stats.totalCollections);
    console.log('Collections created during demo:');
    Object.entries(finalStats.stats.collections).forEach(([name, info]) => {
      console.log(`  ✨ ${name}: ${info.recordCount} records`);
    });

    console.log('\n🎉 Demo completed successfully!');
    console.log('\n📁 Data stored in: ./examples-data/');
    console.log('📊 Exports available in: ./examples-data/exports/');
    console.log('\nTip: Run this script multiple times to see how data persists!');

  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    process.exit(1);
  }
}

// Error handling demo
async function demonstrateErrorHandling() {
  console.log('\n🛡️  Error Handling Examples\n');
  
  const storage = new StorageManager({ baseDir: './examples-data' });
  
  // 1. Try to load non-existent collection
  console.log('1️⃣ Loading non-existent collection');
  const loadResult = await storage.load('does_not_exist');
  console.log('Result:', loadResult.success ? 'Success' : `Error: ${loadResult.error}`);
  
  // 2. Try to update with invalid index
  console.log('2️⃣ Updating with invalid index');
  const updateResult = await storage.update('tasks', 999, { test: true });
  console.log('Result:', updateResult.success ? 'Success' : `Error: ${updateResult.error}`);
  
  // 3. Quick methods with graceful handling
  console.log('3️⃣ Quick methods with graceful handling');
  const defaultData = await storage.quickLoad('missing_collection', []);
  console.log('Default data returned:', Array.isArray(defaultData) ? 'Empty array' : defaultData);
  
  console.log('\n✅ Error handling demo completed\n');
}

// Performance demo
async function demonstratePerformance() {
  console.log('⚡ Performance Examples\n');
  
  const storage = new StorageManager({ baseDir: './examples-data' });
  
  // 1. Large collection test
  console.log('1️⃣ Large collection performance test');
  const largeData = Array.from({ length: 1000 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    value: Math.random(),
    timestamp: new Date().toISOString()
  }));
  
  const startTime = Date.now();
  await storage.save('large_collection', largeData);
  const saveTime = Date.now() - startTime;
  console.log(`Saved 1000 items in ${saveTime}ms`);
  
  // 2. Load performance
  const loadStart = Date.now();
  const loadResult = await storage.load('large_collection');
  const loadTime = Date.now() - loadStart;
  console.log(`Loaded ${loadResult.recordCount} items in ${loadTime}ms`);
  
  // 3. Export performance
  const exportStart = Date.now();
  await storage.exportCSV('large_collection', 'performance_test');
  const exportTime = Date.now() - exportStart;
  console.log(`Exported to CSV in ${exportTime}ms`);
  
  console.log('\n⚡ Performance demo completed\n');
}

// Main execution
if (require.main === module) {
  async function runAllDemos() {
    await demonstrateBasicUsage();
    await demonstrateErrorHandling();
    await demonstratePerformance();
  }
  
  runAllDemos().catch(error => {
    console.error('💥 Demo crashed:', error);
    process.exit(1);
  });
}

module.exports = {
  demonstrateBasicUsage,
  demonstrateErrorHandling,
  demonstratePerformance
};