// Angular Checker - Check npm registry for latest Angular dependencies

import chalk from 'chalk';
import path from 'path';
import { fetchRemoteFile, getJSONFromFile } from './fetchers.js';

const LOCAL_BASE = path.resolve('templates');

/**
 * Fetch the latest version of a package from npm registry
 */
async function getNpmLatestVersion(packageName) {
  try {
    const data = await fetchRemoteFile(`https://registry.npmjs.org/${packageName}/latest`);
    return data.version;
  } catch (err) {
    console.error(chalk.dim(`  ⚠️  Could not fetch ${packageName}: ${err.message}`));
    return null;
  }
}

/**
 * Check Angular template dependencies against npm registry
 */
export async function checkAngularDependencies(currentMapboxGl) {
  const localPath = path.join(LOCAL_BASE, 'angular', 'package.json');
  let hasChanges = 0;
  const updates = [];
  
  try {
    const local = await getJSONFromFile(localPath);
    
    // Combine dependencies and devDependencies
    const allDeps = {
      ...local.dependencies,
      ...local.devDependencies
    };
    
    // Check each dependency
    for (const [packageName, currentVersion] of Object.entries(allDeps)) {
      // Special handling for mapbox-gl - use provided version
      if (packageName === 'mapbox-gl') {
        const latestMapboxVersion = `^${currentMapboxGl}`;
        if (currentVersion !== latestMapboxVersion) {
          hasChanges++;
          console.log(`±`, chalk.red(latestMapboxVersion), `vs`, currentVersion, `dependencies.${packageName} 🌍`);
          updates.push({
            path: ['dependencies', packageName],
            oldValue: currentVersion,
            newValue: latestMapboxVersion
          });
        }
        continue;
      }
      
      // Fetch latest version from npm
      const latestVersion = await getNpmLatestVersion(packageName);
      
      if (!latestVersion) continue;
      
      // Parse version ranges (handle ^, ~, >=, etc.)
      const currentClean = currentVersion.replace(/^[\^~>=<]+/, '');
      const prefix = currentVersion.match(/^[\^~]/)?.[0] || '^';
      const suggestedVersion = `${prefix}${latestVersion}`;
      
      // Compare versions
      if (currentVersion !== suggestedVersion && currentClean !== latestVersion) {
        hasChanges++;
        const section = local.dependencies?.[packageName] ? 'dependencies' : 'devDependencies';
        console.log(`±`, chalk.red(suggestedVersion), `vs`, currentVersion, `${section}.${packageName}`);
        updates.push({
          path: [section, packageName],
          oldValue: currentVersion,
          newValue: suggestedVersion
        });
      }
    }
    
  } catch (err) {
    console.error(`Error checking Angular dependencies:`, err.message);
  }
  
  return { hasChanges, updates, localPath };
}
