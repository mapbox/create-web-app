// Script: check-template-updates.js
// Purpose: Fetch and compare the latest Vite React template's package.json and vite.config.js with create-web-app versions.
// Usage: node scripts/check-template-updates.js
// Options: --update (interactive update mode)

import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

// Map local template folder to Vite upstream template folder
const TEMPLATE_CONFIG = {
  react: 'template-react',
  vue: 'template-vue',
  svelte: 'template-svelte',
  vanilla: 'template-vanilla',
  // angular & vanilla-no-bundler: not Vite official templates
};

const REMOTE_BASE = 'https://raw.githubusercontent.com/vitejs/vite/main/packages/create-vite';
const LOCAL_BASE = path.resolve('templates');
const UPDATE_MODE = process.argv.includes('--update');

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

async function comparePackageJSONs(template, remoteTemplate, currentMapboxGl) {
    const remoteUrl = `${REMOTE_BASE}/${remoteTemplate}/package.json`;
    const localPath = path.join(LOCAL_BASE, template, 'package.json');
    let hasChanges = 0;
    const updates = [];
    
    try {
        const [remote, local] = await Promise.all([
            fetchRemoteFile(remoteUrl),
            getJSONFromFile(localPath)
        ]);

        // recursive function to iterate package.json
        function checkRemoteTemplates(objA, objB, path = []) {
            for (const [key, valueA] of Object.entries(objA)) {
                const valueB = objB[key];

                if (key === 'name') continue;

                if (isObject(valueA) && isObject(valueB)) {
                    checkRemoteTemplates(valueA, valueB, [...path, key]);
                } else {
                    compare(valueA, valueB, [...path, key]);
                }
            }
        }

        function compare(a, b, path = []){
            if( a !== b) {
                hasChanges++
                const pathStr = path.length > 0 ? path.join('.'): path;
                console.log(`±`, chalk.red(a), `vs`, b, pathStr);
                updates.push({ path, oldValue: b, newValue: a });
            }
        }

        // Check Remote vite template deps versions & compare to local templates
        checkRemoteTemplates(remote, local);

        // Check Mapbox GL JS Version in local template
        const latestMapboxVersion = `^${currentMapboxGl}`;
        if(local.dependencies['mapbox-gl'] !== latestMapboxVersion) {
          hasChanges++
          console.log(`±`, chalk.red(latestMapboxVersion), `vs`, local.dependencies['mapbox-gl'], 'dependencies.mapbox-gl 🌍');
          updates.push({ 
            path: ['dependencies', 'mapbox-gl'], 
            oldValue: local.dependencies['mapbox-gl'], 
            newValue: latestMapboxVersion 
          });
        }


    } catch (err) {
      console.error(`Error comparing [${template}] package.json:`, err.message);
    }

    return { hasChanges, updates, localPath };
}

async function getLatestMapboxGl() {
  
  try {
    const version = fetch('https://registry.npmjs.org/mapbox-gl/latest')
      .then(r => r.json())
      .then(data => data.version)
    return version;

  } catch(err) {
    console.log("Error getting mapbox-gl version: ", err);
  }
}

async function applyUpdates(localPath, updates) {
  try {
    const packageJson = await getJSONFromFile(localPath);
    
    // Apply each update
    for (const update of updates) {
      let obj = packageJson;
      const lastKey = update.path[update.path.length - 1];
      
      // Navigate to the parent object
      for (let i = 0; i < update.path.length - 1; i++) {
        obj = obj[update.path[i]];
      }
      
      // Update the value
      obj[lastKey] = update.newValue;
    }
    
    // Write back to file with pretty formatting
    await writeFile(localPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');
    console.log(chalk.green(`✓ Updated ${localPath}`));
    
  } catch (err) {
    console.error(chalk.red(`✗ Failed to update ${localPath}:`), err.message);
  }
}

async function main() {
  const currentMapboxGl = await getLatestMapboxGl();
  const templateResults = [];
  
  console.log(chalk.cyan(`\n🔍 Checking templates against latest versions...\n`));
  console.log(chalk.dim(`Latest mapbox-gl: v${currentMapboxGl}\n`));
  
  // Check all templates
  for (const [template, remoteTemplate] of Object.entries(TEMPLATE_CONFIG)) {
    console.log(chalk.green(`\n📦 ${template}`));
    const results = await comparePackageJSONs(template, remoteTemplate, currentMapboxGl);
    
    if(!results.hasChanges) {
        console.log(chalk.dim('🙌 Up to date!'));
    }
    
    templateResults.push({ template, ...results });
  }
  
  // If not in update mode, exit here
  if (!UPDATE_MODE) {
    console.log(chalk.cyan('\n\n💡 To update package.json files, run: node scripts/check-template-updates.js --update\n'));
    return;
  }
  
  // Filter templates that have changes
  const templatesWithChanges = templateResults.filter(t => t.hasChanges > 0);
  
  if (templatesWithChanges.length === 0) {
    console.log(chalk.green('\n✨ All templates are up to date!\n'));
    return;
  }
  
  // Interactive update mode
  console.log(chalk.cyan('\n\n📝 Update Mode\n'));
  
  const { updateStrategy } = await inquirer.prompt([
    {
      type: 'list',
      name: 'updateStrategy',
      message: 'How would you like to update the templates?',
      choices: [
        { name: 'Update all templates with changes', value: 'all' },
        { name: 'Select specific templates to update', value: 'specific' },
        { name: 'Exit without updating', value: 'none' }
      ]
    }
  ]);
  
  if (updateStrategy === 'none') {
    console.log(chalk.dim('No changes made.\n'));
    return;
  }
  
  let templatesToUpdate = templatesWithChanges;
  
  if (updateStrategy === 'specific') {
    const { selectedTemplates } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selectedTemplates',
        message: 'Select templates to update:',
        choices: templatesWithChanges.map(t => ({
          name: `${t.template} (${t.hasChanges} change${t.hasChanges > 1 ? 's' : ''})`,
          value: t.template,
          checked: false
        }))
      }
    ]);
    
    templatesToUpdate = templatesWithChanges.filter(t => 
      selectedTemplates.includes(t.template)
    );
  }
  
  if (templatesToUpdate.length === 0) {
    console.log(chalk.dim('No templates selected.\n'));
    return;
  }
  
  // Confirm before applying updates
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Update ${templatesToUpdate.length} template${templatesToUpdate.length > 1 ? 's' : ''}?`,
      default: true
    }
  ]);
  
  if (!confirm) {
    console.log(chalk.dim('Update cancelled.\n'));
    return;
  }
  
  // Apply updates
  console.log(chalk.cyan('\n📝 Applying updates...\n'));
  for (const template of templatesToUpdate) {
    await applyUpdates(template.localPath, template.updates);
  }
  
  console.log(chalk.green('\n✨ Updates complete!\n'));
}

main();
