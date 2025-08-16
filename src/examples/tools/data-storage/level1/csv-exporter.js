/**
 * CSV Exporter - Level 1 Implementation
 * Convert JSON data to CSV format with proper escaping
 */

const FileUtils = require('../core/file-utils.js');
const path = require('path');

class CSVExporter {
  constructor(baseDir = './data') {
    this.fileUtils = new FileUtils(baseDir);
  }

  /**
   * Convert JSON data to CSV format
   */
  jsonToCSV(data, options = {}) {
    try {
      if (!Array.isArray(data)) {
        // Convert single object to array
        data = [data];
      }
      
      if (data.length === 0) {
        return { success: true, csv: '' };
      }

      const {
        includeHeaders = true,
        delimiter = ',',
        quoteChar = '"',
        escapeChar = '"',
        excludeFields = []
      } = options;

      // Get all unique keys from all objects
      const allKeys = [...new Set(
        data.flatMap(obj => Object.keys(obj))
      )].filter(key => !excludeFields.includes(key));

      let csv = '';
      
      // Add headers
      if (includeHeaders) {
        csv += allKeys.map(key => this.escapeCSVField(key, quoteChar, escapeChar)).join(delimiter) + '\n';
      }

      // Add data rows
      for (const row of data) {
        const values = allKeys.map(key => {
          let value = row[key];
          
          // Handle different data types
          if (value === null || value === undefined) {
            return '';
          } else if (typeof value === 'object') {
            value = JSON.stringify(value);
          } else if (typeof value === 'boolean') {
            value = value.toString();
          } else if (typeof value === 'number') {
            value = value.toString();
          } else {
            value = String(value);
          }
          
          return this.escapeCSVField(value, quoteChar, escapeChar);
        });
        
        csv += values.join(delimiter) + '\n';
      }

      return { success: true, csv };
    } catch (error) {
      return { 
        success: false, 
        error: `CSV conversion failed: ${error.message}` 
      };
    }
  }

  /**
   * Escape CSV field with proper quoting
   */
  escapeCSVField(field, quoteChar = '"', escapeChar = '"') {
    const fieldStr = String(field);
    
    // Check if field needs quoting
    const needsQuoting = fieldStr.includes(',') || 
                        fieldStr.includes('\n') || 
                        fieldStr.includes('\r') || 
                        fieldStr.includes(quoteChar);
    
    if (needsQuoting) {
      // Escape existing quotes
      const escaped = fieldStr.replace(new RegExp(quoteChar, 'g'), escapeChar + quoteChar);
      return quoteChar + escaped + quoteChar;
    }
    
    return fieldStr;
  }

  /**
   * Export data to CSV file
   */
  async exportToFile(data, filename, options = {}) {
    try {
      await this.fileUtils.initialize();
      
      const csvResult = this.jsonToCSV(data, options);
      if (!csvResult.success) {
        return csvResult;
      }

      // Ensure filename has .csv extension
      if (!filename.endsWith('.csv')) {
        filename += '.csv';
      }

      // Save to exports directory
      const exportsPath = path.join('exports', filename);
      const saveResult = await this.fileUtils.writeFile(exportsPath, csvResult.csv);
      
      if (saveResult.success) {
        return {
          success: true,
          filename,
          rowCount: Array.isArray(data) ? data.length : 1,
          filePath: path.join(this.fileUtils.exportsDir, filename)
        };
      } else {
        return saveResult;
      }
    } catch (error) {
      return { 
        success: false, 
        error: `Export failed: ${error.message}` 
      };
    }
  }

  /**
   * Export JSON collection to CSV
   */
  async exportCollection(jsonStorage, collection, filename = null, options = {}) {
    try {
      const loadResult = await jsonStorage.load(collection);
      if (!loadResult.success) {
        return loadResult;
      }

      const exportFilename = filename || `${collection}_export_${Date.now()}`;
      return await this.exportToFile(loadResult.data, exportFilename, options);
    } catch (error) {
      return { 
        success: false, 
        error: `Collection export failed: ${error.message}` 
      };
    }
  }

  /**
   * Parse CSV data back to JSON (basic implementation)
   */
  csvToJSON(csvData, options = {}) {
    try {
      const {
        delimiter = ',',
        quoteChar = '"',
        hasHeaders = true,
        skipEmptyLines = true
      } = options;

      const lines = csvData.split('\n');
      if (lines.length === 0) {
        return { success: true, data: [] };
      }

      let headers = [];
      let startIndex = 0;

      if (hasHeaders) {
        headers = this.parseCSVLine(lines[0], delimiter, quoteChar);
        startIndex = 1;
      }

      const data = [];
      
      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (skipEmptyLines && !line) continue;
        
        const values = this.parseCSVLine(line, delimiter, quoteChar);
        
        if (hasHeaders) {
          const obj = {};
          headers.forEach((header, index) => {
            obj[header] = values[index] || '';
          });
          data.push(obj);
        } else {
          data.push(values);
        }
      }

      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: `CSV parsing failed: ${error.message}` 
      };
    }
  }

  /**
   * Parse a single CSV line
   */
  parseCSVLine(line, delimiter = ',', quoteChar = '"') {
    const values = [];
    let current = '';
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
      const char = line[i];
      
      if (char === quoteChar) {
        if (inQuotes && line[i + 1] === quoteChar) {
          // Escaped quote
          current += quoteChar;
          i += 2;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
          i++;
        }
      } else if (char === delimiter && !inQuotes) {
        values.push(current);
        current = '';
        i++;
      } else {
        current += char;
        i++;
      }
    }
    
    values.push(current);
    return values;
  }
}

module.exports = CSVExporter;