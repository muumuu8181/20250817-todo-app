/**
 * File Utilities - Safe file operations with error handling
 * Phase 1: JSON/CSV only, no external dependencies
 */

const fs = require('fs').promises;
const path = require('path');

class FileUtils {
  constructor(baseDir = './data') {
    this.baseDir = path.resolve(baseDir);
    this.backupDir = path.join(this.baseDir, '.backups');
    this.exportsDir = path.join(this.baseDir, 'exports');
  }

  /**
   * Initialize directories safely
   */
  async initialize() {
    try {
      await fs.mkdir(this.baseDir, { recursive: true });
      await fs.mkdir(this.backupDir, { recursive: true });
      await fs.mkdir(this.exportsDir, { recursive: true });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if file exists safely
   */
  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Read file with error handling
   */
  async readFile(filename) {
    try {
      const filePath = path.join(this.baseDir, filename);
      const data = await fs.readFile(filePath, 'utf8');
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Write file with automatic backup
   */
  async writeFile(filename, data) {
    try {
      const filePath = path.join(this.baseDir, filename);
      
      // Create backup if file exists
      if (await this.fileExists(filePath)) {
        await this.createBackup(filename);
      }

      await fs.writeFile(filePath, data, 'utf8');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Create backup of existing file
   */
  async createBackup(filename) {
    try {
      const sourcePath = path.join(this.baseDir, filename);
      const backupName = `${filename}.backup.${Date.now()}`;
      const backupPath = path.join(this.backupDir, backupName);
      
      if (await this.fileExists(sourcePath)) {
        const data = await fs.readFile(sourcePath, 'utf8');
        await fs.writeFile(backupPath, data, 'utf8');
      }
      
      return { success: true, backupPath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get storage info
   */
  async getStorageInfo() {
    try {
      const files = await fs.readdir(this.baseDir);
      const info = {
        baseDir: this.baseDir,
        totalFiles: files.length,
        files: files.filter(f => !f.startsWith('.')),
        backupsAvailable: false
      };

      try {
        const backups = await fs.readdir(this.backupDir);
        info.backupsAvailable = backups.length > 0;
        info.totalBackups = backups.length;
      } catch {
        // Backup dir doesn't exist yet
      }

      return { success: true, info };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Clean old backups (keep last 5)
   */
  async cleanOldBackups() {
    try {
      const backups = await fs.readdir(this.backupDir);
      if (backups.length <= 5) return { success: true, cleaned: 0 };

      // Sort by creation time (newest first)
      const backupDetails = await Promise.all(
        backups.map(async (file) => {
          const filePath = path.join(this.backupDir, file);
          const stats = await fs.stat(filePath);
          return { file, path: filePath, time: stats.mtime };
        })
      );

      backupDetails.sort((a, b) => b.time - a.time);
      
      // Remove old backups (keep first 5)
      const toDelete = backupDetails.slice(5);
      await Promise.all(toDelete.map(backup => fs.unlink(backup.path)));

      return { success: true, cleaned: toDelete.length };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = FileUtils;