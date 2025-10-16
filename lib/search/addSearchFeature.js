import { promises as fs } from 'fs'
import { patternsModule } from "./searchPatterns.js";

async function addSearchFeature(framework, projectName) {
  const patterns = patternsModule[`${framework}Patterns`];
  console.log(patternsModule)
  console.log("patterns", patterns)
  
  const appFilePath = getAppFilePath(framework, projectName);
  let appContent = await fs.readFile(appFilePath, 'utf8');
  
  // Read snippet files
  console.log("framework:", framework)
  const snippets = await loadSnippets(framework);
  console.log("snippets", snippets)
  
  // Apply regex replacements
  appContent = appContent.replace(patterns.imports, `$1${snippets.imports}\n`);
  appContent = appContent.replace(patterns.searchLogic, `$1${snippets.searchLogic}\n$1$2`);

  if(framework === 'react') {
    await fs.writeFile(`${projectName}/src/SearchBoxComponent.jsx`, snippets.component, 'utf8');
  }
  
  await fs.writeFile(appFilePath, appContent);
}

async function loadSnippets(framework) {
  
  // Read snippet files
  const imports = await fs.readFile(`templates/shared/search-snippets/${framework}/searchImport.js`, 'utf8');
  let component 

  if(framework === 'react') {
    component = await fs.readFile(`templates/shared/search-snippets/${framework}/SearchBoxComponent.jsx`, 'utf8');
  } else {
    console.log("some other framework was selected")
    // const component = await fs.readFile(`templates/shared/search-snippets/${framework}/callSearchBox.js`, 'utf8');
  }

  const searchLogic = await fs.readFile(`templates/shared/search-snippets/${framework}/callSearch.js`, 'utf8');

  const snippets = {
    imports,
    component,
    searchLogic
  }

 return snippets
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