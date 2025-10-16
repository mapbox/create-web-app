import { promises as fs } from 'fs'

async function addSearchFeature(framework, templateType, projectName) {
  console.log(framework, templateType, projectName)
  const searchAppFile = `templates/shared/search-enabled-apps/${framework}/App-${templateType}.${getFileExtension(framework)}`;
  const targetAppFile = getAppFilePath(framework, projectName);
  
  await fs.copyFile(searchAppFile, targetAppFile);
}

function getFileExtension(framework) {
  const map = {
    react: 'jsx',
    vue: 'vue',
    svelte: 'svelte',
    angular: 'ts'
  }
  return map[framework]
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