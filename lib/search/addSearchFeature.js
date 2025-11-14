import { promises as fs } from 'fs'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory of this module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Go up two levels from lib/search to package root
const packageRoot = join(__dirname, '..', '..');

async function addSearchFeature(framework, projectName) {
  const searchAppFile = getSearchAppFilePath(framework);
  const targetAppFile = getAppFilePath(framework, projectName);
  
  await fs.copyFile(searchAppFile, targetAppFile);
}

function getSearchAppFilePath(framework) {
  const frameworkPaths = {
    'react': join(packageRoot, 'templates/shared/search-enabled-apps', framework, 'App.jsx'),
    'vue': join(packageRoot, 'templates/shared/search-enabled-apps', framework, 'src/App.vue'), 
    'svelte': join(packageRoot, 'templates/shared/search-enabled-apps', framework, 'src/App.svelte'),
    'angular': join(packageRoot, 'templates/shared/search-enabled-apps', framework, 'map.component.ts'),
    'vanilla': join(packageRoot, 'templates/shared/search-enabled-apps', framework, 'main.js'),
    'vanilla-no-bundler': join(packageRoot, 'templates/shared/search-enabled-apps', framework, 'index.html')
  };

  return frameworkPaths[framework];
}

function getAppFilePath(framework, projectName) {
  const frameworkPaths = {
    'react': `${projectName}/src/App.jsx`,
    'vue': `${projectName}/src/App.vue`, 
    'svelte': `${projectName}/src/App.svelte`,
    'angular': `${projectName}/src/app/map/map.component.ts`,
    'vanilla': `${projectName}/src/main.js`,
    'vanilla-no-bundler': `${projectName}/index.html`
  };
  
  return frameworkPaths[framework];
}

export default addSearchFeature