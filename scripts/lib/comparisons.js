// Comparisons - Compare remote and local package.json files

import chalk from 'chalk';
import path from 'path';
import { fetchRemoteFile, getJSONFromFile } from './fetchers.js';

const REMOTE_BASE = 'https://raw.githubusercontent.com/vitejs/vite/main/packages/create-vite';
const LOCAL_BASE = path.resolve('templates');

function isObject(val) {
  return typeof val === 'object' && val !== null;
}

/**
 * Compare local and remote package.json files
 * Returns object with hasChanges, updates array, and localPath
 */
export async function comparePackageJSONs(template, remoteTemplate, currentMapboxGl) {
  const remoteUrl = `${REMOTE_BASE}/${remoteTemplate}/package.json`;
  const localPath = path.join(LOCAL_BASE, template, 'package.json');
  let hasChanges = 0;
  const updates = [];
  
  try {
    const [remote, local] = await Promise.all([
      fetchRemoteFile(remoteUrl),
      getJSONFromFile(localPath)
    ]);

    // Recursive function to iterate through package.json objects
    function checkRemoteTemplates(objA, objB, pathArr = []) {
      for (const [key, valueA] of Object.entries(objA)) {
        const valueB = objB[key];

        // Skip name field
        if (key === 'name') continue;

        if (isObject(valueA) && isObject(valueB)) {
          checkRemoteTemplates(valueA, valueB, [...pathArr, key]);
        } else {
          compare(valueA, valueB, [...pathArr, key]);
        }
      }
    }

    function compare(a, b, pathArr = []) {
      if (a !== b) {
        hasChanges++;
        const pathStr = pathArr.length > 0 ? pathArr.join('.') : '';
        console.log(`±`, chalk.red(a), `vs`, b, pathStr);
        updates.push({ path: pathArr, oldValue: b, newValue: a });
      }
    }

    // Check remote Vite template deps versions & compare to local templates
    checkRemoteTemplates(remote, local);

    // Check Mapbox GL JS version in local template
    const latestMapboxVersion = `^${currentMapboxGl}`;
    if (local.dependencies?.['mapbox-gl'] !== latestMapboxVersion) {
      hasChanges++;
      console.log(`±`, chalk.red(latestMapboxVersion), `vs`, local.dependencies?.['mapbox-gl'], 'dependencies.mapbox-gl 🌍');
      updates.push({ 
        path: ['dependencies', 'mapbox-gl'], 
        oldValue: local.dependencies?.['mapbox-gl'], 
        newValue: latestMapboxVersion 
      });
    }

  } catch (err) {
    console.error(`Error comparing [${template}] package.json:`, err.message);
  }

  return { hasChanges, updates, localPath };
}
