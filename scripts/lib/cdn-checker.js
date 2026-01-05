// CDN Checker - Check CDN URLs for mapbox-gl version in HTML files

import chalk from 'chalk';
import path from 'path';
import { readFile, writeFile } from 'fs/promises';

const LOCAL_BASE = path.resolve('templates');

/**
 * Check vanilla-no-bundler template for CDN version
 */
export async function checkVanillaNoBundler(currentMapboxGl) {
  const localPath = path.join(LOCAL_BASE, 'vanilla-no-bundler', 'index.html');
  let hasChanges = 0;
  const updates = [];
  
  try {
    const content = await readFile(localPath, 'utf8');
    
    // Look for mapbox-gl CDN links (CSS and JS)
    const cdnRegex = /https:\/\/api\.mapbox\.com\/mapbox-gl-js\/v([\d.]+)\//g;
    const matches = [...content.matchAll(cdnRegex)];
    
    if (matches.length === 0) {
      console.log(chalk.dim('  No CDN links found'));
      return { hasChanges: 0, updates: [], localPath };
    }
    
    // Check each CDN reference
    const uniqueVersions = new Set(matches.map(m => m[1]));
    
    for (const version of uniqueVersions) {
      if (version !== currentMapboxGl) {
        hasChanges++;
        console.log(`±`, chalk.red(`v${currentMapboxGl}`), `vs`, `v${version}`, 'CDN version 🌍');
        updates.push({
          type: 'cdn',
          oldVersion: version,
          newVersion: currentMapboxGl,
          occurrences: matches.filter(m => m[1] === version).length
        });
      }
    }
    
  } catch (err) {
    console.error(`Error checking vanilla-no-bundler CDN:`, err.message);
  }
  
  return { hasChanges, updates, localPath };
}

/**
 * Apply CDN updates to HTML file
 */
export async function applyCDNUpdates(localPath, updates) {
  try {
    let content = await readFile(localPath, 'utf8');
    
    for (const update of updates) {
      if (update.type === 'cdn') {
        // Replace all occurrences of old version with new version in CDN URLs
        const oldUrl = `mapbox-gl-js/v${update.oldVersion}/`;
        const newUrl = `mapbox-gl-js/v${update.newVersion}/`;
        content = content.replaceAll(oldUrl, newUrl);
      }
    }
    
    await writeFile(localPath, content, 'utf8');
    console.log(chalk.green(`✓ Updated ${localPath}`));
    
  } catch (err) {
    console.error(chalk.red(`✗ Failed to update ${localPath}:`), err.message);
  }
}
