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
 * Parse a semver range like ">=5.9 <6.0" and return { min, max } as [major, minor] tuples.
 * Returns null bounds for parts that aren't present.
 */
function parseVersionRange(range) {
  const upper = range.match(/<\s*(\d+)(?:\.(\d+))?/);
  const lower = range.match(/>=\s*(\d+)(?:\.(\d+))?/);
  return {
    maxMajor: upper ? parseInt(upper[1]) : Infinity,
    maxMinor: upper?.[2] !== undefined ? parseInt(upper[2]) : Infinity,
    minMajor: lower ? parseInt(lower[1]) : 0,
    minMinor: lower?.[2] !== undefined ? parseInt(lower[2]) : 0,
  };
}

function versionSatisfies(version, { minMajor, minMinor, maxMajor, maxMinor }) {
  const [maj, min] = version.split('.').map(Number);
  const aboveMin = maj > minMajor || (maj === minMajor && min >= minMinor);
  const belowMax = maj < maxMajor || (maj === maxMajor && min < maxMinor);
  return aboveMin && belowMax;
}

/**
 * Fetch the latest stable version of a package satisfying a semver range string.
 */
async function getNpmLatestVersionSatisfying(packageName, constraint) {
  try {
    const data = await fetchRemoteFile(`https://registry.npmjs.org/${packageName}`);
    const bounds = parseVersionRange(constraint);
    const stable = Object.keys(data.versions).filter(v => !v.includes('-'));
    const match = stable.reverse().find(v => versionSatisfies(v, bounds));
    return match || null;
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
    
    // Fetch @angular-devkit/build-angular peer deps once to constrain TypeScript resolution
    const buildAngularVersion = local.devDependencies?.['@angular-devkit/build-angular']?.replace(/^[\^~]/, '');
    let typescriptConstraint = null;
    if (buildAngularVersion) {
      try {
        const buildAngularMeta = await fetchRemoteFile(`https://registry.npmjs.org/@angular-devkit/build-angular/${buildAngularVersion}`);
        typescriptConstraint = buildAngularMeta.peerDependencies?.typescript || null;
      } catch {
        // fall through to unconstrained latest
      }
    }

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
      
      // For TypeScript, respect @angular-devkit/build-angular's peer dep constraint
      const latestVersion = (packageName === 'typescript' && typescriptConstraint)
        ? await getNpmLatestVersionSatisfying('typescript', typescriptConstraint)
        : await getNpmLatestVersion(packageName);
      
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
