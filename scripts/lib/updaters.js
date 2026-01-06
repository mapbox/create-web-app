// Updaters - Apply updates to package.json files

import { writeFile } from 'fs/promises';
import chalk from 'chalk';
import { getJSONFromFile } from './fetchers.js';

/**
 * Apply updates to a package.json file
 * @param {string} localPath - Path to the package.json file
 * @param {Array} updates - Array of update objects with path, oldValue, newValue
 */
export async function applyUpdates(localPath, updates) {
  try {
    const packageJson = await getJSONFromFile(localPath);
    
    // Apply each update
    for (const update of updates) {
      let obj = packageJson;
      const lastKey = update.path[update.path.length - 1];
      
      // Navigate to the parent object
      for (let i = 0; i < update.path.length - 1; i++) {
        if (!obj[update.path[i]]) {
          obj[update.path[i]] = {};
        }
        obj = obj[update.path[i]];
      }
      
      // Update the value
      obj[lastKey] = update.newValue;
    }
    
    // Write back to file with pretty formatting
    await writeFile(localPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');
    console.log(chalk.green(`✓ Updated ${localPath}`));
    
  } catch (err) {
    console.error(chalk.red(`✗ Failed to update ${localPath}:`), err.message);
  }
}
