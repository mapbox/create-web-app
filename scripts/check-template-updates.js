// Script: check-template-updates.js
// Purpose: Fetch and compare the latest Vite React template's package.json and vite.config.js with create-web-app versions.
// Usage: node scripts/check-template-updates.js

import { readFile } from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

// Map local template folder to Vite upstream template folder
const TEMPLATE_CONFIG = {
  react: 'template-react',
  vue: 'template-vue',
  svelte: 'template-svelte',
  vanilla: 'template-vanilla',
  'vanilla-no-bundler': 'template-vanilla', // fallback to vanilla
  // angular: not a Vite official template
};

const REMOTE_BASE = 'https://raw.githubusercontent.com/vitejs/vite/main/packages/create-vite';
const LOCAL_BASE = path.resolve('templates');
const IGNORE_KEYS = new Set(['name']);

function fetchRemoteFile(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
        .then(res => res.json())
        .then(json => resolve(json))
        .catch(err => reject(err))
  });
}

async function getJSONFromFile(filePath) {
  try {
    const data = await readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error processing file: ${error}`);
    throw error; // Re-throw or handle as appropriate
  }
}

function isObject(val) {
    return typeof val === 'object'
}

async function comparePackageJSONs(template, remoteTemplate) {
    const remoteUrl = `${REMOTE_BASE}/${remoteTemplate}/package.json`;
    const localPath = path.join(LOCAL_BASE, template, 'package.json');
    let hasChanges = 0;
    try {
        const [remote, local] = await Promise.all([
            fetchRemoteFile(remoteUrl),
            getJSONFromFile(localPath)
        ]);

        // recursive function to iterate package.json
        function iteratePackage(objA, objB, path = []) {
            for (const [key, valueA] of Object.entries(objA)) {
                const valueB = objB[key];

                if (IGNORE_KEYS.has(key)) continue;

                if (isObject(valueA) && isObject(valueB)) {
                    iteratePackage(valueA, valueB, [...path, key]);
                } else {
                    compare(valueA, valueB, [...path, key]);
                }
            }
        }

        function compare(a, b, path = []){
            if( a !== b) {
                hasChanges++
                console.log(`±`, chalk.red(a), `vs`, b, path.length > 0 ? path.join('.'): path);
            }
        }

        iteratePackage(remote, local);

    } catch (err) {
      console.error(`Error comparing [${template}] package.json:`, err.message);
    }

    return hasChanges
}

async function main() {
  for (const [template, remoteTemplate] of Object.entries(TEMPLATE_CONFIG)) {
    console.log('\n', chalk.green(template));
    const results = await comparePackageJSONs(template, remoteTemplate);
    if(!results) {
        console.log('🙌 Up to date!');
    }
  }
}

main();
