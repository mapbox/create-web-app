import { promises as fs } from 'fs'

async function addSearchFeature(framework, projectName) {
  // console.log(framework, templateType, projectName)
  const searchAppFile = getSearchAppFilePath(framework);

  const targetAppFile = getAppFilePath(framework, projectName);
  
  await fs.copyFile(searchAppFile, targetAppFile);
}

function getSearchAppFilePath(framework) {
  const frameworkPaths = {
    'react': `templates/shared/search-enabled-apps/${framework}/App.jsx`,
    'vue': `templates/shared/search-enabled-apps/${framework}/src/App.vue`, 
    'svelte': `templates/shared/search-enabled-apps/${framework}/src/App.svelte`,
    'angular': `templates/shared/search-enabled-apps/${framework}/src/app/app.component.ts`
  };

  return frameworkPaths[framework];
}

function getAppFilePath(framework, projectName) {
  const frameworkPaths = {
    'react': `${projectName}/src/App.jsx`,
    'vue': `${projectName}/src/App.vue`, 
    'svelte': `${projectName}/src/App.svelte`,
    'angular': `${projectName}/src/app/app.component.ts`
  };
  
  return frameworkPaths[framework];
}

export default addSearchFeature