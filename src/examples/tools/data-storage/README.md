# Data Storage Module - Phase 1

## Overview
Level 1 basic data storage for the project template. Completely optional and self-contained.

## Structure
```
tools/data-storage/
├── core/
│   ├── storage-manager.js   # Main storage orchestrator
│   └── file-utils.js        # Safe file operations
├── level1/
│   ├── json-storage.js      # JSON file operations
│   └── csv-exporter.js      # CSV export functionality
├── examples/
│   └── basic-demo.html      # Usage demonstration
└── tests/
    └── level1-tests.js      # Basic tests
```

## Usage
```javascript
// Simple API
const DataStorage = require('./tools/data-storage/core/storage-manager.js');
const storage = new DataStorage({ level: 1 });

// Basic operations
await storage.save('tasks', data);
const tasks = await storage.load('tasks');
await storage.exportCSV('tasks', './exports/tasks.csv');
```

## Data Location
- All data files stored in: `./data/` (auto-created)
- Exports stored in: `./data/exports/` (auto-created)
- No system-wide modifications

## Safety Features
- Automatic backup before overwrites
- Graceful error handling
- File permission validation
- Storage quota monitoring