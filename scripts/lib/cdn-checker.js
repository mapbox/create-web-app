// CDN Checker - Check CDN URLs for mapbox-gl version in HTML files

import chalk from 'chalk';
import path from 'path';
import { fetchRemoteFile } from './fetchers.js';
import { readFile, writeFile } from 'fs/promises';

const LOCAL_BASE = path.resolve('templates');

async function getLatestSearchJsVersion() {
    const data = await fetchRemoteFile('https://registry.npmjs.org/@mapbox/search-js-web/latest');
    return data.version;
}

/**
 * Check vanilla-no-bundler template for CDN version
 */
export async function checkVanillaNoBundler(currentMapboxGl) {

    const currentSearchJs = await getLatestSearchJsVersion();
  
    // Check CDN links in both no-bundlers apps
    const localPaths = [
        path.join(LOCAL_BASE, 'vanilla-no-bundler', 'index.html'),
        path.join(LOCAL_BASE, 'shared/search-enabled-apps/vanilla-no-bundler', 'index.html'),
    ]
    let hasChanges = 0;
    const fileResults = [];
  
    for (const localPath of localPaths) {
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
                    fileResults.push({
                        localPath: localPath,
                        updates: {
                            type: 'cdn',
                            oldVersion: version,
                            newVersion: currentMapboxGl,
                            occurrences: matches.filter(m => m[1] === version).length
                        }
                    });
                }
            }

            // Look for search-js CDN links
            const searchRegex = /https:\/\/api\.mapbox\.com\/search-js\/v([\d.]+)\//g;
            const searchMatches = [...content.matchAll(searchRegex)];

            if (searchMatches.length > 0) {
                const searchVersions = new Set(searchMatches.map(m => m[1]));
                for (const version of searchVersions) {
                    if (version !== currentSearchJs) {
                        hasChanges++;
                        console.log(`±`, chalk.red(`v${currentSearchJs}`), `vs`, `v${version}`, 'Search JS CDN version 🔍');
                         fileResults.push({
                            localPath: localPath,
                            updates: {
                                type: 'search-cdn',
                                oldVersion: version,
                                newVersion: currentSearchJs,
                                occurrences: matches.filter(m => m[1] === version).length
                            }
                        });
                    }
                }
            }
            
        } catch (err) {
            console.error(`Error checking vanilla-no-bundler CDN:`, err.message);
        }
    }
 
  
  return { hasChanges, fileResults };
}

/**
 * Apply CDN updates to HTML file
 */
export async function applyCDNUpdates(localPath, updates) {
    try {
        let content = await readFile(localPath, 'utf8');
    
        if (updates.type === 'cdn') {
            // Replace all occurrences of old version with new version in CDN URLs
            const oldUrl = `mapbox-gl-js/v${updates.oldVersion}/`;
            const newUrl = `mapbox-gl-js/v${updates.newVersion}/`;
            content = content.replaceAll(oldUrl, newUrl);
        } else if ( updates.type === 'search-cdn') {
            const oldUrl = `search-js/v${updates.oldVersion}/`;
            const newUrl = `search-js/v${updates.newVersion}/`;
            content = content.replaceAll(oldUrl, newUrl);
        }
        
        
        await writeFile(localPath, content, 'utf8');
        console.log(chalk.green(`✓ Updated ${localPath}`));
        
    } catch (err) {
        console.error(chalk.red(`✗ Failed to update ${localPath}:`), err.message);
    }
}
