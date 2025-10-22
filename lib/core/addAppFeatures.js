import { promises as fs } from 'fs'

export async function addSearchFeature(framework, projectName) {
  const searchAppFile = `templates/shared/search-enabled-apps/${framework}/App-.${getFileExtension(framework)}`;
  const targetAppFile = getAppFilePath(framework, projectName);
  
  await fs.copyFile(searchAppFile, targetAppFile);
}


export async function addMapboxGLJS(framework, projectName) {
 const mapAppComponent = `templates/${framework}/src/App.${getFileExtension(framework)}`;
 const cssFile = getLocalCSSPath(framework)

 const targetAppFile = getAppFilePath(framework, projectName);
 const targetCssFile = getCSSFilePath(framework, projectName);
  
 await fs.copyFile(mapAppComponent, targetAppFile);
 await fs.copyFile(cssFile, targetCssFile);
}


function getCSSFilePath(framework, projectName) {
    const frameworkPaths = {
    'react': `${projectName}/src/App.css`,
    'vue': `${projectName}/src/assets/main.css`, 
    'svelte': `${projectName}/src/app.css`,
    'angular': `${projectName}/src/app/app.component.ts`
  };

  return frameworkPaths[framework]
}

// Add a new function for source template paths
function getLocalCSSPath(framework) {
    const frameworkPaths = {
        'react': `templates/react/src/App.css`,
        'vue': `templates/vue/src/assets/main.css`,
        'svelte': `templates/svelte/src/app.css`, 
        'angular': `templates/angular/src/app/app.component.ts`
    };

    return frameworkPaths[framework];
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