// Fetchers - Fetch remote data and read local files

import { readFile } from 'fs/promises';

/**
 * Fetch and parse JSON from a remote URL
 */
export function fetchRemoteFile(url) {
  return fetch(url)
    .then(res => res.json())
    .catch(err => {
      throw new Error(`Failed to fetch ${url}: ${err.message}`);
    });
}

/**
 * Read and parse JSON from a local file
 */
export async function getJSONFromFile(filePath) {
  try {
    const data = await readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Failed to read ${filePath}: ${error.message}`);
  }
}

/**
 * Fetch the latest version of mapbox-gl from npm registry
 */
export async function getLatestMapboxGl() {
  try {
    const data = await fetchRemoteFile('https://registry.npmjs.org/mapbox-gl/latest');
    return data.version;
  } catch(err) {
    throw new Error(`Failed to get mapbox-gl version: ${err.message}`);
  }
}
